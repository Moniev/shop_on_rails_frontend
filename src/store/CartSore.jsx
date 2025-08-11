import { create } from 'zustand';
import { useApiStore } from './ApiStore';

/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 */

/**
 * @typedef {Object} CartItem
 * @property {number} item_id - The ID of the cart item record.
 * @property {number} quantity
 * @property {number} price_at_purchase
 * @property {number} subtotal
 * @property {Product} product
 */

/**
 * @typedef {Object} CartState
 * @property {CartItem[]} items - The items in the shopping cart.
 * @property {number} total_amount - The total value of the cart.
 * @property {number} items_count - The total number of items in the cart.
 * @property {boolean} loading - Whether a cart operation is in progress.
 * @property {string|Object|null} error - An error message from the API.
 * @property {string|null} message - A success or info message from the API.
 */

/**
 * @typedef {Object} CartActions
 * @property {() => Promise<void>} fetchCart - Fetches the current state of the cart from the server.
 * @property {(productId: number, quantity: number) => Promise<void>} addItem - Adds a product to the cart.
 * @property {(itemId: number, quantity: number) => Promise<void>} updateItem - Updates the quantity of an item in the cart.
 * @property {(itemId: number) => Promise<void>} removeItem - Removes an item from the cart.
 * @property {() => Promise<void>} clearCart - Clears the entire cart.
 */

/**
 * @typedef {CartState & CartActions} CartStore
 */

/** @type {import('zustand').StoreCreator<CartStore>} */
export const useCartStore = create((set, get) => ({
  items: [],
  total_amount: 0,
  items_count: 0,
  loading: false,
  error: null,
  message: null,

  /**
   * Generic handler for API responses to update the state.
   * @param {Promise<Response>} apiPromise 
   */
  _handleApiResponse: async (apiPromise) => {
    set({ loading: true, error: null, message: null });
    try {
      const response = await apiPromise;
      const jsonResponse = await response.json();

      if (!response.ok || jsonResponse.errors) {
        throw new Error(jsonResponse.errors || 'An API error occurred');
      }
      
      const cartData = jsonResponse.data;
      const summaryData = jsonResponse.cart_summary;

      set({
        loading: false,
        message: jsonResponse.message || null,
        ...(cartData && {
          items: cartData.items || [],
          total_amount: cartData.total_amount || 0,
          items_count: cartData.items_count || 0,
        }),
        ...(summaryData && {
            total_amount: summaryData.total_amount || 0,
            items_count: summaryData.items_count || 0,
        })
      });

    } catch (error) {
      set({ loading: false, error: error.message });
    }
  },

  fetchCart: async () => {
    const { fetchApi } = useApiStore.getState();
    await get()._handleApiResponse(fetchApi('cartShow', { method: 'GET' }));
  },

  addItem: async (productId, quantity) => {
    const { fetchApi } = useApiStore.getState();
    await get()._handleApiResponse(
      fetchApi('cartAdd', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId, quantity: quantity }),
      })
    );
    if (!get().error) {
      await get().fetchCart();
    }
  },

  removeItem: async (itemId) => {
    const { fetchApi } = useApiStore.getState();
    await get()._handleApiResponse(
      fetchApi('cartRevoke', {
        method: 'DELETE',
        body: JSON.stringify({ item_id: itemId }),
      })
    );
    if (!get().error) {
      await get().fetchCart();
    }
  },

  clearCart: async () => {
    const { fetchApi } = useApiStore.getState();
    await get()._handleApiResponse(fetchApi('cartClear', { method: 'DELETE' }));
    if (!get().error) {
        set({ items: [], items_count: 0, total_amount: 0 });
    }
  },
}));