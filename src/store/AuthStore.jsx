import { create } from 'zustand';
import { useApiStore } from './ApiStore';
import { useUserStore } from './UserStore';

/**
 * @typedef {Object} AuthState
 * @property {boolean} loading - Indicates if an auth operation is in progress.
 * @property {string|Object|null} error - Stores API error messages from auth actions.
 * @property {string|null} message - Stores API success messages from auth actions.
 */

/**
 * @typedef {Object} AuthActions
 * @property {(credentials: Object) => Promise<boolean>} login - Logs the user in.
 * @property {(userData: Object) => Promise<boolean>} register - Registers a new user.
 * @property {() => Promise<void>} logout - Logs the user out.
 * @property {(token: string) => Promise<boolean>} activateAccount - Activates an account using a token.
 * @property {(email: string) => Promise<boolean>} requestPasswordReset - Sends a password reset email.
 * @property {(data: Object) => Promise<boolean>} confirmPasswordReset - Confirms password reset with a token.
 * @property {(code: string) => Promise<boolean>} verifyTwoFactor - Verifies a 2FA code.
 * @property {() => void} clearAuthStatus - Clears error and message fields.
 */

/**
 * @typedef {AuthState & AuthActions} AuthStore
 */

/** @type {import('zustand').StoreCreator<AuthStore>} */
export const useAuthStore = create((set, get) => ({
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
      return response.data;
    } catch (error) {
      const errorMessages = error.errors || error.message || 'An unknown authentication error occurred.';
      set({ error: errorMessages });
      throw new Error(Array.isArray(errorMessages) ? errorMessages.join(', ') : errorMessages);
    } finally {
      set({ loading: false });
    }
  },
  
  _handleLoginSuccess: async (data) => {
    if (!data || !data.token) {
      throw new Error('API response is missing token.');
    }
    const { setToken } = useApiStore.getState();
    const { fetchCurrentUser } = useUserStore.getState();
    
    setToken(data.token);

    await fetchCurrentUser();
  },

  login: async (credentials) => {
    const { client } = useApiStore.getState();
    try {
      const data = await get()._handleApiCall(() => 
        client.post('api/v1/auth/login', credentials)
      );

      await get()._handleLoginSuccess(data);
      return true;
    } catch (error) {
      return false;
    }
  },

  logout: async () => {
    const { client, setToken } = useApiStore.getState();
    const { clearCurrentUser } = useUserStore.getState();
    
    setToken(null);
    clearCurrentUser();
    set({ message: 'Successfully logged out.' });

    try {

      await client.post('api/v1/users/logout');
    } catch (error) {
    }
  },

  register: async (userData) => {
    const { client } = useApiStore.getState();
    try {
      await get()._handleApiCall(() => 
        client.post('api/v1/users', { user: userData })
      );
      return true;
    } catch (error) {
      return false;
    }
  },
  
  activateAccount: async (activation_token) => {
    const { client } = useApiStore.getState();
    try {
      const data = await get()._handleApiCall(() => 
        client.patch('api/v1/auth/activate', { activation_token })
      );
      if (data.user) {
        useUserStore.getState()._updateUserState({ user: data.user });
      }
      return true;
    } catch (error) {
      return false;
    }
  },
  
  requestPasswordReset: async (email) => {
    const { client } = useApiStore.getState();
    try {
      await get()._handleApiCall(() => 
        client.post('api/v1/auth/password/reset', { email })
      );
      return true;
    } catch (error) {
      return false;
    }
  },

  confirmPasswordReset: async (resetData) => {
    const { client } = useApiStore.getState();
    try {
      await get()._handleApiCall(() => 
        client.patch('api/v1/auth/password/reset', resetData)
      );
      return true;
    } catch(error) {
      return false;
    }
  },

  verifyTwoFactor: async (two_factor_code) => {
    const { client } = useApiStore.getState();
    try {
      const data = await get()._handleApiCall(() => 
        client.post('api/v1/auth/verify_2fa', { two_factor_code })
      );
      get()._handleLoginSuccess(data);
      return true;
    } catch (error) {
      return false;
    }
  },

  clearAuthStatus: () => {
    set({ error: null, message: null });
  }
}));
