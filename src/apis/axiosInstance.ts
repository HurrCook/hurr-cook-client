import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://13.125.158.205:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 인증이 필요한 경우 사용 (JWT는 없어도 됨)
});

// 요청 인터셉터: 모든 요청에 토큰 자동 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('accessToken') ||
      sessionStorage.getItem('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('❌ 요청 인터셉터 에러:', error);
    return Promise.reject(error);
  },
);

// 응답 인터셉터: 인증 실패(401) 시 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('⚠️ 인증이 만료되었거나 유효하지 않습니다.');
      // 👉 필요하면 자동 로그아웃 or 리다이렉트
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
