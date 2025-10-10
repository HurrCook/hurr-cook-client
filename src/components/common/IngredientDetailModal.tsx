import React, { useState } from 'react';
import TrashIcon from '@/assets/쓰레기통.svg';
import Button from '@/components/common/Button';
import CameraModal from '@/components/header/CameraModal';
import ImageOptionsModal from '@/components/modal/ImageOptionsModal';

interface IngredientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete?: () => void;
  ingredient: {
    name: string;
    date: string;
    quantity: string;
    image: string;
  };
  onUpdateImage?: (newUrl: string) => void;
}

const IngredientDetailModal: React.FC<IngredientDetailModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  ingredient,
  onUpdateImage,
}) => {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isImageOptionOpen, setIsImageOptionOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  if (!isOpen) return null;

  const today = new Date();
  const parsedDate = new Date(ingredient.date.replace(/\./g, '-'));
  const isExpired = parsedDate < today;

  const handleDeleteClick = () => setIsDeleteConfirmOpen(true);
  const handleDeleteCancel = () => setIsDeleteConfirmOpen(false);
  const handleDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    if (onDelete) onDelete();
    onClose();
  };

  const handleLaunchCamera = () => {
    setIsImageOptionOpen(false);
    setIsCameraOpen(true);
  };

  const handleLaunchLibrary = () => {
    setIsImageOptionOpen(false);
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const newUrl = URL.createObjectURL(file);
        if (onUpdateImage) onUpdateImage(newUrl);
      }
    };

    input.click();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center px-6 py-10">
        <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden">
          <div className="p-5 flex justify-between items-center">
            <h2 className="text-[22px] font-normal text-[#212121] font-[Pretendard]">
              재료 상세
            </h2>
            <button onClick={handleDeleteClick}>
              <img
                src={TrashIcon}
                alt="삭제 아이콘"
                className="w-[22px] h-[22px] cursor-pointer"
              />
            </button>
          </div>

          <div className="px-5 pb-6 flex flex-col gap-6 overflow-y-auto max-h-[70vh]">
            <div
              className="w-[162px] h-[162px] bg-[#F5F5F5] rounded-[10px] overflow-hidden cursor-pointer"
              onClick={() => setIsImageOptionOpen(true)}
            >
              <img
                src={ingredient.image}
                alt={ingredient.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex justify-between items-start w-full gap-3">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[#838383] text-[10px] font-light font-[Pretendard]">
                  재료명
                </label>
                <div className="px-2 py-1.5 rounded border border-[#C8C8C8]">
                  <span className="text-[#313131] text-[14px] font-light font-[Pretendard]">
                    {ingredient.name}
                  </span>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-[#838383] text-[10px] font-light font-[Pretendard]">
                  유통기한
                </label>
                <div className="px-2 py-1.5 rounded border border-[#C8C8C8]">
                  <span
                    className={`text-[14px] font-light font-[Pretendard] ${
                      isExpired ? 'text-[#FF4741]' : 'text-[#313131]'
                    }`}
                  >
                    {ingredient.date}
                  </span>
                </div>
              </div>

              <div className="flex-[0.6] flex flex-col gap-1.5">
                <label className="text-[#838383] text-[10px] font-light font-[Pretendard]">
                  갯수/용량
                </label>
                <div className="px-2 py-1.5 rounded border border-[#C8C8C8]">
                  <span className="text-[#313131] text-[14px] font-light font-[Pretendard]">
                    {ingredient.quantity}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-[#3B3B3B] text-[12px] font-normal font-[Pretendard]">
                보관방법
              </h3>
              <div className="text-[#595959] text-[10px] font-light leading-5 whitespace-pre-wrap font-[Pretendard]">
                냉장 보관 (권장) 피망은 씻지 않은 상태로 신문지나 키친타월에
                싸서 지퍼백이나 비닐봉지에 넣어 보관해요. 냉장고 야채칸에 넣으면
                5~7일 정도 신선하게 유지돼요. 냉동 보관 (장기 보관) 피망을
                깨끗이 씻고 꼭지와 씨를 제거한 뒤, 먹기 좋게 잘라서 냉동용
                지퍼백에 담아 보관해요. 생으로 바로 얼려도 괜찮지만, 살짝 데쳐서
                냉동하면 해동 후에도 식감이 잘 유지돼요. 이렇게 보관하면 2~3개월
                정도 사용할 수 있어요. 주의사항 보관 전에 피망을 씻으면 수분
                때문에 쉽게 무르거나 상할 수 있어요. 실온에서는 빨리 상하니
                가능한 한 냉장이나 냉동 보관을 추천해요.
              </div>
            </div>
          </div>

          <div className="p-5 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 bg-[#FF8800] text-white rounded-lg text-[16px] font-normal font-[Pretendard]"
            >
              확인
            </button>
          </div>
        </div>
      </div>

      <ImageOptionsModal
        isVisible={isImageOptionOpen}
        onClose={() => setIsImageOptionOpen(false)}
        onLaunchCamera={handleLaunchCamera}
        onLaunchLibrary={handleLaunchLibrary}
      />

      {isCameraOpen && <CameraModal onClose={() => setIsCameraOpen(false)} />}

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[60]">
          <div className="bg-white rounded-[9.6px] inline-flex p-6 w-72 flex-col items-center gap-7">
            <p className="text-neutral-700 text-sm font-medium">
              재료를 삭제하시겠습니까?
            </p>
            <div className="flex gap-4 w-full justify-center">
              <Button color="cancel" onClick={handleDeleteCancel}>
                취소
              </Button>
              <Button color="default" onClick={handleDeleteConfirm}>
                삭제
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IngredientDetailModal;
