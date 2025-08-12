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
 * @property {(productId: number, quantity: number) => Promise<boolean>} addItem - Adds a product to the cart.
 * @property {(itemId: number, quantity: number) => Promise<boolean>} updateItem - Updates the quantity of an item in the cart.
 * @property {(itemId: number) => Promise<boolean>} removeItem - Removes an item from the cart.
 * @property {() => Promise<boolean>} clearCart - Clears the entire cart.
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

  _updateCartState: (response) => {
    const cartData = response.data;
    const summaryData = response.cart_summary;

    set({
      message: response.message || null,
      ...(cartData && {
        items: cartData.items || [],
        total_amount: cartData.total_amount || 0,
        items_count: cartData.items_count || 0,
      }),
      ...(summaryData && {
        total_amount: summaryData.total_amount || 0,
        items_count: summaryData.items_count || 0,
      }),
    });
  },

  _handleApiCall: async (apiCall) => {
    set({ loading: true, error: null, message: null });
    try {
      const response = await apiCall();
      get()._updateCartState(response);
      return response;
    } catch (error) {
      const errorMessages = error.errors || error.message || 'An unknown cart error occurred.';
      set({ error: errorMessages });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  fetchCart: async () => {
    const { client } = useApiStore.getState();
    try {
      await get()._handleApiCall(() => client.get('/cart/show'));
    } catch (error) {
    }
  },

  addItem: async (productId, quantity) => {
    const { client } = useApiStore.getState();
    try {
      await get()._handleApiCall(() => 
        client.post('/cart/add', { product_id: productId, quantity: quantity })
      );
      return true;
    } catch (error) {
      return false;
    }
  },

  updateItem: async (itemId, quantity) => {
    const { client } = useApiStore.getState();
    try {
        await get()._handleApiCall(() => 
            client.patch('/cart/update', { item_id: itemId, quantity: quantity })
        );
        return true;
    } catch (error) {
        return false;
    }
  },

  removeItem: async (itemId) => {
    const { client } = useApiStore.getState();
    try {
      await get()._handleApiCall(() => 
        client.delete('/cart/revoke', { data: { item_id: itemId } })
      );
      return true;
    } catch (error) {
      return false;
    }
  },

  clearCart: async () => {
    const { client } = useApiStore.getState();
    try {
      await get()._handleApiCall(() => client.delete('/cart/clear'));
      return true;
    } catch (error) {
      return false;
    }
  },
}));
