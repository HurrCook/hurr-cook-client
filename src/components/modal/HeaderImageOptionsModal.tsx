import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderImageOptionsModalProps {
  isVisible: boolean;
  onClose: () => void;
  onLaunchCamera: () => void;
}

export default function HeaderImageOptionsModal({
  isVisible,
  onClose,
  onLaunchCamera,
}: HeaderImageOptionsModalProps) {
  const navigate = useNavigate();

  if (!isVisible) return null;

  const handleCameraClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLaunchCamera();
  };

  const handleSelectClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        console.log('선택된 이미지:', imageUrl);
        navigate('/loading'); // 로딩 페이지 이동
      }
    };
    input.click();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 z-50 flex flex-col items-center justify-end"
      onClick={onClose}
    >
      <div
        className="w-[93.02%] h-[17.06%] relative mb-[7.30vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-[60.38%] bg-white rounded-xl overflow-hidden">
          <div
            className="absolute w-full h-1/2 left-0 top-0 text-sky-500 text-lg font-medium font-['Pretendard'] cursor-pointer flex items-center justify-center border-b border-gray-200"
            onClick={handleCameraClick}
          >
            카메라로 촬영하기
          </div>

          <div
            className="absolute w-full h-1/2 left-0 top-1/2 text-sky-500 text-lg font-medium font-['Pretendard'] cursor-pointer flex items-center justify-center"
            onClick={handleSelectClick}
          >
            사진 선택하기
          </div>
        </div>

        <div
          className="w-full h-[30.19%] bg-white rounded-lg overflow-hidden cursor-pointer mt-3"
          onClick={onClose}
        >
          <div className="w-full h-full text-center flex items-center justify-center text-sky-500 text-lg font-medium font-['Pretendard']">
            취소
          </div>
        </div>
      </div>
    </div>
  );
}
