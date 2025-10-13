// src/components/modal/ImageOptionsModal.tsx (파일 경로 가정)

import React from 'react';

interface ImageOptionsModalProps {
  isVisible: boolean; // 모달을 보여줄지 말지 결정하는 Prop
  onClose: () => void;
  onLaunchCamera: () => void;
  onLaunchLibrary: () => void;
}

export default function ImageOptionsModal({
  isVisible,
  onClose,
  onLaunchCamera,
  onLaunchLibrary,
}: ImageOptionsModalProps) {
  // 모달이 보이지 않으면 아무것도 렌더링하지 않습니다.
  if (!isVisible) {
    return null;
  }

  // Camera와 Select 버튼 핸들러
  // 이 함수들은 모달 닫기 로직을 포함하지 않습니다. 상위 컴포넌트가 로직을 처리합니다.
  const handleCameraClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 모달 내부 클릭이 오버레이 닫는 것을 방지
    onLaunchCamera();
  };

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLaunchLibrary();
  };

  return (
    // 1. 오버레이 배경 (fixed inset-0으로 뷰포트 전체 고정)
    <div className="fixed inset-0 bg-black/30 z-50 flex flex-col items-center justify-end">
      {/* 2. 모달 컨테이너 (앱 프레임 크기 기준 비율) */}
      <div
        className="w-[93.02%] h-[17.06%] relative mb-[7.30vh]" // mb-[7.30vh]로 높이 비율 간격 유지
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 오버레이 닫기 방지
      >
        {/* 2. 촬영/선택 버튼 컨테이너 (96px 높이 영역) */}
        <div className="relative h-[60.38%] bg-white rounded-xl overflow-hidden">
          {/* 2-1. 카메라로 촬영하기 버튼 (상단 50%) */}
          <div
            className="absolute w-full h-1/2 left-0 top-0 text-sky-500 text-lg font-medium font-['Pretendard'] cursor-pointer flex items-center justify-center border-b border-gray-200"
            onClick={handleCameraClick}
          >
            카메라로 촬영하기
          </div>

          {/* 2-2. 사진 선택하기 버튼 (하단 50%) */}
          <div
            className="absolute w-full h-1/2 left-0 top-1/2 text-sky-500 text-lg font-medium font-['Pretendard'] cursor-pointer flex items-center justify-center"
            onClick={handleSelectClick}
          >
            사진 선택하기
          </div>
        </div>

        {/* 1. 취소 버튼 영역 (400px x 48px) */}
        <div
          className="w-full h-[30.19%] bg-white rounded-lg overflow-hidden cursor-pointer mt-3"
          onClick={onClose} // 취소 클릭 시 닫기
        >
          {/* 텍스트: 취소 */}
          <div className="w-full h-full text-center flex items-center justify-center text-sky-500 text-lg font-medium font-['Pretendard']">
            취소
          </div>
        </div>
      </div>
    </div>
  );
}
