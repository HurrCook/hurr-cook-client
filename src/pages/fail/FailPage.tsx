// src/pages/refrigerator/FailPage.tsx
import React, { useEffect, useState } from 'react';
import Hurr2 from '@/assets/Hurr2.svg';
import HeaderImageOptionsModal from '@/components/modal/HeaderImageOptionsModal';

export default function FailPage() {
  const [showRetryModal, setShowRetryModal] = useState(false);

  useEffect(() => {
    // 오버플로우 제어는 유지
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow || '';
    };
  }, []);

  const handleRetry = () => {
    // 모달을 띄워 재시도 옵션을 제공합니다.
    setShowRetryModal(true);
  };

  // 💡 중요: HeaderImageOptionsModal은 이미 자체적으로 카메라를 띄우고
  // /loading 페이지로 이동하는 로직이 포함되어 있으므로,
  // FailPage는 모달을 띄우고 닫는 역할만 수행하면 됩니다.

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

      {/* 모달 렌더링 (HeaderImageOptionsModal이 모든 로직을 처리함) */}
      {showRetryModal && (
        <div className="z-50 fixed inset-0">
          <HeaderImageOptionsModal
            isVisible={showRetryModal}
            onClose={() => setShowRetryModal(false)}
            // 💡 HeaderImageOptionsModal에서 onLaunchCamera prop을 더 이상 사용하지 않거나,
            // 더미 함수를 전달해도 모달 내부의 로직이 작동하므로, 그대로 두거나 제거할 수 있습니다.
            // 여기서는 경고를 피하기 위해 빈 함수를 유지합니다.
            onLaunchCamera={() => {}}
          />
        </div>
      )}
    </div>
  );
}
