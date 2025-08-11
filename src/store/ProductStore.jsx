import { create } from 'zustand';
import { useApiStore } from './ApiStore';

/**
 * @typedef {Object} ProductPhoto
 * @property {number} id
 * @property {string} url
 * @property {string} [thumbnail_url]
 */

/**
 * @typedef {Object} ProductLike
 * @property {number} id
 * @property {number} user_id
 */

/**
 * @typedef {Object} ProductComment
 * @property {number} id
 * @property {number} user_id
 * @property {string} content
 * @property {number} [parent_id]
 * @property {ProductComment[]} [replies]
 */

/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {number} [average_rating]
 * @property {number} likes_count
 * @property {number} comments_count
 * @property {ProductPhoto[]} photos
 * @property {ProductLike[]} likes
 * @property {ProductComment[]} comments
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
 * @typedef {Object} ProductState
 * @property {Product[]} products - A list of products for the index view.
 * @property {Product|null} selectedProduct - The currently viewed product.
 * @property {PaginationMeta|null} pagination - Pagination metadata for the products list.
 * @property {boolean} loading - Indicates if an API operation is in progress.
 * @property {string|Object|null} error - Stores API error messages.
 * @property {string|null} message - Stores API success messages.
 */

/**
 * @typedef {Object} ProductActions
 * @property {(page?: number, otherParams?: Object) => Promise<void>} fetchProducts - Fetches a paginated list of products.
 * @property {(productId: number) => Promise<void>} fetchProduct - Fetches a single product by its ID.
 * @property {(formData: FormData) => Promise<Product|undefined>} createProduct - Creates a new product.
 * @property {(productId: number, formData: FormData) => Promise<void>} updateProduct - Updates an existing product.
 * @property {(productId: number) => Promise<void>} deleteProduct - Deletes a product.
 * @property {(productId: number) => Promise<void>} likeProduct - Likes/unlikes a product.
 * @property {(productId: number, rating: number) => Promise<void>} rateProduct - Rates a product.
 * @property {(productId: number, content: string, parentId?: number) => Promise<void>} commentOnProduct - Adds a comment to a product.
 * @property {() => void} clearSelectedProduct - Clears the selected product from the state.
 */

/**
 * @typedef {ProductState & ProductActions} ProductStore
 */

/**
 * Updates a product within a list of products.
 * @param {Product[]} products - The array of products.
 * @param {Product} updatedProduct - The product with updated data.
 * @returns {Product[]} A new array with the updated product.
 */
const updateProductInList = (products, updatedProduct) => {
  const index = products.findIndex(p => p.id === updatedProduct.id);
  if (index === -1) return products;
  const newProducts = [...products];
  newProducts[index] = updatedProduct;
  return newProducts;
};

/** @type {import('zustand').StoreCreator<ProductStore>} */
export const useProductStore = create((set, get) => ({
  products: [],
  selectedProduct: null,
  pagination: null,
  loading: false,
  error: null,
  message: null,

  _handleApiResponse: async (apiPromise) => {
    set({ loading: true, error: null, message: null });
    try {
      const response = await apiPromise;
      const jsonResponse = await response.json();

      if (!response.ok) {
        throw new Error(jsonResponse.message || 'An API error occurred');
      }

      return jsonResponse;
    } catch (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  fetchProducts: async (page = 1, otherParams = {}) => {
    const { fetchApi } = useApiStore.getState();
    const queryParams = new URLSearchParams({ page, ...otherParams }).toString();
    const endpoint = `productsIndex?${queryParams}`;

    try {
      const json = await get()._handleApiResponse(fetchApi(endpoint, { method: 'GET' }));
      set({
        products: json.products,
        pagination: json.meta,
        loading: false
      });
    } catch (error) {

    }
  },

  fetchProduct: async (productId) => {
    const { fetchApi } = useApiStore.getState();
    try {
      const json = await get()._handleApiResponse(fetchApi('productsShow', { method: 'GET' }, { id: productId }));
      set({ selectedProduct: json, loading: false });
    } catch (error) {

    }
  },

  createProduct: async (formData) => {
    const { fetchApi } = useApiStore.getState();
    try {
      const json = await get()._handleApiResponse(fetchApi('productsCreate', { method: 'POST', body: formData }));
      set({ message: json.message, loading: false });
      return json.product;
    } catch (error) {

    }
  },

  updateProduct: async (productId, formData) => {
    const { fetchApi } = useApiStore.getState();
    try {
      const json = await get()._handleApiResponse(fetchApi('productsUpdate', { method: 'PATCH', body: formData }, { id: productId }));
      const updatedProduct = json.product;
      set(state => ({
        selectedProduct: state.selectedProduct?.id === updatedProduct.id ? updatedProduct : state.selectedProduct,
        products: updateProductInList(state.products, updatedProduct),
        message: json.message,
        loading: false
      }));
    } catch (error) {

    }
  },

  deleteProduct: async (productId) => {
    const { fetchApi } = useApiStore.getState();
    try {
      const json = await get()._handleApiResponse(fetchApi('productsDestroy', { method: 'DELETE' }, { id: productId }));
      set(state => ({
        products: state.products.filter(p => p.id !== productId),
        message: json.message,
        loading: false
      }));
    } catch (error) {

    }
  },

  likeProduct: async (productId) => {
    const { fetchApi } = useApiStore.getState();
    try {
      const json = await get()._handleApiResponse(fetchApi('productsLike', { method: 'POST' }, { id: productId }));
      const updatedProduct = json.product;
      set(state => ({
        selectedProduct: state.selectedProduct?.id === updatedProduct.id ? updatedProduct : state.selectedProduct,
        products: updateProductInList(state.products, updatedProduct),
        message: json.message,
        loading: false
      }));
    } catch (error) {

    }
  },

  rateProduct: async (productId, rating) => {
    const { fetchApi } = useApiStore.getState();
    try {
      const json = await get()._handleApiResponse(fetchApi('productsRate', { method: 'POST', body: JSON.stringify({ rating }) }, { id: productId }));
      const updatedProduct = json.product;
      set(state => ({
        selectedProduct: state.selectedProduct?.id === updatedProduct.id ? updatedProduct : state.selectedProduct,
        products: updateProductInList(state.products, updatedProduct),
        message: json.message,
        loading: false
      }));
    } catch (error) {
    }
  },

  commentOnProduct: async (productId, content, parentId) => {
    const { fetchApi } = useApiStore.getState();
    const body = { content, parent_id: parentId };
    try {
      const json = await get()._handleApiResponse(fetchApi('productsComment', { method: 'POST', body: JSON.stringify(body) }, { id: productId }));
      const updatedProduct = json.product;
      set(state => ({
        selectedProduct: state.selectedProduct?.id === updatedProduct.id ? updatedProduct : state.selectedProduct,
        products: updateProductInList(state.products, updatedProduct),
        message: json.message,
        loading: false
      }));
    } catch (error) {
    }
  },

  clearSelectedProduct: () => {
    set({ selectedProduct: null });
  },
}));