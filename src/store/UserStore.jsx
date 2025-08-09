/**
 * @typedef {Object} UserDetails
 * @property {number} [id]
 * 
 */

/**
 * @typedef {Object} EntrepreneurDetails
 * @property {number} [id]
 * 
 */

/**
 * @typedef {Object} Location
 * @property {number} [id]
 * 
 */

/**
 * @typedef {Object} UserSettings
 * @property {number} [id]
 * 
 */

/**
 * @typedef {Object} UserDevice
 * @property {number} [id]
 * @property {string} [deviceName]
 */

/**
 * @typedef {Object} UserAction
 * @property {number} [id]
 * @property {string} [actionType]
 */

/**
 * @typedef {Object} UserRole
 * @property {number} [id]
 * @property {string} [roleName]
 */

/**
 * @typedef {Object} BlacklistedToken
 * @property {string} [token]
 */

/**
 * @typedef {Object} UserEdges
 * @property {UserDetails} [userDetails]
 * @property {EntrepreneurDetails} [entrepreneurDetails]
 * @property {Location} [location]
 * @property {UserSettings} [userSettings]
 * @property {UserDevice[]} [userDevices]
 * @property {UserAction[]} [userActions]
 * @property {UserRole[]} [userRoles]
 * @property {BlacklistedToken[]} [blacklistedTokens]
 * @property {boolean[]} [loadedTypes]
 */

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} mail
 * @property {string} phone
 * @property {boolean} active
 * @property {boolean} verified
 * @property {boolean} blacklisted
 * @property {boolean} removed
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {UserEdges} edges
 */

/**
 * @typedef {Object} UserState
 * @property {User|null} user
 * @property {string|null} token
 * @property {(user: User, token?: string) => void} setUser
 * @property {(updates: Partial<User>) => void} updateUser
 * @property {(token: string) => void} setToken
 * @property {() => void} clearUser
 */

import { create } from 'zustand';
import { useApiStore } from './ApiStore';

/** @type {import('zustand').StoreCreator<UserState>} */
export const useUserStore = create((set) => ({
  user: null,
  token: localStorage.getItem("authToken") || null,
  setUser: (user, token) => {
    set({ user, token: token || null });
    if (token) {
      useApiStore.getState().setToken(token);
    }
  },
  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
  setToken: (token) => {
    set({ token });
  },
  clearUser: () => {
    localStorage.removeItem("authToken");
    useApiStore.getState().setToken(null);
    set({ user: null, token: null });
  },
}));