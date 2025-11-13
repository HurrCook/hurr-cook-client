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
  const state = location.state as { ingredients?: unknown } | null;
  const received = Array.isArray(state?.ingredients)
    ? (state!.ingredients as DetectedIngredient[])
    : undefined;

  const normalizeImage = (img?: string): string => {
    if (!img) return 'https://placehold.co/152x152';
    if (img.startsWith('data:image')) return img;
    if (/^[A-Za-z0-9+/=]+$/.test(img)) return `data:image/jpeg;base64,${img}`;
    if (img.startsWith('http')) return img;
    return 'https://placehold.co/152x152';
  };

  const initialIngredients: IngredientItem[] = useMemo(() => {
    if (!received || received.length === 0) return [];
    return received.map((it, idx) => ({
      id: it.id || `${Date.now()}_${idx}`,
      name: it.name || '재료',
      image: normalizeImage(it.image),
      quantity: typeof it.quantity === 'number' ? it.quantity : 1,
      unit: (it.unit as IngredientItem['unit']) || 'EA',
    }));
  }, [received]);

  const [ingredients, setIngredients] =
    useState<IngredientItem[]>(initialIngredients);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState<
    number | string | null
  >(null);

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

  const handleOptionsModalClose = () => setIsOverlayVisible(false);
  const handleLaunchCamera = () => {
    setIsOverlayVisible(false);
    setCameraOn(true);
  };
  const handleLaunchLibrary = () => setIsOverlayVisible(false);
  const handleCameraModalClose = () => setCameraOn(false);

  const handleIngredientCardClick = (id: number | string) => {
    setSelectedIngredientId(id);
    setIsDeleteModalVisible(true);
  };
  const handleDeleteModalClose = () => {
    setIsDeleteModalVisible(false);
    setSelectedIngredientId(null);
  };
  const handleDeleteConfirm = () => {
    setIngredients((prev) => prev.filter((i) => i.id !== selectedIngredientId));
    handleDeleteModalClose();
  };

  const handleNextClick = () => {
    const editPayload = ingredients.map((it) => ({
      id: it.id,
      name: it.name,
      image: it.image,
      imageUrl: it.image,
      date: '',
      quantity: String(it.quantity),
      unit: it.unit,
    }));
    navigate('/userinfopage2', { state: { ingredients: editPayload } });
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

      <div
        className="flex w-full flex-grow justify-center overflow-y-auto"
        style={{ paddingBottom: '16vh' }}
      >
        <div className="mt-[18.5px] flex w-full justify-center">
          <div className="w-[87.44%]">
            <IngredientList
              ingredients={ingredients}
              onCardClick={handleIngredientCardClick}
              formatQuantity={formatQuantity}
            />
            <div className="h-[2vh]" />
          </div>
        </div>
      </div>

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
