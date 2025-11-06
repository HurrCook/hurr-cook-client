import React from 'react';

export default function LoginPage() {
  const handleKakaoLogin = () => {
    window.location.href = 'http://13.125.158.205:8080/api/auth/kakao/login';
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      {/* 앱 프레임 */}
      <div className="flex px-10 w-screen h-screen justify-center items-center bg-white flex-col overflow-hidden">
        <div className="w-full inline-flex flex-col justify-start items-center gap-20">
          <div className="w-full flex flex-col justify-start items-center gap-6">
            <div className="self-stretch text-center justify-start text-amber-500 text-4xl font-normal font-['Gretoon']">
              Hurr Cook
            </div>
            <div className="self-stretch text-center justify-start text-amber-500 text-base font-normal font-['Pretendard']">
              자취생을 위한 쉽고 간편한 AI 레시피 서비스
            </div>
          </div>

          {/* 카카오 로그인 버튼 */}
          <button
            onClick={handleKakaoLogin} // ← 클릭 시 함수 호출
            className="relative flex w-full h-12 py-3 bg-[#FFE200] rounded-sm items-center hover:brightness-95 transition"
          >
            {/* 왼쪽 아이콘 */}
            <img
              className="absolute left-4 w-6"
              src="/src/assets/kakao_logo.svg"
              alt="카카오"
            />

            {/* 중앙 텍스트 */}
            <span className="mx-auto text-black text-[20px] font-normal font-['Pretendard']">
              카카오로 로그인
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
