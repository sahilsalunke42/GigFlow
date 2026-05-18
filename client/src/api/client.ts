import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL, TOKEN_KEY } from '@/utils/constants';

export const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const apiClient = createApiInstance();
