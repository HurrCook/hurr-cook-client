import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FooterButton from '/src/components/common/FooterButton';
import CameraModal from '/src/components/header/CameraModal';
import ImageOptionsModal from '/src/components/modal/ImageOptionsModal';
import IngredientList, { Ingredient } from '@/components/common/IngredientList';

export default function UserInfoPage1_2() {
  const navigate = useNavigate();
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false); // 💡 삭제 모달 상태 추가
  const [selectedIngredientId, setSelectedIngredientId] = useState<
    number | string | null
  >(null); // 💡 선택된 재료 ID

  // 💡 데이터 정의
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    // setIngredients 사용
    {
      id: 1,
      name: '당근',
      image: 'https://placehold.co/152x152',
      date: '2025.07.30',
      quantity: '3개',
    },
    {
      id: 2,
      name: '피망',
      image: 'https://placehold.co/152x152',
      date: '2025.07.30',
      quantity: '1개',
    },
    {
      id: 3,
      name: '뿡',
      image: 'https://placehold.co/152x152',
      date: '2025.07.30',
      quantity: '4개',
    },
    {
      id: 4,
      name: '양파',
      image: 'https://placehold.co/152x152',
      date: '2025.07.30',
      quantity: '2개',
    },
    {
      id: 5,
      name: '감자',
      image: 'https://placehold.co/152x152',
      date: '2025.07.30',
      quantity: '5개',
    },
    {
      id: 6,
      name: '양파',
      image: 'https://placehold.co/152x152',
      date: '2025.07.30',
      quantity: '2개',
    },
    {
      id: 7,
      name: '양파',
      image: 'https://placehold.co/152x152',
      date: '2025.07.30',
      quantity: '2개',
    },
    {
      id: 8,
      name: '양파',
      image: 'https://placehold.co/152x152',
      date: '2025.07.30',
      quantity: '2개',
    },
  ]);

  // 💡 옵션 모달 핸들러
  const handleOptionsModalClose = () => {
    setIsOverlayVisible(false);
  };
  const handleLaunchCamera = () => {
    handleOptionsModalClose();
    setCameraOn(true);
    console.log('카메라로 촬영하기 로직 시작');
  };
  const handleLaunchLibrary = () => {
    handleOptionsModalClose();
    console.log('사진 선택하기 로직 시작');
  };
  const handleCameraModalClose = () => {
    setCameraOn(false);
  };
  const handleNextClick = () => {
    navigate('/userinfopage2');
  };

  // 💡 재료 카드 클릭 핸들러 (삭제 모달 열기)
  const handleIngredientCardClick = (id: number | string) => {
    setSelectedIngredientId(id);
    setIsDeleteModalVisible(true);
  };

  // 💡 삭제 모달 닫기
  const handleDeleteModalClose = () => {
    setIsDeleteModalVisible(false);
    setSelectedIngredientId(null);
  };

  // 💡 삭제 로직 (성공적으로 구현됨)
  const handleDeleteConfirm = () => {
    // 💡 선택된 ID와 다른 요소들만 남겨서 상태를 업데이트 (실제 삭제)
    setIngredients((prev) =>
      prev.filter((item) => item.id !== selectedIngredientId),
    );
    handleDeleteModalClose(); // 삭제 후 모달 닫기
  };

  // 모달 비율 상수 (재계산 필요 없음, 이전 값 사용)
  const MODAL_WIDTH_PERCENT = '66.98%'; // 288px/430px
  const MODAL_HEIGHT_PERCENT = '13.73%'; // 128px/932px

  return (
    <div className="w-full h-full relative flex flex-col">
      {/* 0. CameraModal 렌더링 */}
      {cameraOn && <CameraModal onClose={handleCameraModalClose} />}

      {/* 1. ImageOptionsModal 렌더링 */}
      <ImageOptionsModal
        isVisible={isOverlayVisible}
        onClose={handleOptionsModalClose}
        onLaunchCamera={handleLaunchCamera}
        onLaunchLibrary={handleLaunchLibrary}
      />

      {/* 🚀 2. 삭제 확인 모달 렌더링 */}
      {isDeleteModalVisible && (
        <div
          className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center"
          // 💡 배경 클릭 시 닫히는 기능 제거 (onClick={handleDeleteModalClose} 삭제)
        >
          {/* 삭제 모달 컨테이너 (중앙 배치) */}
          <div
            className={`w-[${MODAL_WIDTH_PERCENT}] h-[${MODAL_HEIGHT_PERCENT}] relative bg-white rounded-[9.60px] overflow-hidden`}
            onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫기 방지
          >
            {/* 텍스트 */}
            <div
              className="absolute top-[30.63%] left-1/2 -translate-x-1/2 text-center text-neutral-700 text-sm font-medium font-['Pretendard']"
              style={{ width: '90%' }} // 화면 크기 변경 시 줄 바꿈 허용
            >
              {ingredients.find((i) => i.id === selectedIngredientId)?.name ||
                '재료'}
              을 삭제하시겠습니까?
            </div>

            {/* 삭제 버튼 (좌측 - 클릭 시 삭제 및 모달 닫기) */}
            <button
              className="absolute w-[50%] h-[31.25%] left-0 top-[66.88%] bg-white border border-t-neutral-300 border-l-0 border-r-0 border-b-0 flex items-center justify-center text-orange-600 text-sm font-medium font-['Pretendard']"
              onClick={handleDeleteConfirm} // 💡 삭제 로직 연결
            >
              삭제
            </button>

            {/* 취소 버튼 (우측 - 클릭 시 모달 닫기) */}
            <button
              className="absolute w-[50%] h-[31.25%] left-[50%] top-[66.88%] bg-white border border-t-neutral-300 border-l-0 border-r-0 border-b-0 flex items-center justify-center text-neutral-700 text-sm font-medium font-['Pretendard']"
              onClick={handleDeleteModalClose} // 💡 모달 닫기 로직 연결
            >
              취소
            </button>

            {/* 중앙 세로선 */}
            <div className="absolute w-[0.80px] h-[31.25%] left-[50%] top-[66.88%] bg-neutral-300"></div>
          </div>
        </div>
      )}

      {/* 🚀 메인 스크롤 영역: 모든 콘텐츠를 포함하고 푸터 간격 확보 */}
      <div
        className="flex-grow overflow-y-auto w-full flex justify-center"
        style={{ paddingBottom: '15.99%' }}
      >
        {/* 💡 재료 목록 영역 */}
        <div className="w-full flex justify-center">
          <div className="w-[87.44%]">
            {/* 💡 onCardClick 핸들러 연결 */}
            <IngredientList
              ingredients={ingredients}
              onCardClick={handleIngredientCardClick}
            />
          </div>
        </div>
      </div>

      {/* 푸터 영역 (fixed) */}
      <div className="w-full bg-gradient-to-b from-white/0 to-white backdrop-blur-[2px] flex flex-col items-center h-[15.99%] fixed bottom-0 inset-x-0">
        <div className="h-[26.17%] w-full"></div>
        <FooterButton
          className="w-[82.79%] h-[32.21%]"
          onClick={handleNextClick}
        >
          다음으로
        </FooterButton>
        <div className="flex-grow w-full"></div>
      </div>
    </div>
  );
}
