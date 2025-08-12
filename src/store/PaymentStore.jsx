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
 * @property {(paymentId: number) => Promise<boolean>} retryPayment - Retries a failed payment.
 * @property {() => void} clearSelectedPayment - Clears the selected payment from the state.
 */

/**
 * @typedef {PaymentState & PaymentActions} PaymentStore
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

  _handleApiCall: async (apiCall) => {
    set({ loading: true, error: null, message: null });
    try {
      const response = await apiCall();
      if (response.message) {
        set({ message: response.message });
      }
      return response;
    } catch (error) {
      const errorMessages = error.errors || error.message || 'An unknown payment error occurred.';
      set({ error: errorMessages });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  fetchPayments: async (page = 1) => {
    const { client } = useApiStore.getState();
    try {
      const response = await get()._handleApiCall(() => client.get('api/v1/payments', { params: { page } }));
      set({
        payments: response.data.payments,
        pagination: response.data.meta,
      });
    } catch (error) {

    }
  },

  fetchPayment: async (paymentId) => {
    const { client } = useApiStore.getState();
    try {
      const response = await get()._handleApiCall(() => client.get(`api/v1/payments/${paymentId}`));
      set({ selectedPayment: response.data.payment });
    } catch (error) {

    }
  },

  createPayment: async (orderId, method) => {
    const { client } = useApiStore.getState();
    const body = { order_id: orderId, payment_method: method };
    try {
      const response = await get()._handleApiCall(() => client.post('api/v1/payments', body));
      const newPayment = response.data.payment;
      set({ selectedPayment: newPayment });
      
      if (newPayment?.order_id) {
        useOrderStore.getState().fetchOrder(newPayment.order_id);
      }
      return newPayment;
    } catch (error) {
      return undefined;
    }
  },

  retryPayment: async (paymentId) => {
    const { client } = useApiStore.getState();
    try {
      const response = await get()._handleApiCall(() => client.post(`api/v1/payments/${paymentId}/retry`));
      const updatedPayment = response.data.payment;

      set(state => ({
        selectedPayment: state.selectedPayment?.id === updatedPayment.id ? updatedPayment : state.selectedPayment,
        payments: updatePaymentInList(state.payments, updatedPayment),
      }));
      
      if (updatedPayment.order_id) {
          useOrderStore.getState().fetchOrder(updatedPayment.order_id);
      }
      return true;
    } catch (error) {
      return false;
    }
  },

  clearSelectedPayment: () => {
    set({ selectedPayment: null });
  },
}));
