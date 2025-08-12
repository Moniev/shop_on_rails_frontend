import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useApiStore } from './ApiStore';

/**
 * @typedef {Object} Location
 * @property {number} id
 * @property {string} country
 * @property {string} province
 * @property {string} city
 * @property {string} postal_code
 * @property {string} street
 * @property {string} building_number
 * @property {string} [apartment_number]
 */

/**
 * @typedef {Object} EntrepreneurDetail
 * @property {number} id
 * @property {string} business_name
 * @property {string} nip
 * @property {string} krs
 * @property {string} description
 * @property {string} offer
 * @property {number} income
 * @property {number} costs
 * @property {number} funding_capital
 * @property {string} industry
 * @property {string[]} management_council_members 
 * @property {string[]} decision_makers 
 * @property {string} business_phone_number
 * @property {string} business_mail
 * @property {string} website_address
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} UserDetail
 * @property {number} id
 * @property {string} name
 * @property {string} first_name
 * @property {string} last_name
 */

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} mail
 * @property {string} [phone]
 * @property {string} role
 * @property {boolean} active
 * @property {boolean} verified
 * @property {UserDetail} [user_detail]
 * @property {Location} [location]
 * @property {EntrepreneurDetail} [entrepreneur_detail]
 */

/**
 * @typedef {Object} UserActionItem
 * @property {number} id
 * @property {string} action_type
 * @property {Object} action
 * @property {string} created_at
 */

/**
 * @typedef {Object} PaginationMeta
 * @property {number} current_page
 * @property {number} [next_page]
 * @property {number} [prev_page]
 * @property {number} total_pages
 * @property {number} total_count
 */

/**
 * @typedef {Object} UserState
 * @property {User|null} currentUser - The currently logged-in user.
 * @property {User[]} users - A list of all users (for admin views).
 * @property {User|null} selectedUser - A user selected in an admin view.
 * @property {UserActionItem[]} userActions - A list of actions for a selected user.
 * @property {PaginationMeta|null} pagination - Pagination for lists.
 * @property {boolean} loading - Indicates if an API operation is in progress.
 * @property {string|Object|null} error - Stores API error messages.
 * @property {string|null} message - Stores API success messages.
 */

/**
 * @typedef {Object} UserActions
 * @property {(user: User) => void} setCurrentUser - Directly sets the current user.
 * @property {() => Promise<void>} fetchCurrentUser - Fetches the profile of the logged-in user.
 * @property {(page?: number) => Promise<void>} fetchUsers - Fetches a list of all users.
 * @property {(userId: number) => Promise<void>} fetchUser - Fetches a single user's profile.
 * @property {(userId: number, page?: number) => Promise<void>} fetchUserActions - Fetches a user's activity log.
 * @property {(data: Object) => Promise<User|undefined>} createUser - Creates a new user.
 * @property {(userId: number, data: Object) => Promise<boolean>} updateUser - Updates core user data.
 * @property {(userId: number, data: Object) => Promise<boolean>} updateUserDetails - Updates user's personal details.
 * @property {(userId: number, data: Object) => Promise<boolean>} updateUserLocation - Updates user's location.
 * @property {(userId: number, data: Object) => Promise<boolean>} updateEntrepreneurDetails - Updates user's business details.
 * @property {(userId: number, role: string) => Promise<boolean>} updateUserRole - Updates a user's role.
 * @property {(userId: number) => Promise<boolean>} deleteUser - Deletes a user account.
 * @property {() => void} clearCurrentUser - Clears user data from state on logout.
 */

/**
 * @typedef {UserState & UserActions} UserStore
 */

