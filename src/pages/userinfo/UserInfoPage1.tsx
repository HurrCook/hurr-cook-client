import React from 'react';
import FooterButton from '/src/components/FooterButton';
export default function UserInfoPage1() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      {/* 앱 프레임 */}
      <div className="w-full h-[932px] relative flex-col bg-white overflow-hidden">
        {/* 썸네일 카드 */}
        <div className="w- h-40 left-[37px] top-[298px] absolute rounded-lg overflow-hidden">
          <img
            className="w-80 h-80 left-[-71.41px] top-[-71.44px] absolute"
            src="src/assets/ingredient_add_image.svg"
            alt="재료 예시"
          />
        </div>

        <div className="relative w-full ">
          {/* 페이지 인디케이터 (가운데) */}
          <div className="absolute top-[75px] left-1/2 -translate-x-1/2 flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
            <div className="w-2.5 h-2.5 bg-neutral-300 rounded-full" />
            <div className="w-2.5 h-2.5 bg-neutral-300 rounded-full" />
            <div className="w-2.5 h-2.5 bg-neutral-300 rounded-full" />
          </div>

          {/* 건너뛰기 (오른쪽 고정, 같은 Y축) */}
          <button className="flex absolute top-[69px] right-[51px] text-amber-500 text-lg font-normal font-['Pretendard'] gap-[3px]">
            건너뛰기
            <img
              className="hover:bg-orange-300 "
              src="/src/assets/arrow.svg"
              alt="arrow"
            />
          </button>
        </div>

        {/* 상단 타이틀/설명 */}
        <div className="w-full flex justify-center mt-[145px]">
          <div className="w-72 p-2.5 flex flex-col justify-start items-center gap-6">
            <div className="text-center text-amber-500 text-3xl font-normal font-['Gretoon']">
              Hurr Cook
            </div>
            <div className="text-center text-amber-500 text-base font-normal font-['Pretendard']">
              AI 레시피 추천 서비스를 이용하기 위해
              <br />
              아래 버튼을 클릭하여 재료를 추가해 주세요!
            </div>
          </div>
        </div>
        {/* 다음으로 버튼 */}
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <FooterButton onClick={() => console.log('다음으로 클릭')}>
            다음으로
          </FooterButton>
        </div>
      </div>
    </div>
  );
}
