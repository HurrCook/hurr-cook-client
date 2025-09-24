import React from 'react';

type SettingsModalProps = {
  onClose: () => void;
};

export default function SettingsModal({ onClose }: SettingsModalProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      <div className="relative w-[394px] h-[620px] bg-white rounded-2xl shadow-lg flex flex-col p-6">
        {/* 타이틀 */}
        <h2 className="text-[#212121] text-[20px] font-pretendard font-normal">
          개인 맞춤 설정
        </h2>

        {/* 설명 */}
        <p className="mt-1 text-[#595959] text-[14px] font-pretendard font-normal">
          레시피 추천에 후르가 참고할 정보가 있다면 말해주세요!
        </p>

        {/* 입력 영역 */}
        <textarea
          className="mt-5 w-full h-[460px] border border-[#BEBEBE] rounded-xl p-3 resize-none focus:outline-none text-2xl"
          placeholder="여기에 입력하세요..."
        />

        {/* 하단 버튼 영역 */}
        <div className="absolute bottom-0 left-0 w-full h-0 mb-14 bg-gradient-to-b from-[rgba(255,255,255,0)] to-white backdrop-blur-sm flex items-center justify-between px-6">
          <button
            onClick={onClose}
            className="px-10 py-1 bg-[#EDEDED] text-[#777777] text-[16px] font-pretendard font-normal rounded-xl"
          >
            취소
          </button>
          <button className="px-10 py-1 bg-[#FF8800] text-white text-[16px] font-pretendard font-normal rounded-xl">
            적용
          </button>
        </div>
      </div>
    </div>
  );
}
