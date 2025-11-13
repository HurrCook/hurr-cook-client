// src/pages/login/LoginPage.tsx
import React from 'react';
import kakaologo from '@/assets/kakao_logo.svg';

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) || '/api';

export default function LoginPage() {
  const handleKakaoLogin = () => {
    // 사용될 URL 예:
    // 로컬 개발 → http://13.125.158.205:8080/api/auth/kakao/login
    // 배포(Vercel) → https://hurrcook.shop/api/auth/kakao/login (Vercel이 프록시)
    const loginUrl = `${API_BASE_URL}/auth/kakao/login`;

    window.location.href = loginUrl;
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
          />
          <span className="text-black text-[18px] font-semibold font-['Pretendard']">
            카카오로 로그인
          </span>
        </button>
      </div>
    </div>
  );
}
