import React, { useState } from 'react';
import FooterButton from '/src/components/common/FooterButton';
import CameraModal from '/src/components/header/CameraModal';
import ImageOptionsModal from '/src/components/modal/ImageOptionsModal';
import { useNavigate } from 'react-router-dom';

export default function UserInfoPage1() {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const navigate = useNavigate();
  // 1. 썸네일 클릭 -> 옵션 모달 열기
  const handleaddimageClick = () => {
    setIsOverlayVisible(true);
  };

  // 2. 옵션 모달 닫기
  const handleOptionsModalClose = () => {
    setIsOverlayVisible(false);
  };

  // 3. 카메라 로직: 옵션 모달 닫고, 카메라 모달 열기
  const handleLaunchCamera = () => {
    handleOptionsModalClose();
    setCameraOn(true);
    console.log('카메라로 촬영하기 로직 시작');
  };

  // 4. 갤러리 로직: 옵션 모달 닫고, 갤러리 열기
  const handleLaunchLibrary = () => {
    handleOptionsModalClose();
    console.log('사진 선택하기 로직 시작');
    // 🚨 여기에 실제 갤러리 호출 로직 (launchImageLibrary)이 들어갑니다.
  };

  // 5. CameraModal 닫기 핸들러
  const handleCameraModalClose = () => {
    setCameraOn(false);
  };
  const handleNextClick = () => {
    console.log('다음으로 클릭');
    // 다음 페이지로 이동
    navigate('/userinfopage1_2');
  };
  return (
    // SettingLayout의 Outlet에 렌더링되므로, 높이/중앙 정렬 코드를 제거하고 콘텐츠만 남깁니다.
    <div className="w-full h-full relative">
      {/* 0. CameraModal 렌더링 (fixed 포지션은 SettingLayout의 앱 프레임 기준으로 작동) */}
      {cameraOn && <CameraModal onClose={handleCameraModalClose} />}

      {/* 1. ImageOptionsModal 렌더링 */}
      <ImageOptionsModal
        isVisible={isOverlayVisible}
        onClose={handleOptionsModalClose}
        onLaunchCamera={handleLaunchCamera}
        onLaunchLibrary={handleLaunchLibrary}
      />

      {/* 상단 타이틀/설명: Header(127px) 바로 아래부터 시작하도록 마진 조정 */}
      <div className="w-full flex justify-center mt-[18.5px]">
        <div className="w-74 p-2.5 flex flex-col justify-start items-center gap-[23px]">
          <div className="text-center text-amber-500 text-[32px] font-normal font-['Gretoon']">
            Hurr Cook
          </div>
          <div className="text-center text-amber-500 text-base font-normal font-['Pretendard']">
            AI 레시피 추천 서비스를 이용하기 위해
            <br />
            아래 버튼을 클릭하여 재료를 추가해 주세요!
          </div>
        </div>
      </div>

      {/* 썸네일 카드 (클릭 시 옵션 모달 활성화) */}
      <div
        className="w-[37.20%] aspect-square absolute rounded-lg overflow-hidden cursor-pointer"
        style={{ left: '8.60%', top: '171px' }} // 앱 프레임 최상단(헤더 포함) 기준 위치
        onClick={handleaddimageClick}
        role="button"
        tabIndex={0}
      >
        <img
          className="w-full h-full"
          src="/src/assets/ingredient_add_image.svg"
          alt="재료 추가 버튼"
        />
      </div>

      {/* 메인 스크롤 영역 (푸터 간격 확보) */}
      <div
        className="flex-grow overflow-y-auto"
        style={{ paddingBottom: '15.99%' }}
      >
        {/* 이곳에 스크롤 가능한 콘텐츠가 들어갑니다. */}
      </div>

      {/* 푸터 영역 (fixed: 앱 프레임 하단에 고정) */}
      <div className="w-full bg-gradient-to-b from-white/0 to-white backdrop-blur-[2px] flex flex-col items-center h-[15.99%] fixed bottom-0 inset-x-0">
        <div className="h-[26.17%] w-full"></div>
        <FooterButton
          className="w-[82.79%] h-[32.21%]"
          // 💡 정의한 핸들러 함수 연결
          onClick={handleNextClick}
        >
          다음으로
        </FooterButton>
        <div className="flex-grow w-full"></div>
      </div>
    </div>
  );
}
