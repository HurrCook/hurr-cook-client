import React, { useState, useEffect } from 'react';
import Button from '@/components/common/Button';
import SubtractCard from './SubtractCard';
import axiosInstance from '@/apis/axiosInstance';

interface InventoryItem {
  userFoodId: string;
  name: string;
  imageUrl?: string;
  amount: number;
  expireDate: string;
  unit: string;
}

interface SubtractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  recipe: {
    id: string;
    name: string;
    ingredients: { name: string; amount: string }[];
  };
}

const SubtractModal: React.FC<SubtractModalProps> = ({
  isOpen,
  onClose,
  onBack,
  recipe,
}) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [usedMap, setUsedMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);

  // 냉장고 재료 불러오기
  useEffect(() => {
    if (!isOpen) return;
    (async () => {
      try {
        const res = await axiosInstance.get('/ingredients');
        if (res.data.success && Array.isArray(res.data.data)) {
          setInventory(res.data.data);
        }
      } catch (error) {
        console.error('❌ 냉장고 재료 불러오기 실패:', error);
      }
    })();
  }, [isOpen]);

  // 레시피에 포함된 재료만 필터링
  const filteredItems = inventory.filter((item) =>
    recipe.ingredients.some(
      (ing) => ing.name.trim().toLowerCase() === item.name.trim().toLowerCase(),
    ),
  );

  // SubtractCard에서 선택값 전달받기
  const handleChangeUsed = (id: string | number, used: number) => {
    setUsedMap((prev) => ({ ...prev, [id]: used }));
  };

  // 실제 차감 요청
  const handleConfirm = async () => {
    try {
      setLoading(true);

      // 각 재료의 선택값(usedMap) 사용
      const body = {
        ingredientUseList: filteredItems.map((item) => ({
          userFoodId: item.userFoodId,
          useAmount: usedMap[item.userFoodId] ?? 0, // ✅ 선택된 수량 사용
        })),
      };

      console.log('차감 요청 body:', body);

      const { data } = await axiosInstance.put('/ingredients', body);

      if (data.success) {
        alert('재료가 차감되었습니다!');
        onClose();
      } else {
        alert(data.message || '재료 차감 실패');
      }
    } catch (error) {
      console.error('재료 차감 요청 실패:', error);
      alert('서버 오류로 재료 차감에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center z-50 px-5 py-40">
      <div className="w-full bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-5 flex justify-between items-center">
          <h2 className="text-neutral-800 text-xl font-normal">재료 차감</h2>
        </div>

        <div className="p-6 pt-0 flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex flex-col gap-[10px]">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div
                  key={item.userFoodId}
                  className="rounded-xl border border-gray-200 hover:border-amber-300 p-3 flex items-center gap-3"
                >
                  <SubtractCard
                    item={{
                      id: item.userFoodId,
                      name: item.name,
                      image: item.imageUrl || 'https://placehold.co/40x40',
                      quantity: `${item.amount}${item.unit}`,
                      expiryDate: item.expireDate,
                    }}
                    onChangeUsed={handleChangeUsed}
                  />
                </div>
              ))
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
