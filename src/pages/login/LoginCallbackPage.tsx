// src/pages/login/LoginCallbackPage.tsx
import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

type LoginResponse = {
  success: boolean;
  message: string | null;
  data?: {
    userId: string;
    name: string;
    accessToken: string;
    refreshToken: string;
    firstLogin: boolean;
  };
};

export default function LoginCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { mutate } = useMutation<LoginResponse, AxiosError, string>({
    mutationFn: async (code: string) => {
      const url = `/api/auth/kakao/callback?code=${code}`;
      console.log('🔗 카카오 콜백 요청 URL:', url);

      const { data } = await axios.get<LoginResponse>(url, {
        withCredentials: true,
      });
      return data;
    },

    onSuccess: (res) => {
      console.log('✅ 콜백 응답:', res);

      if (!res?.success || !res?.data) {
        alert(res?.message || '로그인 실패');
        navigate('/login', { replace: true });
        return;
      }

      const { accessToken, refreshToken, firstLogin, name } = res.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userName', name);

      // code 제거
      window.history.replaceState({}, '', '/login/callback');

      navigate(firstLogin ? '/userinfopage1' : '/chat', { replace: true });
    },

    onError: (err) => {
      console.error('❌ 로그인 콜백 에러:', err.response?.data || err.message);
      alert('로그인 중 오류 발생');
      navigate('/login', { replace: true });
    },
  });

  useEffect(() => {
    const code = new URLSearchParams(location.search).get('code');
    console.log('🔹 카카오 인가 코드:', code);

    if (code) {
      mutate(code);
    } else {
      navigate('/login', { replace: true });
    }
  }, [location.search]); // ★ 핵심: 쿼리 변경을 감지해 재실행

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <div className="text-lg text-neutral-700 mb-4">
        로그인 처리 중입니다...
      </div>
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-amber-500 border-solid" />
    </div>
  );
}
