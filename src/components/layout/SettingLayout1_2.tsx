import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom'; // 💡 useNavigate 임포트 추가

// 💡 헤더 높이 상수 정의 (Tailwind 클래스 및 인라인 스타일에 재사용)
const HEADER_HEIGHT_PX = '127px';

export default function SettingLayout1() {
  const navigate = useNavigate(); // 💡 useNavigate 훅 사용

  const handleSkipClick = () => {
    console.log('SettingLayout1: 건너뛰기 클릭 - /userinfo4로 이동');
    navigate('/userinfopage4');
  };

  const handleBackClick = () => {
    console.log('SettingLayout1: 뒤로가기 클릭 - /userinfo1로 이동');
    navigate('/userinfopage1');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      {/* 앱 프레임 */}
      <div className="w-full min-h-screen relative flex flex-col bg-white overflow-hidden max-w-[430px]">
        {/* 1. 💡 고정된 헤더 영역: fixed, top-0, inset-x-0 추가 */}
        <div
          className="fixed top-0 inset-x-0 w-full bg-white z-40" // z-index로 다른 요소 위에 보이게 설정
          style={{ height: HEADER_HEIGHT_PX }}
        >
          {/* 뒤로가기 버튼 */}
          <button
            className="flex absolute top-[69px] left-[27px] text-amber-500 text-lg font-normal font-['Pretendard'] gap-[3px]"
            onClick={handleBackClick} // 💡 navigate('/userinfo1') 실행
          >
            <img
              className="hover:bg-orange-300 rotate-180"
              src="/src/assets/arrow.svg"
              alt="arrow"
            />
          </button>

          {/* 페이지 인디케이터 (top-[75px]은 fixed 영역 내에서 계산됨) */}
          <div className="absolute top-[75px] left-1/2 -translate-x-1/2 flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
            <div className="w-2.5 h-2.5 bg-neutral-300 rounded-full" />
            <div className="w-2.5 h-2.5 bg-neutral-300 rounded-full" />
            <div className="w-2.5 h-2.5 bg-neutral-300 rounded-full" />
          </div>

          {/* 건너뛰기 버튼 (top-[69px] 유지) */}
          <button
            className="flex absolute top-[69px] right-[37.19px] text-amber-500 text-lg font-normal font-['Pretendard'] gap-[3px]"
            onClick={handleSkipClick} // 💡 navigate('/userinfo4') 실행
          >
            건너뛰기
            <img
              className="hover:bg-orange-300 "
              src="/src/assets/arrow.svg"
              alt="arrow"
            />
          </button>
        </div>

        {/* 2. 💡 Outlet: 메인 콘텐츠 영역에 패딩 추가 */}
        <main
          className="flex-grow relative"
          style={{ paddingTop: HEADER_HEIGHT_PX }} // 헤더 높이만큼 패딩을 주어 콘텐츠가 아래로 밀리게 함
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
