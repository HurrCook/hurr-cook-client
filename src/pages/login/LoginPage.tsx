// src/pages/login/LoginPage.tsx
import React, { useEffect } from 'react';
import kakaologo from '@/assets/kakao_logo.svg';

export default function LoginPage() {
  useEffect(() => {
    console.log('🔵 [LoginPage] 컴포넌트 마운트됨');
    console.log('📱 User Agent:', navigator.userAgent);
  }, []);

  const handleKakaoLogin = () => {
    const redirectUrl = '/api/auth/kakao/login';

    console.log('🟡 [LoginPage] 카카오 로그인 버튼 클릭됨');
    console.log('➡️ 이동 요청 URL:', redirectUrl);

    // 실제 이동
    window.location.href = redirectUrl;
  };

  return (
    <div className="min-h-[100dvh] w-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm mx-auto px-6 flex flex-col items-center justify-center text-center">
        <div className="flex flex-col items-center gap-6 mb-10">
          <h1 className="text-amber-500 text-5xl font-['Gretoon']">
            Hurr Cook
          </h1>
          <p className="text-amber-500 text-base font-['Pretendard']">
            자취생을 위한 쉽고 간편한 AI 레시피 서비스
          </p>
        </div>

        <button
          onClick={handleKakaoLogin}
          className="relative flex items-center justify-center w-full h-12 bg-[#FEE500] rounded-lg hover:brightness-95 transition shadow-md"
        >
          <img
            src={kakaologo}
            alt="kakao"
            className="absolute left-4 w-6 h-6"
            onLoad={() => console.log('🟢 kakao_logo.svg 로드됨')}
            onError={() => console.log('🔴 kakao_logo.svg 로드 실패')}
          />
          <span className="text-black text-[18px] font-semibold font-['Pretendard']">
            카카오로 로그인
          </span>
        </button>
      </div>
    </div>
  );
}
