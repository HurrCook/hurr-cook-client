// /src/components/layout/SettingLayout1.tsx
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

// 상단에 제목/안내문까지 포함되는 높이
const HEADER_HEIGHT_PX = '278px';

export default function SettingLayout1() {
  const navigate = useNavigate();

  const handleSkipClick = () => {
    // step1 건너뛰기 → 마지막 온보딩으로
    navigate('/userinfopage4');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      {/* 앱 프레임 (모바일 폭 고정) */}
      <div className="w-full min-h-screen relative flex flex-col bg-white overflow-hidden max-w-[430px]">
        {/* ✅ 고정 헤더 */}
        <div
          className="fixed top-0 inset-x-0 w-full bg-white z-40"
          style={{ height: HEADER_HEIGHT_PX }}
        >
          {/* 페이지 인디케이터 */}
          <div className="absolute top-[75px] left-1/2 -translate-x-1/2 flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
            <div className="w-2.5 h-2.5 bg-neutral-300 rounded-full" />
            <div className="w-2.5 h-2.5 bg-neutral-300 rounded-full" />
            <div className="w-2.5 h-2.5 bg-neutral-300 rounded-full" />
          </div>

          {/* 건너뛰기 */}
          <button
            className="flex absolute top-[69px] right-[37.19px] text-amber-500 text-lg font-normal font-['Pretendard'] gap-[3px]"
            onClick={handleSkipClick}
          >
            건너뛰기
            <img
              className="hover:bg-orange-300"
              src="/src/assets/arrow.svg"
              alt="arrow"
            />
          </button>

          {/* 상단 타이틀/안내문 (고정) */}
          <div className="fixed left-1/2 -translate-x-1/2 mt-[145.5px] w-74 p-2.5 flex flex-col items-center">
            <div className="text-center text-amber-500 text-[32px] font-normal font-['Gretoon']">
              Hurr Cook
            </div>
            <div className="text-center text-amber-500 text-base font-normal font-['Pretendard']">
              AI 레시피 추천 서비스를 이용하기 위해
              <br />
              아래 버튼을 눌러 재료 사진을 추가해 주세요!
            </div>
          </div>
        </div>

        {/* ✅ 스크롤 영역: Outlet만 스크롤되도록 헤더 높이만큼 패딩 */}
        <main
          className="flex-grow relative"
          style={{ paddingTop: HEADER_HEIGHT_PX }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
