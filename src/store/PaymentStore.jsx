import { create } from 'zustand';
import { useApiStore } from './ApiStore';
import { useOrderStore } from './OrderStore';

/**
 * @typedef {Object} PaymentOrderInfo
 * @property {number} id
 * @property {number} total_amount
 * @property {string} status
 */

/**
 * @typedef {Object} Payment
 * @property {number} id
 * @property {number} order_id
 * @property {number} amount
 * @property {string} currency
 * @property {string} status
 * @property {string} payment_method
 * @property {string} created_at
 * @property {string} updated_at
 * @property {PaymentOrderInfo} [order]
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
 * @typedef {Object} PaymentState
 * @property {Payment[]} payments - A list of payments.
 * @property {Payment|null} selectedPayment - The currently viewed payment.
 * @property {PaginationMeta|null} pagination - Pagination metadata for the payments list.
 * @property {boolean} loading - Indicates if an API operation is in progress.
 * @property {string|Object|null} error - Stores API error messages.
 * @property {string|null} message - Stores API success messages.
 */

/**
 * @typedef {Object} PaymentActions
 * @property {(page?: number) => Promise<void>} fetchPayments - Fetches a paginated list of all payments.
 * @property {(paymentId: number) => Promise<void>} fetchPayment - Fetches a single payment by its ID.
 * @property {(orderId: number, method: string) => Promise<Payment|undefined>} createPayment - Creates a new payment for an order.
 * @property {(paymentId: number) => Promise<void>} retryPayment - Retries a failed payment.
 * @property {() => void} clearSelectedPayment - Clears the selected payment from the state.
 */

/**
 * @typedef {PaymentState & PaymentActions} PaymentStore
 */

/**
 * Updates a payment within a list of payments.
 * @param {Payment[]} payments - The array of payments.
 * @param {Payment} updatedPayment - The payment with updated data.
 * @returns {Payment[]} A new array with the updated payment.
 */
const updatePaymentInList = (payments, updatedPayment) => {
  const index = payments.findIndex(p => p.id === updatedPayment.id);
  if (index === -1) return payments;
  const newPayments = [...payments];
  newPayments[index] = updatedPayment;
  return newPayments;
};

/** @type {import('zustand').StoreCreator<PaymentStore>} */
export const usePaymentStore = create((set, get) => ({
  payments: [],
  selectedPayment: null,
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

  fetchPayments: async (page = 1) => {
    const { fetchApi } = useApiStore.getState();
    const queryParams = new URLSearchParams({ page: String(page) }).toString();
    const endpoint = `paymentsIndex?${queryParams}`;
    try {
      const json = await get()._handleApiResponse(fetchApi(endpoint, { method: 'GET' }));
      set({
        payments: json.payments,
        pagination: json.meta,
        loading: false,
      });
    } catch (error) {

    }
  },

  fetchPayment: async (paymentId) => {
    const { fetchApi } = useApiStore.getState();
    try {
      const json = await get()._handleApiResponse(fetchApi('paymentsShow', { method: 'GET' }, { id: paymentId }));
      set({ selectedPayment: json.payment, loading: false });
    } catch (error) {

    }
  },

  createPayment: async (orderId, method) => {
    const { fetchApi } = useApiStore.getState();
    const body = { order_id: orderId, payment_method: method };
    try {
      const json = await get()._handleApiResponse(fetchApi('paymentsCreate', { method: 'POST', body: JSON.stringify(body) }));
      set({
        selectedPayment: json.payment,
        message: json.message,
        loading: false
      });

      if (json.payment?.order_id) {
        useOrderStore.getState().fetchOrder(json.payment.order_id);
      }
      return json.payment;
    } catch (error) {

    }
  },

  retryPayment: async (paymentId) => {
    const { fetchApi } = useApiStore.getState();
    try {
      const json = await get()._handleApiResponse(fetchApi('paymentsRetry', { method: 'POST' }, { id: paymentId }));
      const updatedPayment = json.payment;
      set(state => ({
        selectedPayment: state.selectedPayment?.id === updatedPayment.id ? updatedPayment : state.selectedPayment,
        payments: updatePaymentInList(state.payments, updatedPayment),
        message: json.message,
        loading: false,
      }));
      
      if (updatedPayment.order_id) {
          useOrderStore.getState().fetchOrder(updatedPayment.order_id);
      }
    } catch (error) {
      
    }
  },

  clearSelectedPayment: () => {
    set({ selectedPayment: null });
  },
}));