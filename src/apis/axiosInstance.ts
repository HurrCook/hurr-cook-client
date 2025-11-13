// src/apis/axiosInstance.ts
import axios, { AxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api', // 프록시 통해 백엔드 연결
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('accessToken') ||
      sessionStorage.getItem('accessToken');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let pendingQueue: Array<(token: string) => void> = [];

const flushQueue = (newToken: string) => {
  pendingQueue.forEach((cb) => cb(newToken));
  pendingQueue = [];
};

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    // 🔧 타입 안전하게 변경
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingQueue.push((token: string) => {
          if (original.headers) {
            original.headers.Authorization = `Bearer ${token}`;
          }
          resolve(axiosInstance(original));
        });
      });
    }

    try {
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refreshToken');

      const { data } = await axios.post(
        '/api/auth/reissuance',
        { refreshToken },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken') ?? ''}`,
          },
        },
      );

      const newAccess = data?.data?.accessToken;
      const newRefresh = data?.data?.refreshToken;

      if (!newAccess) throw new Error('No new access token');

      localStorage.setItem('accessToken', newAccess);
      if (newRefresh) localStorage.setItem('refreshToken', newRefresh);
      axiosInstance.defaults.headers.Authorization = `Bearer ${newAccess}`;

      flushQueue(newAccess);

      if (original.headers) {
        original.headers.Authorization = `Bearer ${newAccess}`;
      }

      return axiosInstance(original);
    } catch (e) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosInstance;
