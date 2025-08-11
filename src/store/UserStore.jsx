import { create } from 'zustand';
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
 * @property {() => Promise<void>} fetchCurrentUser - Fetches the profile of the logged-in user.
 * @property {(page?: number) => Promise<void>} fetchUsers - Fetches a list of all users.
 * @property {(userId: number) => Promise<void>} fetchUser - Fetches a single user's profile.
 * @property {(userId: number, page?: number) => Promise<void>} fetchUserActions - Fetches a user's activity log.
 * @property {(data: Object) => Promise<User|undefined>} createUser - Creates a new user.
 * @property {(userId: number, data: Object) => Promise<void>} updateUser - Updates core user data.
 * @property {(userId: number, data: Object) => Promise<void>} updateUserDetails - Updates user's personal details.
 * @property {(userId: number, data: Object) => Promise<void>} updateUserLocation - Updates user's location.
 * @property {(userId: number, data: Object) => Promise<void>} updateEntrepreneurDetails - Updates user's business details.
 * @property {(userId: number, role: string) => Promise<void>} updateUserRole - Updates a user's role.
 * @property {(userId: number) => Promise<void>} deleteUser - Deletes a user account.
 * @property {() => Promise<void>} logoutUser - Logs the current user out.
 * @property {() => void} clearCurrentUser - Clears user data from state on logout.
 */

/**
 * @typedef {UserState & UserActions} UserStore
 */

/** @type {import('zustand').StoreCreator<UserStore>} */
export const useUserStore = create((set, get) => ({
  currentUser: null,
  users: [],
  selectedUser: null,
  userActions: [],
  pagination: null,
  loading: false,
  error: null,
  message: null,

  _handleApiResponse: async (apiPromise) => {
    set({ loading: true, error: null, message: null });
    try {
      const response = await apiPromise;
      const jsonResponse = await response.json();
      if (!response.ok || jsonResponse.errors) {
        throw new Error(jsonResponse.errors || 'An API error occurred');
      }
      return jsonResponse;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },
  
  _updateUserState: (updatedData) => {
    const userId = updatedData.user?.id || updatedData.user_detail?.user_id || updatedData.id;
    set(state => {
      let newCurrentUser = state.currentUser;
      let newSelectedUser = state.selectedUser;

      const updateUserState = (user) => {
        if (!user) return null;
        return {
          ...user,
          ...(updatedData.user && { ...updatedData.user }),
          ...(updatedData.user_detail && { user_detail: updatedData.user_detail }),
          ...(updatedData.location && { location: updatedData.location }),
          ...(updatedData.entrepreneur_detail && { entrepreneur_detail: updatedData.entrepreneur_detail }),
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
        message: updatedData.message,
        loading: false,
      };
    });
  },

  fetchCurrentUser: async () => {
    const { fetchApi } = useApiStore.getState();
    try {
      const json = await get()._handleApiResponse(fetchApi('usersMe', { method: 'GET' }));
      set({ currentUser: json.user, loading: false });
    } catch (error) {

/** @type {import('zustand').StoreCreator<UserState>} */
export const userStore = create((set) => ({
  user: null,
  token: localStorage.getItem("authToken") || null,
  setUser: (user, token) => {
    set({ user, token: token || null });
    if (token) {
      useApiStore.getState().setToken(token);
    }
  },

  fetchUsers: async (page = 1) => {
    const { fetchApi } = useApiStore.getState();
    const endpoint = `usersIndex?page=${page}`;
    try {
      const json = await get()._handleApiResponse(fetchApi(endpoint, { method: 'GET' }));
      set({ users: json.users, pagination: json.meta, loading: false });
    } catch (error) {

    }
  },

  fetchUser: async (userId) => {
    const { fetchApi } = useApiStore.getState();
    try {
      const json = await get()._handleApiResponse(fetchApi('usersShow', { method: 'GET' }, { id: userId }));
      set({ selectedUser: json.user, loading: false });
    } catch (error) {
      
    }
  },

  createUser: async (data) => {
    const { fetchApi } = useApiStore.getState();
    try {
      const json = await get()._handleApiResponse(fetchApi('usersCreate', { method: 'POST', body: JSON.stringify(data) }));
      set({ message: json.message, loading: false });
      return json.user;
    } catch (error) {
     
    }
  },

  updateUser: async (userId, data) => {
    const { fetchApi } = useApiStore.getState();
    try {
      const json = await get()._handleApiResponse(fetchApi('usersUpdate', { method: 'PATCH', body: JSON.stringify(data) }, { id: userId }));
      get()._updateUserState(json);
    } catch (error) {

    }
  },
  
  updateUserDetails: async (userId, data) => {
    const { fetchApi } = useApiStore.getState();
    try {
      const json = await get()._handleApiResponse(fetchApi('usersUpdateDetails', { method: 'PATCH', body: JSON.stringify(data) }, { id: userId }));
      get()._updateUserState(json);
    } catch (error) {

    }
  },

  updateUserLocation: async (userId, data) => {
    const { fetchApi } = useApiStore.getState();
    try {
      const json = await get()._handleApiResponse(fetchApi('usersUpdateLocation', { method: 'PATCH', body: JSON.stringify(data) }, { id: userId }));
      get()._updateUserState(json);
    } catch (error) {

    }
  },

  updateEntrepreneurDetails: async (userId, data) => {
    const { fetchApi } = useApiStore.getState();
    try {
      const json = await get()._handleApiResponse(fetchApi('usersUpdateEntrepreneur', { method: 'PATCH', body: JSON.stringify(data) }, { id: userId }));
      get()._updateUserState(json);
    } catch (error) {
      
    }
  },

  deleteUser: async (userId) => {
    const { fetchApi } = useApiStore.getState();
    try {
      await get()._handleApiResponse(fetchApi('usersDestroy', { method: 'DELETE' }, { id: userId }));
      set(state => ({
        users: state.users.filter(u => u.id !== userId),
        loading: false,
      }));
    } catch (error) {

    }
  },

  logoutUser: async () => {
    const { fetchApi, setToken } = useApiStore.getState();
    try {
      await get()._handleApiResponse(fetchApi('usersLogout', { method: 'POST' }));
      setToken(null); 
      get().clearCurrentUser(); 
    } catch (error) {

      setToken(null);
      get().clearCurrentUser();
    }
  },

  clearCurrentUser: () => {
    set({ currentUser: null, error: null, message: null, loading: false });
  },
}));