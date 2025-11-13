// src/apis/axiosInstance.ts
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// ---------------------
//  🔐 AccessToken 자동 첨부
// ---------------------
axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('accessToken') ||
      sessionStorage.getItem('accessToken');

    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ---------------------
//  ♻️ Refresh Token 로직
// ---------------------
let isRefreshing = false;
let pendingQueue: Array<(token: string) => void> = [];

const flushQueue = (newToken: string) => {
  pendingQueue.forEach((cb) => cb(newToken));
  pendingQueue = [];
};

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingQueue.push((token: string) => {
          original.headers.Authorization = `Bearer ${token}`;
          resolve(axiosInstance(original));
        });
      });
    }

    try {
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refreshToken');

      // 🔥 환경변수 기반으로 재발급 주소도 자동 생성
      const { data } = await axios.post(
        `${BASE_URL}/auth/reissuance`,
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

      original.headers.Authorization = `Bearer ${newAccess}`;
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
