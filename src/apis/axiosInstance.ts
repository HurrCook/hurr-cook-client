// src/apis/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api', // Vercel 프록시
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// 요청 인터셉터: 토큰 자동 추가
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

// 응답 인터셉터: 401 → 무조건 로그인 페이지로 (무한루프 방지)
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    console.warn('🚫 401 Unauthorized → 토큰 초기화 및 로그인 이동');

    // 토큰 삭제
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('accessToken');

    // 이미 /login이면 또 리다이렉트 안 함
    if (!window.location.pathname.startsWith('/login')) {
      window.location.href = '/login';
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
