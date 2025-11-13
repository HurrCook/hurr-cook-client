// src/apis/axiosInstance.ts
import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api', // ✅ vercel 프록시 사용
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

// 요청 인터셉터: 토큰 있으면 Authorization 달아주기
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
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
  async (error: AxiosError) => {
    const original = error.config as
      | (AxiosRequestConfig & { _retry?: boolean })
      | undefined;

    // 원 요청 정보가 없으면 그냥 실패
    if (!original) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const url = original.url || '';

    // 🔒 리프레시 로직을 타면 안 되는 경우들
    if (
      status !== 401 || // 401 아닐 때
      original._retry || // 이미 한 번 재시도 했을 때
      url.includes('/auth/kakao') || // 카카오 로그인/콜백
      url.includes('/auth/reissuance') // 재발급 요청 자체
    ) {
      return Promise.reject(error);
    }

    // 여기부터는 "일반 API 401"인 경우만 들어옴
    original._retry = true;

    // 이미 다른 요청이 리프레시 중이면 대기열에 넣고, 끝나면 다시 시도
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
      if (!refreshToken) {
        throw new Error('No refreshToken');
      }

      // ❗ 여기서는 글로벌 axios 사용 (axiosInstance 아님)
      //    baseURL 없이 /api 로 바로 호출 → vercel 프록시
      const { data } = await axios.post(
        '/api/auth/reissuance',
        { refreshToken },
        {
          headers: {
            Authorization: `Bearer ${
              localStorage.getItem('accessToken') ?? ''
            }`,
          },
        },
      );

      const newAccess: string | undefined = data?.data?.accessToken;
      const newRefresh: string | undefined = data?.data?.refreshToken;

      if (!newAccess) {
        throw new Error('No new access token');
      }

      // 새 토큰 저장
      localStorage.setItem('accessToken', newAccess);
      if (newRefresh) {
        localStorage.setItem('refreshToken', newRefresh);
      }

      // 기본 헤더 갱신
      axiosInstance.defaults.headers.Authorization = `Bearer ${newAccess}`;

      // 대기 큐 처리
      flushQueue(newAccess);

      // 원래 요청 다시 보내기
      if (original.headers) {
        original.headers.Authorization = `Bearer ${newAccess}`;
      }

      return axiosInstance(original);
    } catch (e) {
      // 리프레시마저 실패 → 로그아웃 처리
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
