import React from 'react';
import { useNavigate } from 'react-router-dom';
import FooterButton from '/src/components/common/FooterButton';

export default function UserInfoPage4() {
  const navigate = useNavigate();
  const handleNextClick = () => {
    console.log('다음으로 클릭');
    navigate('/chat');
  };

  return (
    // 💡 최상위 컨테이너: 스크롤 방지 유지
    <div className="flex justify-center items-center w-full h-screen overflow-hidden">
      {/* 앱 프레임: W-[430px]로 고정하고 h-full 상속 */}
      <div className="relative w-full max-w-[430px] h-full bg-white flex flex-col justify-center items-center">
        {/* 1. 💡 가운데 콘텐츠 (로고 및 텍스트) */}
        <div
          // 💡 top-[26.93%] 유지, left-1/2와 -translate-x-1/2 추가하여 수평 중앙 정렬
          className="fixed top-[26.93%] left-1/2 -translate-x-1/2 flex flex-col items-center"
        >
          <img
            className="flex max-w-62"
            src="/src/assets/Hurr3.svg"
            alt="Hurr Cook 로고"
          />
          <div className="w-72 pt-[30px] inline-flex flex-col justify-start items-center gap-[23px]">
            <div className="self-stretch text-center justify-start text-amber-500 text-3xl font-normal font-['Gretoon']">
              Hurr Cook
            </div>
            <div className="self-stretch text-center justify-start text-amber-500 text-base font-normal font-['Pretendard']">
              후르쿡을 사용할 모든 준비가 완료되었어요!
            </div>
          </div>
        </div>

        {/* 2. 푸터 (Fixed) */}
        {/* 💡 앱 프레임 max-w에 맞도록 fixed 요소의 max-w도 설정 */}
        <div className="w-full bg-gradient-to-b from-white/0 to-white backdrop-blur-[2px] flex flex-col items-center h-[15.99%] fixed bottom-0 left-1/2 -translate-x-1/2 max-w-[430px]">
          <div className="h-[26.17%] w-full"></div>
          <FooterButton
            className="w-[82.79%] h-[32.21%]"
            onClick={handleNextClick}
          >
            시작하기
          </FooterButton>
          <div className="flex-grow w-full"></div>
        </div>
      </div>
    </div>
  );
}
