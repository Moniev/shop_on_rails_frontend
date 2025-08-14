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
 * @property {(credentials: Object) => Promise<Object|boolean>} login - Logs the user in.
 * @property {(userData: Object) => Promise<boolean>} register - Registers a new user.
 * @property {() => Promise<void>} logout - Logs the user out.
 * @property {(email: string, activationCode: string) => Promise<boolean>} activateAccount - Activates an account using a code.
 * @property {(email: string) => Promise<boolean>} requestPasswordReset - Sends a password reset email.
 * @property {(data: Object) => Promise<boolean>} confirmPasswordReset - Confirms password reset with a token.
 * @property {(code: string) => Promise<Object|boolean>} verifyTwoFactor - Verifies a 2FA code.
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
      if (response.data.message) {
        set({ message: response.data.message });
      }
      return response
    } catch (error) {
      const errorMessages = error.response?.data?.errors || error.message || 'An unknown authentication error occurred.';
      set({ error: errorMessages });
      throw new Error(Array.isArray(errorMessages) ? errorMessages.join(', ') : errorMessages);
    } finally {
      set({ loading: false });
    }
  },
  
  _handleLoginSuccess: async (response) => {
    const token = response?.data?.data?.token;
    if (token == null) {
      throw new Error('API response is missing token.');
    }
    const { setToken } = useApiStore.getState();
    const { fetchCurrentUser } = useUserStore.getState();
    setToken(token);
    await fetchCurrentUser();
  },

  login: async (credentials) => {
    const { client } = useApiStore.getState();
    try {
      const response = await get()._handleApiCall(() => 
        client.post('/auth/login', credentials)
      );
      await get()._handleLoginSuccess(response);
      return response;
    } catch (error) {
      return false;
    }
  },

   logout: async () => {
    const { client, setToken } = useApiStore.getState();
    const { clearCurrentUser } = useUserStore.getState();
    
    try {
      await client.post('/users/logout');
    } catch (error) {
    } finally {
      setToken(null);
      clearCurrentUser();
      set({ message: 'Successfully logged out.' });
    }
  },

  register: async (userData) => {
    const { client } = useApiStore.getState();
    try {
      const response = await get()._handleApiCall(() => 
        client.post('/users', { user: userData })
      );
      return response;
    } catch (error) {
      return false;
    }
  },
  
  activateAccount: async (email, activationCode) => {
    const { client } = useApiStore.getState();
    try {
      const payload = { 
        mail: email, 
        activation_code: activationCode 
      };
      
      const response = await get()._handleApiCall(() => 
        client.patch('/auth/activate', payload)
      );
      return response;
    } catch (error) {
      return false;
    }
  },
  
  requestPasswordReset: async (email) => {
    const { client } = useApiStore.getState();
    try {
      const response = await get()._handleApiCall(() => 
        client.post('/auth/password/reset', { mail: email })
      );
      console.log(response)
      return response;
    } catch (error) {
      return false;
    }
  },

  confirmPasswordReset: async (resetData) => {
    const { client } = useApiStore.getState();
    try {
      const response = await get()._handleApiCall(() => 
        client.patch('/auth/password/reset', resetData)
      );
      return response;
      
    } catch(error) {
      return false;
    }
  },

  verifyTwoFactor: async (email, code) => {
    const { client } = useApiStore.getState();
    try {
      const response = await get()._handleApiCall(() => 
        client.post('/auth/verify_2fa', { mail: email, second_factor_code: code })
      );

      await get()._handleLoginSuccess(response);
      
      return response;
    } catch (error) {
      return false;
    }
  },

  clearAuthStatus: () => {
    set({ error: null, message: null });
  }
}));
