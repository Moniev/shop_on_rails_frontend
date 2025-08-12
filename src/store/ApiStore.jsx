import { create } from 'zustand';
import apiClient from '../hooks/Axios';

/**
 * @typedef {Object} ApiConfig
 * @property {string} baseUrl
 * @property {string|null} token 
 * @property {Object} headers
 * @property {boolean} debugMode 
 * @property {import('axios').AxiosInstance} client
 */

/**
 * @typedef {Object} ApiState
 * @property {ApiConfig} config
 * @property {(url: string) => void} setBaseUrl
 * @property {(token: string|null) => void} setToken
 * @property {(headers: Object) => void} updateHeaders
 * @property {(debug: boolean) => void} setDebugMode
 * @property {() => void} resetConfig
 * @property {(key: string, params?: Object) => string} getEndpoint - Supports dynamic params.
 * @property {(key: string, options?: Object, params?: Object) => Promise<Response>} fetchApi - Supports dynamic params.
 */

export const useApiStore = create((set) => ({
  config: {
    token: null,
    debugMode: false,
  },

  client: apiClient,

  setToken: (token) =>
    set((state) => ({
      config: { ...state.config, token },
    })),

  setDebugMode: (debugMode) =>
    set((state) => ({
      config: { ...state.config, debugMode },
    })),

  resetConfig: () =>
    set({
      config: { token: null, debugMode: false },
    }),
}));
