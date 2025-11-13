// src/pages/login/LoginPage.tsx
import React from 'react';
import kakaologo from '@/assets/kakao_logo.svg';

const API_BASE_URL = import.meta.env.VITE_API_URL as string; // e.g. "https://api.hurrcook.shop/api"

export default function LoginPage() {
  const handleKakaoLogin = () => {
    if (!API_BASE_URL) {
      console.error('❌ VITE_API_URL 이 설정되어 있지 않습니다.');
      alert('서버 설정 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      return;
    }

    // 백엔드 카카오 로그인 엔드포인트로 이동
    window.location.href = `${API_BASE_URL}/auth/kakao/login`;
  };

  return (
    // ✅ 전체 뷰포트 기준 가로/세로 중앙 정렬
    <div className="min-h-[100dvh] w-screen flex items-center justify-center bg-white">
      {/* ✅ 가운데 정렬 + 최대 폭 + 자동 중앙정렬 */}
      <div className="w-full max-w-sm mx-auto px-6 flex flex-col items-center justify-center text-center">
        {/* 타이틀 */}
        <div className="flex flex-col items-center gap-6 mb-10">
          <h1 className="text-amber-500 text-5xl font-['Gretoon']">
            Hurr Cook
          </h1>
          <p className="text-amber-500 text-base font-['Pretendard']">
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
