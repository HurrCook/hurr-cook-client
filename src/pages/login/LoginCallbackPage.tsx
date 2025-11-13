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

  console.log('🔵 [Callback] 컴포넌트 렌더링');
  console.log('📍 [Callback] location:', location.pathname, location.search);

  const { mutate } = useMutation<LoginResponse, AxiosError, string>({
    mutationFn: async (code: string) => {
      // ✅ 프론트 기준 /api → vercel 프록시 → 백엔드
      const url = `/api/auth/kakao/callback?code=${code}`;
      console.log('🔗 [Callback] 카카오 콜백 요청 URL:', url);

      // 여기서는 axiosInstance(인터셉터) 쓰지 말고 생 axios 사용
      const { data } = await axios.get<LoginResponse>(url, {
        withCredentials: true,
      });

      console.log('📥 [Callback] 백엔드 응답 원본:', data);
      return data;
    },

    onSuccess: (res) => {
      console.log('✅ [Callback] 콜백 onSuccess:', res);

      if (!res?.success || !res?.data) {
        console.warn('⚠️ [Callback] success=false 또는 data 없음:', res);
        alert(res?.message || '로그인 실패');
        navigate('/login', { replace: true });
        return;
      }

      const { accessToken, refreshToken, firstLogin, name } = res.data;

      // 토큰 저장
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userName', name);

      // 새로고침 시 code로 다시 요청 안 가게 URL 정리
      window.history.replaceState({}, '', '/login/callback');

      // 첫 로그인 여부에 따라 분기
      navigate(firstLogin ? '/userinfopage1' : '/chat', { replace: true });
    },

    onError: (err: AxiosError) => {
      const errorData = err.response?.data;

      console.error(
        '❌ [Callback] 로그인 콜백 에러:',
        errorData || err.message,
      );

      alert('로그인 중 오류가 발생했습니다.');
      navigate('/login', { replace: true });
    },
  });

  // ⭐ location.search가 바뀔 때마다 실행됨 (두 번째 로그인부터도 잡아냄)
  useEffect(() => {
    console.log('🟡 [Callback useEffect] 실행, search =', location.search);

    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    console.log('🔹 [Callback useEffect] 카카오 인가 코드:', code);

    if (code) {
      mutate(code);
    } else {
      console.warn('⚠️ [Callback useEffect] code 없음 → /login 이동');
      navigate('/login', { replace: true });
    }
  }, [location.search, mutate, navigate]); // ❗ 핵심: location.search 의존성 추가

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <div className="text-lg text-neutral-700 mb-4">
        로그인 처리 중입니다...
      </div>
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-amber-500 border-solid" />
    </div>
  );
}
