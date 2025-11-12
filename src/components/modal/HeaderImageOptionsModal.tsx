// src/components/modal/HeaderImageOptionsModal.tsx
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

  const handleSelectClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.startsWith('data:')
          ? result.split(',')[1]
          : result;
        navigate('/loading', { state: { base64_images: [base64] } });
      };
      reader.onerror = () => {
        navigate('/fail');
      };
      reader.readAsDataURL(file);
    };

    input.click();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="w-[93%] mb-[8vh] flex flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 촬영 / 선택 버튼 */}
        <div className="flex flex-col bg-white rounded-xl overflow-hidden shadow-md">
          <button
            type="button"
            className="py-4 text-sky-500 text-lg font-medium font-[Pretendard] border-b border-gray-200 active:bg-gray-50"
            onClick={(e) => {
              e.stopPropagation();
              onLaunchCamera();
            }}
          >
            카메라로 촬영하기
          </button>
          <button
            type="button"
            className="py-4 text-sky-500 text-lg font-medium font-[Pretendard] active:bg-gray-50"
            onClick={handleSelectClick}
          >
            사진 선택하기
          </button>
        </div>

        {/* 취소 버튼 */}
        <button
          type="button"
          className="w-full bg-white rounded-xl py-4 text-sky-500 text-lg font-medium font-[Pretendard] shadow-sm active:bg-gray-50"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          취소
        </button>
      </div>
    </div>
  );
}
