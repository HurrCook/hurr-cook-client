import React from 'react';
import Button from '@/components/common/Button';

interface InventoryItem {
  id: number;
  name: string;
  image: string; // 재고 이미지 (선택사항)
  quantity: string;
  expiryDate: string; // 유통기한 예시
}

interface SubtractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onConfirmSubtract: (recipeId: number) => void; // '완료' 버튼 클릭 시 재료 차감 로직을 호출할 함수
  recipe: {
    id: number;
    name: string;
    ingredients: { name: string; quantity: string }[];
  };
}

const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 101,
    name: '피망',
    image: 'https://placehold.co/40x40/73C05D/FFFFFF?text=P',
    quantity: '10개',
    expiryDate: '2025.08.30',
  },
  {
    id: 102,
    name: '피망',
    image: 'https://placehold.co/40x40/73C05D/FFFFFF?text=P',
    quantity: '5개',
    expiryDate: '2025.09.20',
  },
  {
    id: 201,
    name: '양파',
    image: 'https://placehold.co/40x40/E8D293/000000?text=O',
    quantity: '4개',
    expiryDate: '2025.09.30',
  },
];

const SubtractModal: React.FC<SubtractModalProps> = ({
  isOpen,
  onClose,
  onBack,
  onConfirmSubtract,
  recipe,
}) => {
  if (!isOpen) return null;

  const itemsToSubtract = MOCK_INVENTORY_ITEMS.filter((item) =>
    recipe.ingredients.some((ing) => ing.name === item.name),
  );

  const handleConfirm = () => {
    // 1. 차감 로직 수행 (onConfirmSubtract 호출)
    onConfirmSubtract(recipe.id);

    // 2. 모달 닫기
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center z-50 px-5 py-40">
      <div className="w-full bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* 모달 상단 헤더 */}
        <div className="p-5 flex justify-between items-center">
          <h2 className="text-neutral-800 text-xl font-normal">재료 차감</h2>
        </div>

        {/* 모달 내용 스크롤 */}
        <div className="p-5 flex-1 flex flex-col overflow-y-auto gap-4 custom-scrollbar">
          <p className="text-neutral-700 text-sm font-medium">
            "{recipe.name}" 요리에 사용될 재료 목록입니다.
          </p>

          {/* 재고 목록 테이블/리스트 헤더 */}
          <div className="flex text-xs font-semibold text-neutral-500 border-b pb-2">
            <span className="w-1/6 text-left"></span>
            <span className="w-2/6 text-left">재료명</span>
            <span className="w-2/6 text-center">수량</span>
            <span className="w-2/6 text-right">유통기한</span>
          </div>

          {/* 재고 목록 항목 */}
          {itemsToSubtract.map((item) => (
            <div
              key={item.id}
              className="flex items-center text-sm border-b last:border-b-0 pb-2"
            >
              {/* 이미지 */}
              <div className="w-1/6">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 rounded object-cover"
                />
              </div>
              {/* 재료명 */}
              <span className="w-2/6 text-neutral-800 font-medium">
                {item.name}
              </span>
              {/* 수량 (차감될 수량) */}
              <span className="w-2/6 text-center text-zinc-600">
                {/* ⚠️ 여기서 실제 차감될 수량을 표시/편집해야 합니다. */}
                {item.quantity}
              </span>
              {/* 유통기한 */}
              <span className="w-2/6 text-right text-red-500 font-light">
                {item.expiryDate}
              </span>
            </div>
          ))}
        </div>

        {/* 푸터 버튼 (취소, 완료) */}
        <div className="p-4 flex justify-between gap-3">
          <Button color="cancel" onClick={onBack}>
            이전
          </Button>
          <Button color="default" onClick={onClose}>
            완료
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubtractModal;
