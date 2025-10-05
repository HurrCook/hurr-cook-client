// src/components/layout/SettingLayout.tsx

import React from 'react';
import { Outlet } from 'react-router-dom';

export default function SettingLayout() {
  const handleSkipClick = () => {
    console.log('SettingLayout: 건너뛰기 클릭 - 다음 페이지로 이동');
    // 여기에 네비게이션 로직을 추가하세요.
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      {/* 앱 프레임 */}
      <div className="w-full min-h-screen relative flex flex-col bg-white overflow-hidden">
        {/* 1. 헤더 영역: 높이 127px 할당 */}
        <div className="relative w-full h-[127px]">
          {/* 페이지 인디케이터 */}
          <div className="absolute top-[75px] left-1/2 -translate-x-1/2 flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
            <div className="w-2.5 h-2.5 bg-neutral-300 rounded-full" />
            <div className="w-2.5 h-2.5 bg-neutral-300 rounded-full" />
            <div className="w-2.5 h-2.5 bg-neutral-300 rounded-full" />
          </div>

          {/* 건너뛰기 버튼 */}
          <button
            className="flex absolute top-[69px] right-[51px] text-amber-500 text-lg font-normal font-['Pretendard'] gap-[3px]"
            onClick={handleSkipClick}
          >
            건너뛰기
            <img
              className="hover:bg-orange-300 "
              src="/src/assets/arrow.svg"
              alt="arrow"
            />
          </button>
        </div>

        {/* 2. Outlet: UserInfoPage1의 모든 콘텐츠가 이 아래에 렌더링됨 */}
        <main className="flex-grow relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
