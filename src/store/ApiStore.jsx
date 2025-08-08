/**
 * @typedef {Object} ApiConfig
 * @property {string} baseUrl
 * @property {string|null} token 
 * @property {Object} headers
 * @property {boolean} debugMode 
 */

/**
 * @typedef {Object} ApiState
 * @property {ApiConfig} config
 * @property {(url: string) => void} setBaseUrl
 * @property {(token: string|null) => void} setToken
 * @property {(headers: Object) => void} updateHeaders
 * @property {(debug: boolean) => void} setDebugMode
 * @property {() => void} resetConfig
 * @property {(key: string) => string} getEndpoint
 * @property {(key: string, options: Object) => Promise<Response>} fetchApi
 */

import { create } from 'zustand';

const endpoints = {
    baseUrl: import.meta.env.VITE_API_ADDRESS,
    sign: import.meta.env.VITE_API_ENDPOINT_SIGN,
    signout: import.meta.env.VITE_API_ENDPOINT_LOGOUT,
    user: import.meta.env.VITE_API_ENDPOINT_USER,
    resetPassword: import.meta.env.VITE_API_ENDPOINT_RESET_PASSWORD,
};

/** @type {import('zustand').StoreCreator<ApiState>} */
export const useApiStore = create((set, get) => ({
  config: {
    baseUrl: endpoints.baseUrl, 
    token: null,
    headers: {
      'Content-Type': 'application/json',
    },
    debugMode: false,
  },
  setBaseUrl: (baseUrl) =>
    set((state) => ({
      config: { ...state.config, baseUrl },
    })),
  setToken: (token) =>
    set((state) => ({
      config: {
        ...state.config,
        token,
        headers: {
          ...state.config.headers,
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      },
    })),
  updateHeaders: (headers) =>
    set((state) => ({
      config: { ...state.config, headers: { ...state.config.headers, ...headers } },
    })),
  setDebugMode: (debugMode) =>
    set((state) => ({
      config: { ...state.config, debugMode },
    })),
  resetConfig: () =>
    set({
      config: {
        baseUrl: endpoints.baseUrl,
        token: null,
        headers: {
          'Content-Type': 'application/json',
        },
        debugMode: false,
      },
    }),
  getEndpoint: (key) => {
    const endpoint = endpoints[key];
    if (!endpoint) {
      throw new Error(`Endpoint ${key} not found`);
    }
    return `${get().config.baseUrl}${endpoint}`;
  },

  fetchApi: async (key, options = {}) => {
    const { config } = get();
    const endpoint = endpoints[key];
    if (!endpoint) {
      throw new Error(`Endpoint ${key} not found`);
    }
    const url = `${config.baseUrl}${endpoint}`;
    if (config.debugMode) {
      console.log(`Fetching ${url} with options:`, options);
    }
    const response = await fetch(url, {
      ...options,
      headers: {
        ...config.headers,
        ...options.headers,
      },
    });
    if (config.debugMode) {
      console.log(`Response from ${url}:`, response);
    }
    return response;
  },
}));