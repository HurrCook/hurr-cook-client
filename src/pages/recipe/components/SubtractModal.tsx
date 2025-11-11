import React, { useState } from 'react';
import Button from '@/components/common/Button';
import SubtractCard from '@/pages/recipe/components/SubtractCard';
import axiosInstance from '@/apis/axiosInstance';

interface InventoryItem {
  id: string; // userFoodId
  name: string;
  image: string;
  quantity: string;
  expiryDate: string;
}

interface SubtractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  recipe: {
    id: number;
    name: string;
    ingredients: { name: string; quantity: string }[];
  };
}

const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', // ✅ Swagger 예시값
    name: '양파',
    image: 'https://placehold.co/40x40/E8D293/000000?text=O',
    quantity: '4개',
    expiryDate: '2025.09.30',
  },
  {
    id: 'da005f9b-c132-4ba6-b243-98351ad8f414',
    name: '소고기',
    image: 'https://placehold.co/40x40/73C05D/FFFFFF?text=B',
    quantity: '200g',
    expiryDate: '2025.10.30',
  },
];

const SubtractModal: React.FC<SubtractModalProps> = ({
  isOpen,
  onClose,
  onBack,
  recipe,
}) => {
  const [selectedItems, setSelectedItems] = useState<
    { userFoodId: string; useAmount: number }[]
  >([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // 현재 레시피에 포함된 재료만 필터링
  const itemsToSubtract = MOCK_INVENTORY_ITEMS.filter((item) =>
    recipe.ingredients.some((ing) => ing.name === item.name),
  );

  // 재료 선택 (혹은 수량 조정 가능하게)
  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) => {
      const exists = prev.find((i) => i.userFoodId === id);
      if (exists) return prev.filter((i) => i.userFoodId !== id);
      return [...prev, { userFoodId: id, useAmount: 1 }]; // 기본 차감량 1
    });
  };

  // PUT /ingredients 호출
  const handleConfirm = async () => {
    if (selectedItems.length === 0) {
      alert('차감할 재료를 선택해주세요.');
      return;
    }

    try {
      setLoading(true);
      const body = {
        ingredientUseList: selectedItems,
      };

      const { data } = await axiosInstance.put('/ingredients', body);
      console.log('✅ 재료 차감 응답:', data);

      if (data.success) {
        alert('재료가 차감되었습니다!');
        onClose();
      } else {
        alert(data.message || '재료 차감에 실패했습니다.');
      }
    } catch (error) {
      console.error('❌ 재료 차감 요청 실패:', error);
      alert('서버 오류로 재료 차감에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center z-50 px-5 py-40">
      <div className="w-full bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-5 flex justify-between items-center">
          <h2 className="text-neutral-800 text-xl font-normal">재료 차감</h2>
        </div>

        <div className="p-6 pt-0 flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex flex-col gap-[10px]">
            {itemsToSubtract.length > 0 ? (
              itemsToSubtract.map((item) => {
                const isSelected = selectedItems.some(
                  (i) => i.userFoodId === item.id,
                );
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleSelectItem(item.id)}
                    className={`rounded-xl border-2 p-3 flex items-center gap-3 cursor-pointer transition
                    ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-amber-300'
                    }`}
                  >
                    <SubtractCard item={item} />
                  </div>
                );
              })
            ) : (
              <p className="text-center text-neutral-500 py-10">
                차감할 재료가 냉장고에 없습니다.
              </p>
            )}
          </div>
        </div>

        <div className="p-4 flex justify-between gap-3">
          <Button color="cancel" onClick={onBack} disabled={loading}>
            이전
          </Button>
          <Button color="default" onClick={handleConfirm} disabled={loading}>
            {loading ? '처리 중...' : '완료'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubtractModal;
