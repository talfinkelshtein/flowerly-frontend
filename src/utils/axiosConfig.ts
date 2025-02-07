import axios from 'axios';
import { config } from '../config';
import { isTokenExpired, refreshAccessToken } from './AuthUtils';

const api = axios.create({
  baseURL: config.API_BASE_URL,
});

export const setupAxiosInterceptors = (logout: () => void) => {
  api.interceptors.request.use(
    async (config) => {
      let token = localStorage.getItem('accessToken');

      if (token && isTokenExpired(token)) {
        token = await refreshAccessToken();
      }

      if (!token) {
        logout();
        return Promise.reject(new Error('Session expired'));
      }

      config.headers['Authorization'] = `Bearer ${token}`;
      return config;
    },
    (error) => Promise.reject(error)
  );
};

export default api;
