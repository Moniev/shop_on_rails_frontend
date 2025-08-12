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
 * @property {(productId: number, formData: FormData) => Promise<boolean>} updateProduct - Updates an existing product.
 * @property {(productId: number) => Promise<boolean>} deleteProduct - Deletes a product.
 * @property {(productId: number) => Promise<boolean>} likeProduct - Likes/unlikes a product.
 * @property {(productId: number, rating: number) => Promise<boolean>} rateProduct - Rates a product.
 * @property {(productId: number, content: string, parentId?: number) => Promise<boolean>} commentOnProduct - Adds a comment to a product.
 * @property {() => void} clearSelectedProduct - Clears the selected product from the state.
 */

/**
 * @typedef {ProductState & ProductActions} ProductStore
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

  _handleApiCall: async (apiCall) => {
    set({ loading: true, error: null, message: null });
    try {
      const response = await apiCall();
      if (response.message) {
        set({ message: response.message });
      }
      return response;
    } catch (error) {
      const errorMessages = error.errors || error.message || 'An unknown product error occurred.';
      set({ error: errorMessages });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  
  _updateProductState: (updatedProduct) => {
    set(state => ({
        selectedProduct: state.selectedProduct?.id === updatedProduct.id ? updatedProduct : state.selectedProduct,
        products: updateProductInList(state.products, updatedProduct),
      }));
  },

  fetchProducts: async (page = 1, otherParams = {}) => {
    const { client } = useApiStore.getState();
    try {
      const response = await get()._handleApiCall(() => client.get('api/v1/products', { params: { page, ...otherParams } }));
      set({
        products: response.data.products,
        pagination: response.data.meta,
      });
    } catch (error) {
      
    }
  },

  fetchProduct: async (productId) => {
    const { client } = useApiStore.getState();
    try {
      const response = await get()._handleApiCall(() => client.get(`api/v1/products/${productId}`));
      set({ selectedProduct: response.data.product });
    } catch (error) {
     
    }
  },

  createProduct: async (formData) => {
    const { client } = useApiStore.getState();
    try {
      const response = await get()._handleApiCall(() => client.post('api/v1/products', formData));
      return response.data.product;
    } catch (error) {
      return undefined;
    }
  },

  updateProduct: async (productId, formData) => {
    const { client } = useApiStore.getState();
    try {
      const response = await get()._handleApiCall(() => client.patch(`api/v1/products/${productId}`, formData));
      get()._updateProductState(response.data.product);
      return true;
    } catch (error) {
      return false;
    }
  },

  deleteProduct: async (productId) => {
    const { client } = useApiStore.getState();
    try {
      await get()._handleApiCall(() => client.delete(`api/v1/products/${productId}`));
      set(state => ({
        products: state.products.filter(p => p.id !== productId),
      }));
      return true;
    } catch (error) {
      return false;
    }
  },

  likeProduct: async (productId) => {
    const { client } = useApiStore.getState();
    try {
      const response = await get()._handleApiCall(() => client.post(`api/v1/products/${productId}/like`));
      get()._updateProductState(response.data.product);
      return true;
    } catch (error) {
      return false;
    }
  },

  rateProduct: async (productId, rating) => {
    const { client } = useApiStore.getState();
    try {
      const response = await get()._handleApiCall(() => client.post(`api/v1/products/${productId}/rate`, { rating }));
      get()._updateProductState(response.data.product);
      return true;
    } catch (error) {
      return false;
    }
  },

  commentOnProduct: async (productId, content, parentId) => {
    const { client } = useApiStore.getState();
    const body = { content, parent_id: parentId };
    try {
      const response = await get()._handleApiCall(() => client.post(`api/v1/products/${productId}/comment`, body));
      get()._updateProductState(response.data.product);
      return true;
    } catch (error) {
      return false;
    }
  },

  clearSelectedProduct: () => {
    set({ selectedProduct: null });
  },
}));
