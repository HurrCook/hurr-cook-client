import React from 'react';

type SettingsModalProps = {
  onClose: () => void;
};

export default function SettingsModal({ onClose }: SettingsModalProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      <div className="relative bg-white w-80 p-6 rounded-lg shadow-lg z-50">
        <h2 className="text-lg font-semibold">설정</h2>
        <p className="mt-2 text-sm text-gray-600">
          여기에서 설정을 수정할 수 있습니다.
        </p>
        <button
          className="mt-4 px-4 py-2 bg-[#FF8800] text-white rounded-lg w-full"
          onClick={onClose}
        >
          닫기
        </button>
      </div>
    </div>
  );
}
