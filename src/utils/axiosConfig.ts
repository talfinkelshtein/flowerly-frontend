import { isTokenExpired, refreshAccessToken } from './AuthUtils';
import { config } from '../config';
import axios from 'axios';

const api = axios.create({
  baseURL: config.API_BASE_URL,
});

api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('accessToken');

    if (isTokenExpired(token)) {
      token = await refreshAccessToken();
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
export default api;
