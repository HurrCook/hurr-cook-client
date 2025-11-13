import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import arrow from '@/assets/arrow.svg';
// 💡 헤더 높이 상수 정의 (Tailwind 클래스 및 인라인 스타일에 재사용)
const HEADER_HEIGHT_PX = '278px';

export default function SettingLayout3() {
  const navigate = useNavigate();
  const handleSkipClick = () => {
    console.log('SettingLayout1: 건너뛰기 클릭 - /userinfo4로 이동');
    navigate('/userinfopage4');
  };

  const handleBackClick = () => {
    console.log('SettingLayout1: 뒤로가기 클릭 - /userinfo1로 이동');
    navigate('/userinfopage2');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      {/* 앱 프레임 */}
      {/* ⚠️ 앱 프레임의 width를 고정하는 것이 안정적입니다. (예: w-[430px])
         현재는 w-full로 유지하고, fixed 요소가 앱 프레임의 중앙에 있도록 조정합니다. */}
      <div className="w-full min-h-screen relative flex flex-col bg-white overflow-hidden max-w-[430px]">
        {/* 1. 💡 고정된 헤더 영역: fixed, top-0, inset-x-0 추가 */}
        <div
          className="fixed top-0 inset-x-0 w-full bg-white z-40" // z-index로 다른 요소 위에 보이게 설정
          style={{ height: HEADER_HEIGHT_PX }}
        >
          <button
            className="flex absolute top-[69px] left-[27px] text-amber-500 text-lg font-normal font-['Pretendard'] gap-[3px]"
            onClick={handleBackClick} // 💡 navigate('/userinfo1') 실행
          >
            <img
              className="hover:bg-orange-300 rotate-180"
              src={arrow}
              alt="arrow"
            />
          </button>
          {/* 페이지 인디케이터 (top-[75px]은 fixed 영역 내에서 계산됨) */}
          <div className="absolute top-[75px] left-1/2 -translate-x-1/2 flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 bg-neutral-300 rounded-full" />
            <div className="w-2.5 h-2.5 bg-neutral-300 rounded-full" />
            <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
            <div className="w-2.5 h-2.5 bg-neutral-300 rounded-full" />
          </div>

          {/* 건너뛰기 버튼 (top-[69px] 유지) */}
          <button
            className="flex absolute top-[69px] right-[37.19px] text-amber-500 text-lg font-normal font-['Pretendard'] gap-[3px]"
            onClick={handleSkipClick}
          >
            건너뛰기
            <img className="hover:bg-orange-300 " src={arrow} alt="arrow" />
          </button>
          <div
            // 💡 fixed: 뷰포트 기준 고정
            // 💡 top-[X]px: 상단 위치
            // 💡 left-1/2: 뷰포트 중앙에 왼쪽 모서리 배치
            // 💡 -translate-x-1/2: 요소 너비의 절반만큼 왼쪽으로 이동하여 완벽한 수평 중앙 정렬
            className="fixed left-1/2 -translate-x-1/2 mt-[145.5px] w-74 p-2.5 flex flex-col items-center"
          >
            <div className="text-center text-amber-500 text-[32px] font-normal font-['Gretoon']">
              Hurr Cook
            </div>
            <div className="text-center text-amber-500 text-base font-normal font-['Pretendard']">
              AI 레시피 추천 서비스를 이용하기 위해
              <br />
              보유하신 조리도구를 선택해주세요!
            </div>
          </div>
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
