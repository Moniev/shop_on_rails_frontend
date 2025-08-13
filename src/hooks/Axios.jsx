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
    return response.data;
  },
  async (error) => { 
    if (error.response && error.response.status === 401) {
      const { useAuthStore } = await import('../store/AuthStore'); 
    } else if (error.response && error.response.status === 429) {
      toast.error(`Damn son! isn't it enough?`);
    }
    
    return Promise.reject(error.response ? error.response.data : error);
  }
);

export default apiClient;