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
 * @property {(orderId: number, data: Object) => Promise<void>} updateOrder - Updates an order's status.
 * @property {(orderId: number) => Promise<void>} cancelOrder - Cancels an order.
 * @property {(orderId: number) => Promise<void>} deleteOrder - Deletes an order (admin).
 * @property {() => void} clearSelectedOrder - Clears the selected order from the state.
 */

/**
 * @typedef {OrderState & OrderActions} OrderStore
 */

/**
 * Updates an order within a list of orders.
 * @param {Order[]} orders - The array of orders.
 * @param {Order} updatedOrder - The order with updated data.
 * @returns {Order[]} A new array with the updated order.
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

  _fetchOrderList: async (endpointKey, page = 1) => {
    const { fetchApi } = useApiStore.getState();
    const queryParams = new URLSearchParams({ page: String(page) }).toString();
    const endpoint = `${endpointKey}?${queryParams}`;
    try {
      const json = await get()._handleApiResponse(fetchApi(endpoint, { method: 'GET' }));
      set({
        orders: json.orders,
        pagination: json.meta,
        loading: false,
      });
    } catch (error) {

    }
  },

  fetchOrders: async (page = 1) => {
    await get()._fetchOrderList('ordersIndex', page);
  },

  fetchMyOrders: async (page = 1) => {
    await get()._fetchOrderList('ordersMe', page);
  },

  fetchOrder: async (orderId) => {
    const { fetchApi } = useApiStore.getState();
    try {
      const json = await get()._handleApiResponse(fetchApi('ordersShow', { method: 'GET' }, { id: orderId }));
      set({ selectedOrder: json.order, loading: false });
    } catch (error) {

    }
  },

  createOrder: async () => {
    const { fetchApi } = useApiStore.getState();
    try {
      const json = await get()._handleApiResponse(fetchApi('ordersCreate', { method: 'POST' }));
      set({
        selectedOrder: json.order,
        message: json.message,
        loading: false
      });
      return json.order;
    } catch (error) {

    }
  },

  _updateAndSetOrder: (json) => {
    const updatedOrder = json.order;
    set(state => ({
      selectedOrder: state.selectedOrder?.id === updatedOrder.id ? updatedOrder : state.selectedOrder,
      orders: updateOrderInList(state.orders, updatedOrder),
      message: json.message,
      loading: false
    }));
  },

  updateOrder: async (orderId, data) => {
    const { fetchApi } = useApiStore.getState();
    try {
      const json = await get()._handleApiResponse(fetchApi('ordersUpdate', { method: 'PATCH', body: JSON.stringify(data) }, { id: orderId }));
      get()._updateAndSetOrder(json);
    } catch (error) {

    }
  },

  cancelOrder: async (orderId) => {
    const { fetchApi } = useApiStore.getState();
    try {
      const json = await get()._handleApiResponse(fetchApi('ordersCancel', { method: 'POST' }, { id: orderId }));
      get()._updateAndSetOrder(json);
    } catch (error) {

    }
  },

  deleteOrder: async (orderId) => {
    const { fetchApi } = useApiStore.getState();
    try {
      const json = await get()._handleApiResponse(fetchApi('ordersDestroy', { method: 'DELETE' }, { id: orderId }));
      set(state => ({
        orders: state.orders.filter(o => o.id !== orderId),
        message: json.message,
        loading: false
      }));
    } catch (error) {

    }
  },

  clearSelectedOrder: () => {
    set({ selectedOrder: null });
  },
}));