import axios from 'axios';
import { useApiStore } from '../store/ApiStore';
import { toast } from 'react-toastify'; 

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_ADDRESS || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useApiStore.getState().config.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => { 
    if (error.response) {
      if (error.response.status === 401) {

      } else if (error.response.status === 429) {
        toast.error("Too many requests. Please wait a moment.");
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;