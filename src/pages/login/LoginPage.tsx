// src/pages/login/LoginPage.tsx
import React from 'react';
import kakaologo from '@/assets/kakao_logo.svg';

export default function LoginPage() {
  const handleKakaoLogin = () => {
    window.location.href = 'http://13.125.158.205:8080/api/auth/kakao/login';
  };

  return (
    // 🔥 여기 수정: min-h-screen → min-h-[100dvh]
    <div className="flex justify-center items-center min-h-[100dvh] bg-white">
      <div className="flex flex-col items-center justify-center w-full max-w-md px-10">
        {/* 타이틀 */}
        <div className="flex flex-col items-center gap-6 mb-10">
          <h1 className="text-amber-500 text-5xl font-['Gretoon']">
            Hurr Cook
          </h1>
          <p className="text-amber-500 text-base font-['Pretendard'] text-center">
            자취생을 위한 쉽고 간편한 AI 레시피 서비스
          </p>
        </div>

        {/* 카카오 로그인 버튼 */}
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