/** @type {import('zustand').StoreCreator<UserStore>} */
export const useUserStore = create(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      selectedUser: null,
      userActions: [],
      pagination: null,
      loading: false,
      error: null,
      message: null,

      _handleApiCall: async (apiCall) => {
        set({ loading: true, error: null, message: null });
        try {
          const response = await apiCall();
          if (response.message) {
            set({ message: response.message });
          }
          return response;
        } catch (error) {
          const errorMessages = error.errors || error.message || 'An unknown user error occurred.';
          set({ error: errorMessages });
          throw error;
        } finally {
          set({ loading: false });
        }
      },
      
      _updateUserState: (updatedData) => {
        const data = updatedData.data;
        const userId = data.user?.id || data.user_detail?.user_id || data.id;
        
        set(state => {
          let newCurrentUser = state.currentUser;
          let newSelectedUser = state.selectedUser;

          const updateUserState = (user) => {
            if (!user) return null;
            return {
              ...user,
              ...(data.user && { ...data.user }),
              ...(data.user_detail && { user_detail: data.user_detail }),
              ...(data.location && { location: data.location }),
              ...(data.entrepreneur_detail && { entrepreneur_detail: data.entrepreneur_detail }),
            };
          };
          
          if (state.currentUser?.id === userId) {
            newCurrentUser = updateUserState(state.currentUser);
          }
          if (state.selectedUser?.id === userId) {
            newSelectedUser = updateUserState(state.selectedUser);
          }

          return {
            currentUser: newCurrentUser,
            selectedUser: newSelectedUser,
          };
        });
      },

      setCurrentUser: (user) => {
        set({ currentUser: user });
      },

      fetchCurrentUser: async () => {
        const { client } = useApiStore.getState();
        try {
          const response = await get()._handleApiCall(() => client.get('api/v1/users/me'));
          set({ currentUser: response.data.user });
        } catch (error) {
          
        }
      },

      fetchUsers: async (page = 1) => {
        const { client } = useApiStore.getState();
        try {
          const response = await get()._handleApiCall(() => client.get('api/v1/users', { params: { page } }));
          set({ users: response.data.users, pagination: response.data.meta });
        } catch (error) {
          
        }
      },

      fetchUser: async (userId) => {
        const { client } = useApiStore.getState();
        try {
          const response = await get()._handleApiCall(() => client.get(`api/v1/users/${userId}`));
          set({ selectedUser: response.data.user });
        } catch (error) {
          
        }
      },

      fetchUserActions: async (userId, page = 1) => {
        const { client } = useApiStore.getState();
        try {
            const response = await get()._handleApiCall(() => client.get(`api/v1/users/${userId}/actions`, { params: { page } }));
            set({ userActions: response.data.actions, pagination: response.data.meta });
        } catch (error) {
            
        }
      },

      createUser: async (data) => {
        const { client } = useApiStore.getState();
        try {
          const response = await get()._handleApiCall(() => client.post('api/v1/users', data));
          return response.data.user;
        } catch (error) {
         return undefined;
        }
      },

      updateUser: async (userId, data) => {
        const { client } = useApiStore.getState();
        try {
          const response = await get()._handleApiCall(() => client.patch(`api/v1/users/${userId}`, data));
          get()._updateUserState(response);
          return true;
        } catch (error) {
          return false;
        }
      },
      
      updateUserDetails: async (userId, data) => {
        const { client } = useApiStore.getState();
        try {
          const response = await get()._handleApiCall(() => client.patch(`api/v1/users/${userId}/update_details`, data));
          get()._updateUserState(response);
          return true;
        } catch (error) {
          return false;
        }
      },

      updateUserLocation: async (userId, data) => {
        const { client } = useApiStore.getState();
        try {
          const response = await get()._handleApiCall(() => client.patch(`api/v1/users/${userId}/update_location`, data));
          get()._updateUserState(response);
          return true;
        } catch (error) {
          return false;
        }
      },

      updateEntrepreneurDetails: async (userId, data) => {
        const { client } = useApiStore.getState();
        try {
          const response = await get()._handleApiCall(() => client.patch(`api/v1/users/${userId}/update_entrepreneur_details`, data));
          get()._updateUserState(response);
          return true;
        } catch (error) {
          return false;
        }
      },

      updateUserRole: async (userId, role) => {
          const { client } = useApiStore.getState();
          try {
              const response = await get()._handleApiCall(() => client.patch(`api/v1/users/${userId}/role/update`, { role }));
              get()._updateUserState(response);
              return true;
          } catch (error) {
              return false;
          }
      },

      deleteUser: async (userId) => {
        const { client } = useApiStore.getState();
        try {
          await get()._handleApiCall(() => client.delete(`api/v1/users/${userId}`));
          set(state => ({
            users: state.users.filter(u => u.id !== userId),
          }));
          return true;
        } catch (error) {
          return false;
        }
      },

      clearCurrentUser: () => {
        set({ currentUser: null, error: null, message: null, loading: false });
      },
    }),
    {
      name: 'user-auth-storage', 
      storage: createJSONStorage(() => localStorage), 
      partialize: (state) => ({ currentUser: state.currentUser }), 
    }
  )
);
