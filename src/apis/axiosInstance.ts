import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://13.125.158.205:8080/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

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

    // 401 처리 (한 번만 재시도)
    original._retry = true;

    // 이미 갱신 중이면 큐에서 대기
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

      // 백엔드 사양: POST /auth/reissuance  body: { refreshToken }
      const { data } = await axios.post(
        'http://13.125.158.205:8080/api/auth/reissuance',
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

      // 저장 & 기본 헤더 갱신
      localStorage.setItem('accessToken', newAccess);
      if (newRefresh) localStorage.setItem('refreshToken', newRefresh);
      axiosInstance.defaults.headers.Authorization = `Bearer ${newAccess}`;

      // 대기중 요청 재시도
      flushQueue(newAccess);

      // 원 요청 재실행
      original.headers.Authorization = `Bearer ${newAccess}`;
      return axiosInstance(original);
    } catch (e) {
      // 재발급 실패 → 로그인 페이지
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
