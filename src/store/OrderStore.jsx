import { create } from 'zustand';
import { useApiStore } from './ApiStore';

/**
 * @typedef {Object} OrderItem
 * @property {number} id
 * @property {string} product_name
 * @property {number} quantity
 * @property {number} price_at_purchase
 * @property {number} subtotal
 */

/**
 * @typedef {Object} Order
 * @property {number} id
 * @property {number} user_id
 * @property {number} total_amount
 * @property {string} status
 * @property {string} payment_status
 * @property {string} created_at
 * @property {string} updated_at
 * @property {OrderItem[]} items
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
 * @typedef {Object} OrderState
 * @property {Order[]} orders - A list of orders.
 * @property {Order|null} selectedOrder - The currently viewed order.
 * @property {PaginationMeta|null} pagination - Pagination metadata for the orders list.
 * @property {boolean} loading - Indicates if an API operation is in progress.
 * @property {string|Object|null} error - Stores API error messages.
 * @property {string|null} message - Stores API success messages.
 */

/**
 * @typedef {Object} OrderActions
 * @property {(page?: number) => Promise<void>} fetchOrders - Fetches a paginated list of all orders (admin).
 * @property {(page?: number) => Promise<void>} fetchMyOrders - Fetches the current user's orders.
 * @property {(orderId: number) => Promise<void>} fetchOrder - Fetches a single order by its ID.
 * @property {() => Promise<Order|undefined>} createOrder - Creates a new order from the cart.
 * @property {(orderId: number, data: Object) => Promise<boolean>} updateOrder - Updates an order's status.
 * @property {(orderId: number) => Promise<boolean>} cancelOrder - Cancels an order.
 * @property {(orderId: number) => Promise<boolean>} deleteOrder - Deletes an order (admin).
 * @property {() => void} clearSelectedOrder - Clears the selected order from the state.
 */

/**
 * @typedef {OrderState & OrderActions} OrderStore
 */

const updateOrderInList = (orders, updatedOrder) => {
  const index = orders.findIndex(o => o.id === updatedOrder.id);
  if (index === -1) return orders;
  const newOrders = [...orders];
  newOrders[index] = updatedOrder;
  return newOrders;
};

/** @type {import('zustand').StoreCreator<OrderStore>} */
export const useOrderStore = create((set, get) => ({
  orders: [],
  selectedOrder: null,
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
      const errorMessages = error.errors || error.message || 'An unknown order error occurred.';
      set({ error: errorMessages });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  _fetchOrderList: async (url, page = 1) => {
    const { client } = useApiStore.getState();
    try {
        const response = await get()._handleApiCall(() => client.get(url, { params: { page } }));
        set({
            orders: response.data.orders,
            pagination: response.data.meta,
        });
    } catch (error) {

    }
  },

  fetchOrders: async (page = 1) => {
    await get()._fetchOrderList('api/v1/orders', page);
  },

  fetchMyOrders: async (page = 1) => {
    await get()._fetchOrderList('api/v1/orders/me', page);
  },

  fetchOrder: async (orderId) => {
    const { client } = useApiStore.getState();
    try {
      const response = await get()._handleApiCall(() => client.get(`api/v1/orders/${orderId}`));
      set({ selectedOrder: response.data.order });
    } catch (error) {
    
    }
  },

  createOrder: async () => {
    const { client } = useApiStore.getState();
    try {
      const response = await get()._handleApiCall(() => client.post('api/v1/orders'));
      set({ selectedOrder: response.data.order });
      return response.data.order;
    } catch (error) {
      return undefined;
    }
  },

  _updateAndSetOrder: (updatedOrder) => {
    set(state => ({
      selectedOrder: state.selectedOrder?.id === updatedOrder.id ? updatedOrder : state.selectedOrder,
      orders: updateOrderInList(state.orders, updatedOrder),
    }));
  },

  updateOrder: async (orderId, data) => {
    const { client } = useApiStore.getState();
    try {
      const response = await get()._handleApiCall(() => client.patch(`api/v1/orders/${orderId}`, data));
      get()._updateAndSetOrder(response.data.order);
      return true;
    } catch (error) {
      return false;
    }
  },

  cancelOrder: async (orderId) => {
    const { client } = useApiStore.getState();
    try {
      const response = await get()._handleApiCall(() => client.post(`api/v1/orders/${orderId}/cancel`));
      get()._updateAndSetOrder(response.data.order);
      return true;
    } catch (error) {
      return false;
    }
  },

  deleteOrder: async (orderId) => {
    const { client } = useApiStore.getState();
    try {
      await get()._handleApiCall(() => client.delete(`api/v1/orders/${orderId}`));
      set(state => ({
        orders: state.orders.filter(o => o.id !== orderId),
      }));
      return true;
    } catch (error) {
      return false;
    }
  },

  clearSelectedOrder: () => {
    set({ selectedOrder: null });
  },
}));
