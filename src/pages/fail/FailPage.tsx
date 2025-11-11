// src/pages/refrigerator/FailPage.tsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hurr2 from '@/assets/Hurr2.svg';

export default function FailPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // 스크롤 잠금
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow || '';
    };
  }, []);

  const handleRetry = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-white pb-32"
      style={{ transform: 'translateY(-5rem)' }}
    >
      {/* 상단 이미지 */}
      <img
        src={Hurr2}
        alt="후르 아이콘"
        className="w-[140px] h-[140px] mt-30 mb-10"
      />

      {/* 텍스트 */}
      <p className="text-[#FF8800] text-center text-base font-normal font-[Pretendard] leading-relaxed mb-8">
        앗, 후르가 재료를 잘 못 알아봤어요...
        <br />
        다시 한 번만 보여줄래요?
      </p>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center bg-white py-4">
        <button
          onClick={handleRetry}
          className="w-[90%] max-w-[600px] bg-[#FF8800] text-white py-3 rounded-lg font-medium hover:bg-[#ff7b00] active:scale-[0.98] transition-all shadow-md"
        >
          다시 시도하기
        </button>
      </div>
    </div>
  );
}
