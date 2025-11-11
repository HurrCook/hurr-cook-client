import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FooterButton from '/src/components/common/FooterButton';
import CameraModal from '/src/components/header/CameraModal';
import ImageOptionsModal from '/src/components/modal/ImageOptionsModal';
import IngredientList from '@/components/common/IngredientList';
import type { DetectedIngredient } from './UserInfoPage1';

type IngredientItem = {
  id: number | string;
  name: string;
  image: string;
  quantity: number;
  unit: 'EA' | 'g' | 'ml';
};

export default function UserInfoPage1_2() {
  const navigate = useNavigate();
  const location = useLocation();

  // ▼ UserInfoPage1에서 넘어온 재료 데이터

  // 타입 안전하게 처리
  const state = location.state as { ingredients?: unknown };
  const received = Array.isArray(state.ingredients)
    ? (state.ingredients as DetectedIngredient[])
    : undefined;

  /**
   * ✅ base64 crop_image가 내려올 때 처리
   * 백엔드에서 { name: '당근', crop_image: '<base64문자열>' } 형태라면
   * 자동으로 dataURL 변환해서 보여줌
   */
  const initialIngredients: IngredientItem[] = useMemo(() => {
    if (!Array.isArray(received) || received.length === 0) return [];
    return received.map((it, idx) => {
      let imgSrc = 'https://placehold.co/152x152';
      if (it.image) {
        // 1) 백엔드가 이미 data:image/... 형태로 줬으면 그대로
        if (it.image.startsWith('data:image')) imgSrc = it.image;
        // 2) base64 문자열만 줬으면 수동으로 변환
        else if (/^[A-Za-z0-9+/=]+$/.test(it.image)) {
          imgSrc = `data:image/jpeg;base64,${it.image}`;
        }
        // 3) URL이면 그대로 사용
        else if (it.image.startsWith('http')) {
          imgSrc = it.image;
        }
      }
      return {
        id: it.id || `${Date.now()}_${idx}`,
        name: it.name || '재료',
        image: imgSrc,
        quantity: typeof it.quantity === 'number' ? it.quantity : 1,
        unit: (it.unit as IngredientItem['unit']) || 'EA',
      };
    });
  }, [received]);

  const [ingredients, setIngredients] =
    useState<IngredientItem[]>(initialIngredients);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState<
    number | string | null
  >(null);

  /** 단위 포맷팅 */
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

  /** 모달 관련 함수 */
  const handleOptionsModalClose = () => setIsOverlayVisible(false);
  const handleLaunchCamera = () => {
    setIsOverlayVisible(false);
    setCameraOn(true);
  };
  const handleLaunchLibrary = () => {
    setIsOverlayVisible(false);
    // TODO: 필요하면 갤러리 로직 추가
  };
  const handleCameraModalClose = () => setCameraOn(false);

  /** 다음 페이지 이동 */
  const handleNextClick = () => navigate('/userinfopage2');

  /** 재료 카드 클릭 → 삭제 모달 열기 */
  const handleIngredientCardClick = (id: number | string) => {
    setSelectedIngredientId(id);
    setIsDeleteModalVisible(true);
  };

  /** 삭제 모달 제어 */
  const handleDeleteModalClose = () => {
    setIsDeleteModalVisible(false);
    setSelectedIngredientId(null);
  };
  const handleDeleteConfirm = () => {
    setIngredients((prev) => prev.filter((i) => i.id !== selectedIngredientId));
    handleDeleteModalClose();
  };

  const selectedIngredientName =
    ingredients.find((i) => i.id === selectedIngredientId)?.name || '재료';

  return (
    <div className="relative flex h-full w-full flex-col">
      {cameraOn && <CameraModal onClose={handleCameraModalClose} />}

      <ImageOptionsModal
        isVisible={isOverlayVisible}
        onClose={handleOptionsModalClose}
        onLaunchCamera={handleLaunchCamera}
        onLaunchLibrary={handleLaunchLibrary}
      />

      {/* 삭제 모달 */}
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
            <div className="absolute left-1/2 top-[30%] w-[90%] -translate-x-1/2 text-center font-['Pretendard'] text-sm font-medium text-neutral-700">
              {selectedIngredientName}을 삭제하시겠습니까?
            </div>
            <button
              onClick={handleDeleteConfirm}
              className="absolute left-0 top-[66.88%] flex h-[31.25%] w-1/2 items-center justify-center border-t border-neutral-300 bg-white font-['Pretendard'] text-sm font-medium text-orange-600"
            >
              삭제
            </button>
            <button
              onClick={handleDeleteModalClose}
              className="absolute left-1/2 top-[66.88%] flex h-[31.25%] w-1/2 items-center justify-center border-t border-neutral-300 bg-white font-['Pretendard'] text-sm font-medium text-neutral-700"
            >
              취소
            </button>
            <div className="absolute left-1/2 top-[66.88%] h-[31.25%] w-px bg-neutral-300" />
          </div>
        </div>
      )}

      {/* 스크롤 영역 */}
      <div className="flex w-full flex-grow justify-center overflow-y-auto">
        <div className="mt-[18.5px] flex w-full justify-center">
          <div className="w-[87.44%]">
            <IngredientList
              ingredients={ingredients}
              onCardClick={handleIngredientCardClick}
              formatQuantity={formatQuantity}
            />
            <div className="h-[16vh]" />
          </div>
        </div>
      </div>

      {/* 고정 푸터 */}
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
