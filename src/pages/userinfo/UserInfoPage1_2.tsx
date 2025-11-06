import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FooterButton from '/src/components/common/FooterButton';
import CameraModal from '/src/components/header/CameraModal';
import ImageOptionsModal from '/src/components/modal/ImageOptionsModal';
import IngredientList from '@/components/common/IngredientList';

// ⚙️ Ingredient 타입 재정의 (이 파일 전용)
type IngredientItem = {
  id: number | string;
  name: string;
  image: string;
  date: string;
  quantity: number;
  unit: 'EA' | 'g' | 'ml';
};

export default function UserInfoPage1_2() {
  const navigate = useNavigate();
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState<
    number | string | null
  >(null);

  // 수량 포맷터
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

  // 재료 더미 데이터
  const [ingredients, setIngredients] = useState<IngredientItem[]>([
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
  ]);

  // 옵션 모달 핸들러
  const handleOptionsModalClose = () => setIsOverlayVisible(false);
  const handleLaunchCamera = () => {
    handleOptionsModalClose();
    setCameraOn(true);
  };
  const handleLaunchLibrary = () => {
    handleOptionsModalClose();
    console.log('사진 선택하기 로직 시작');
  };
  const handleCameraModalClose = () => setCameraOn(false);
  const handleNextClick = () => navigate('/userinfopage2');

  // 재료 카드 클릭 시 삭제 모달 열기
  const handleIngredientCardClick = (id: number | string) => {
    setSelectedIngredientId(id);
    setIsDeleteModalVisible(true);
  };

  // 삭제 모달 닫기
  const handleDeleteModalClose = () => {
    setIsDeleteModalVisible(false);
    setSelectedIngredientId(null);
  };

  // 삭제 확정
  const handleDeleteConfirm = () => {
    setIngredients((prev) => prev.filter((i) => i.id !== selectedIngredientId));
    handleDeleteModalClose();
  };

  const selectedIngredientName =
    ingredients.find((i) => i.id === selectedIngredientId)?.name || '재료';

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* 카메라 모달 */}
      {cameraOn && <CameraModal onClose={handleCameraModalClose} />}

      {/* 이미지 선택 모달 */}
      <ImageOptionsModal
        isVisible={isOverlayVisible}
        onClose={handleOptionsModalClose}
        onLaunchCamera={handleLaunchCamera}
        onLaunchLibrary={handleLaunchLibrary}
      />

      {/* 🧩 삭제 확인 모달 */}
      {isDeleteModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div
            className="relative overflow-hidden rounded-[9.6px] bg-white"
            style={{
              width: '66.98%',
              height: '13.73%',
              minWidth: '280px',
              maxWidth: '500px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* 텍스트 */}
            <div className="absolute left-1/2 top-[30%] w-[90%] -translate-x-1/2 text-center font-['Pretendard'] text-sm font-medium text-neutral-700">
              {selectedIngredientName}을 삭제하시겠습니까?
            </div>

            {/* 삭제 버튼 */}
            <button
              onClick={handleDeleteConfirm}
              className="absolute left-0 top-[66.88%] flex h-[31.25%] w-1/2 items-center justify-center border-t border-neutral-300 bg-white font-['Pretendard'] text-sm font-medium text-orange-600"
            >
              삭제
            </button>

            {/* 취소 버튼 */}
            <button
              onClick={handleDeleteModalClose}
              className="absolute left-1/2 top-[66.88%] flex h-[31.25%] w-1/2 items-center justify-center border-t border-neutral-300 bg-white font-['Pretendard'] text-sm font-medium text-neutral-700"
            >
              취소
            </button>

            {/* 버튼 사이 구분선 */}
            <div className="absolute left-1/2 top-[66.88%] h-[31.25%] w-px bg-neutral-300" />
          </div>
        </div>
      )}

      {/* 재료 목록 */}
      <div
        className="flex w-full flex-grow justify-center overflow-y-auto"
        style={{ paddingBottom: '15.99%' }}
      >
        <div className="mt-[18.5px] flex w-full justify-center">
          <div className="w-[87.44%]">
            <IngredientList
              ingredients={ingredients}
              onCardClick={handleIngredientCardClick}
              formatQuantity={formatQuantity}
            />
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <div className="fixed inset-x-0 bottom-0 flex h-[15.99%] w-full flex-col items-center bg-gradient-to-b from-white/0 to-white backdrop-blur-[2px]">
        <div className="h-[26.17%] w-full" />
        <FooterButton
          className="h-[32.21%] w-[82.79%]"
          onClick={handleNextClick}
        >
          다음으로
        </FooterButton>
        <div className="w-full flex-grow" />
      </div>
    </div>
  );
}
