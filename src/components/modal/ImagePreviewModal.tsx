import React from 'react';

type ImagePreviewModalProps = {
  imageDataUrl: string;
  onClose: () => void; // X 버튼
  onRetake: () => void; // 다시 촬영하기 → 카메라 모달 재오픈
  onConfirm: () => void; // 확정 → 파일로 저장(상태에 반영)
};

export default function ImagePreviewModal({
  imageDataUrl,
  onClose,
  onRetake,
  onConfirm,
}: ImagePreviewModalProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
      <div className="relative w-[430px] max-w-[90vw] rounded-lg bg-white p-4 shadow-xl">
        {/* 닫기 */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full bg-black/10 px-3 py-1 text-sm"
        >
          ✕
        </button>

        {/* 미리보기 이미지 */}
        <div className="mb-4 flex justify-center">
          <img
            src={imageDataUrl}
            alt="preview"
            className="max-h-[70vh] w-full rounded-md object-contain"
          />
        </div>

        {/* 버튼들 */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onRetake}
            className="rounded-md bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
          >
            다시 촬영하기
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-amber-500 px-4 py-2 text-sm text-white hover:bg-amber-600"
          >
            확정
          </button>
        </div>
      </div>
    </div>
  );
}
