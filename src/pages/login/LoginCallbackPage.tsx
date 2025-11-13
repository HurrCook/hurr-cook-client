// src/pages/login/LoginCallbackPage.tsx
import { useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
  const didRunRef = useRef(false);

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

      window.history.replaceState({}, '', '/login/callback');

      navigate(firstLogin ? '/userinfopage1' : '/chat', { replace: true });
    },
    onError: (err) => {
      console.error('❌ 로그인 콜백 에러:', err.response?.data || err.message);
      alert('로그인 중 오류가 발생했습니다.');
      navigate('/login', { replace: true });
    },
  });

  useEffect(() => {
    if (didRunRef.current) return;
    didRunRef.current = true;

    const code = new URLSearchParams(window.location.search).get('code');
    console.log('🔹 카카오 인가 코드:', code);
    if (code) {
      mutate(code);
    } else {
      navigate('/login', { replace: true });
    }
  }, [mutate, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <div className="text-lg text-neutral-700 mb-4">
        로그인 처리 중입니다...
      </div>
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-amber-500 border-solid" />
    </div>
  );
}
