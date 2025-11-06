import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FooterButton from '/src/components/common/FooterButton';
import CameraModal from '/src/components/header/CameraModal';
import ImageOptionsModal from '/src/components/modal/ImageOptionsModal';
import IngredientList, { Ingredient } from '@/components/common/IngredientList';

// 재료 데이터의 타입을 수정합니다. (quantity: number, unit: string으로 분리)
type Ingredient = {
  id: number | string;
  name: string;
  image: string;
  date: string;
  quantity: number; // 💡 숫자 타입으로 변경
  unit: 'EA' | 'g' | 'ml'; // 💡 단위 필드 추가 (허용되는 단위 명시)
};

export default function UserInfoPage1_2() {
  const navigate = useNavigate();
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState<
    number | string | null
  >(null);

  // 💡 재료 수량 포맷팅 함수
  const formatQuantity = (
    quantity: number,
    unit: 'EA' | 'g' | 'ml',
  ): string => {
    switch (unit) {
      case 'EA':
        return `${quantity}개`;
      case 'g':
        return `${quantity}g`;
      case 'ml':
        return `${quantity}ml`;
      default:
        return `${quantity}`;
    }
  };

  // 💡 데이터 정의 (수정된 타입 사용)
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    {
      id: 1,
      name: '당근',
      image: 'https://placehold.co/152x152',
      date: '2025.07.30',
      quantity: 3,
      unit: 'EA',
    },
    {
      id: 2,
      name: '피망',
      image: 'https://placehold.co/152x152',
      date: '2025.07.30',
      quantity: 1,
      unit: 'EA',
    },
    {
      id: 3,
      name: '뿡',
      image: 'https://placehold.co/152x152',
      date: '2025.07.30',
      quantity: 400,
      unit: 'g',
    },
    {
      id: 4,
      name: '양파',
      image: 'https://placehold.co/152x152',
      date: '2025.07.30',
      quantity: 150,
      unit: 'ml',
    },
    {
      id: 5,
      name: '감자',
      image: 'https://placehold.co/152x152',
      date: '2025.07.30',
      quantity: 5,
      unit: 'EA',
    },
    {
      id: 6,
      name: '양파',
      image: 'https://placehold.co/152x152',
      date: '2025.07.30',
      quantity: 2,
      unit: 'EA',
    },
    {
      id: 7,
      name: '양파',
      image: 'https://placehold.co/152x152',
      date: '2025.07.30',
      quantity: 200,
      unit: 'g',
    },
    {
      id: 8,
      name: '양파',
      image: 'https://placehold.co/152x152',
      date: '2025.07.30',
      quantity: 50,
      unit: 'ml',
    },
  ]);

  // 💡 옵션 모달 핸들러 (생략)
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

  // 💡 재료 카드 클릭 핸들러 (생략)
  const handleIngredientCardClick = (id: number | string) => {
    setSelectedIngredientId(id);
    setIsDeleteModalVisible(true);
  };

  // 💡 삭제 모달 닫기 (생략)
  const handleDeleteModalClose = () => {
    setIsDeleteModalVisible(false);
    setSelectedIngredientId(null);
  };

  // 💡 삭제 로직 (생략)
  const handleDeleteConfirm = () => {
    setIngredients((prev) =>
      prev.filter((item) => item.id !== selectedIngredientId),
    );
    handleDeleteModalClose();
  };

  // 모달 비율 상수 (생략)
  const MODAL_WIDTH_PERCENT = '66.98%';
  const MODAL_HEIGHT_PERCENT = '13.73%';

  // 💡 삭제 모달 텍스트에 사용할 재료 이름 (포맷팅 필요)
  const selectedIngredientName =
    ingredients.find((i) => i.id === selectedIngredientId)?.name || '재료';

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
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div
            className={`w-[${MODAL_WIDTH_PERCENT}] h-[${MODAL_HEIGHT_PERCENT}] relative bg-white rounded-[9.60px] overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 텍스트 */}
            <div
              className="absolute top-[30.63%] left-1/2 -translate-x-1/2 text-center text-neutral-700 text-sm font-medium font-['Pretendard']"
              style={{ width: '90%' }}
            >
              {selectedIngredientName}을 삭제하시겠습니까?
            </div>

            {/* 삭제/취소 버튼 */}
            <button
              /* 삭제 버튼 */ onClick={handleDeleteConfirm}
              className="absolute w-[50%] h-[31.25%] left-0 top-[66.88%] bg-white border border-t-neutral-300 border-l-0 border-r-0 border-b-0 flex items-center justify-center text-orange-600 text-sm font-medium font-['Pretendard']"
            >
              삭제
            </button>
            <button
              /* 취소 버튼 */ onClick={handleDeleteModalClose}
              className="absolute w-[50%] h-[31.25%] left-[50%] top-[66.88%] bg-white border border-t-neutral-300 border-l-0 border-r-0 border-b-0 flex items-center justify-center text-neutral-700 text-sm font-medium font-['Pretendard']"
            >
              취소
            </button>
            <div className="absolute w-[0.80px] h-[31.25%] left-[50%] top-[66.88%] bg-neutral-300"></div>
          </div>
        </div>
      )}

      {/* 🚀 메인 스크롤 영역 */}
      <div
        className="flex-grow overflow-y-auto w-full flex justify-center"
        style={{ paddingBottom: '15.99%' }}
      >
        <div className="w-full flex justify-center mt-[18.5px]">
          <div className="w-[87.44%]">
            <IngredientList
              ingredients={ingredients}
              onCardClick={handleIngredientCardClick}
              // 💡 포맷팅 함수 전달
              formatQuantity={formatQuantity}
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
