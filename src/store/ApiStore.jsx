import { create } from 'zustand';

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
 * @property {(key: string, params?: Object) => string} getEndpoint - Supports dynamic params.
 * @property {(key: string, options?: Object, params?: Object) => Promise<Response>} fetchApi - Supports dynamic params.
 */

const endpoints = {
  baseUrl: import.meta.env.VITE_API_ADDRESS || 'http://localhost:3000/api/v1',

  cartShow: '/cart/show',
  cartAdd: '/cart/add',
  cartRevoke: '/cart/revoke',
  cartClear: '/cart/clear',
  cartUpdate: '/cart/update',

  ordersIndex: '/orders',                 
  ordersMe: '/orders/me',                 
  ordersShow: '/orders/:id',              
  ordersCreate: '/orders',                
  ordersUpdate: '/orders/:id',            
  ordersCancel: '/orders/:id/cancel',     
  ordersDestroy: '/orders/:id',

  productsIndex: '/products',                 
  productsShow: '/products/:id',              
  productsCreate: '/products',                
  productsUpdate: '/products/:id',            
  productsDestroy: '/products/:id',           
  productsLike: '/products/:id/like',         
  productsRate: '/products/:id/rate',         
  productsComment: '/products/:id/comment', 

  paymentsIndex: '/payments',             
  paymentsShow: '/payments/:id',          
  paymentsCreate: '/payments',            
  paymentsRetry: '/payments/:id/retry',

  usersIndex: '/users',
  usersShow: '/users/:id',
  usersCreate: '/users',
  usersUpdate: '/users/:id',
  usersDestroy: '/users/:id',
  usersMe: '/users/me',
  usersLogout: '/users/logout',
  usersUpdateDetails: '/users/:id/update_details',
  usersUpdateLocation: '/users/:id/update_location',
  usersUpdateEntrepreneur: '/users/:id/update_entrepreneur_details',
  usersUpdateRole: '/users/:id/role',
  usersFetchActions: '/users/:id/actions',
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

  getEndpoint: (key, params = {}) => {
    let endpoint = endpoints[key];
    if (!endpoint) {
      throw new Error(`Endpoint ${key} not found`);
    }
    for (const paramKey in params) {
      endpoint = endpoint.replace(`:${paramKey}`, params[paramKey]);
    }
    return `${get().config.baseUrl}${endpoint}`;
  },

  fetchApi: async (key, options = {}, params = {}) => {
    const { config, getEndpoint } = get();
    const url = getEndpoint(key, params);

    if (config.debugMode) {
      console.log(`Fetching ${url} with options:`, options);
    }

    const finalOptions = { ...options };
    if (finalOptions.body instanceof FormData) {
      delete finalOptions.headers['Content-Type'];
    }

    const response = await fetch(url, {
      ...finalOptions,
      headers: {
        ...config.headers,
        ...finalOptions.headers,
      },
    });

    if (config.debugMode) {
      console.log(`Response from ${url}:`, response);
    }
    return response;
  },
}));
