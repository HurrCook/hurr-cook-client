// src/pages/refrigerator/FailPage.tsx
import React, { useEffect, useState } from 'react';
import Hurr2 from '@/assets/Hurr2.svg';
import HeaderImageOptionsModal from '@/components/modal/HeaderImageOptionsModal';

export default function FailPage() {
  const [showRetryModal, setShowRetryModal] = useState(false);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow || '';
    };
  }, []);

  const handleRetry = () => {
    setShowRetryModal(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white pb-32 relative">
      {/* 상단 이미지 */}
      <div className="mb-10 flex justify-center">
        <img src={Hurr2} alt="후르 아이콘" className="w-[140px] h-[140px]" />
      </div>

      {/* 안내 문구 */}
      <p className="text-[#FF8800] text-center text-base font-normal font-[Pretendard] leading-relaxed mb-8">
        앗, 후르가 재료를 잘 못 알아봤어요...
        <br />
        다시 한 번만 보여줄래요?
      </p>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center bg-white py-4 z-20">
        <button
          onClick={handleRetry}
          className="w-[90%] max-w-[600px] bg-[#FF8800] text-white py-3 rounded-lg font-medium hover:bg-[#ff7b00] active:scale-[0.98] transition-all shadow-md"
        >
          다시 시도하기
        </button>
      </div>
      {showRetryModal && (
        <div className="z-50 fixed inset-0">
          <HeaderImageOptionsModal
            isVisible={showRetryModal}
            onClose={() => setShowRetryModal(false)}
            onLaunchCamera={() => {}}
          />
        </div>
      )}
    </div>
  );
}
