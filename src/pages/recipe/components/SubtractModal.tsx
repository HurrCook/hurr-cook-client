// src/pages/recipe/components/SubtractModal.tsx
import React, { useState, useEffect } from 'react';
import Button from '@/components/common/Button';
import SubtractCard from './SubtractCard';
import api from '@/lib/axios';
import DefaultBad from '@/assets/default_bad.svg';
import DefaultGood from '@/assets/default_good.svg'; // ✅ 추가

interface IngredientResponse {
  success: boolean;
  message: string | null;
  data: Ingredient[];
}

interface Ingredient {
  userFoodId: string;
  name: string;
  imageUrl?: string;
  amount: number;
  expireDate: string;
  unit: string;
}

interface RecipeIngredient {
  name: string;
  amount: string;
}

interface SubtractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  recipe: {
    id: string;
    name: string;
    ingredients: RecipeIngredient[];
  };
}

// ✅ 스켈레톤 컴포넌트 추가
const SkeletonCard = () => (
  <div className="w-full rounded-xl p-3 border border-gray-200 bg-gray-100 animate-pulse flex items-center gap-4">
    <div className="w-16 h-16 bg-gray-300 rounded-lg" />
    <div className="flex flex-col gap-2 flex-1">
      <div className="w-1/2 h-4 bg-gray-300 rounded" />
      <div className="w-1/3 h-4 bg-gray-300 rounded" />
    </div>
  </div>
);

// ✅ 헬퍼 함수: 날짜를 00:00:00으로 정규화 (재사용성 및 안정성 확보)
const normalizeDate = (date: Date) => {
  const safeDate = new Date(date);
  safeDate.setHours(0, 0, 0, 0);
  return safeDate;
};

export default function SubtractModal({
  isOpen,
  onClose,
  onBack,
  recipe,
}: SubtractModalProps) {
  const [inventory, setInventory] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [insufficientItems, setInsufficientItems] = useState<
    { name: string; required: number; owned: number; expired?: boolean }[]
  >([]);
  // 💡 사용량이 변경된 재료 목록 상태가 필요할 수 있으나, 현재 로직은 차감만 처리하므로 제외

  useEffect(() => {
    if (!isOpen) return;
    const fetchIngredients = async () => {
      try {
        setLoading(true);
        const res = await api.get<IngredientResponse>('/api/ingredients');
        if (res.data.success && Array.isArray(res.data.data)) {
          setInventory(res.data.data);
        } else {
          setInventory([]);
        }
      } catch {
        setInventory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchIngredients();
  }, [isOpen]);

  const normalize = (name: string) =>
    name
      ?.trim()
      .toLowerCase()
      .replace(/\([^)]*\)/g, '')
      .replace(/\s+/g, '')
      .normalize('NFC');

  const matchedItems =
    recipe?.ingredients?.map((rIng) => {
      const inv = inventory.find(
        (item) => normalize(item.name) === normalize(rIng.name),
      );

      const parsedRequiredAmount =
        Number(rIng.amount.replace(/[^0-9.]/g, '')) || 0;

      // ✅ 유통기한 체크 수정
      const today = normalizeDate(new Date());
      const expired = inv
        ? normalizeDate(new Date(inv.expireDate)).getTime() < today.getTime()
        : false;

      // ✅ 이미지 결정 로직
      let imageSrc = DefaultGood;
      if (inv?.imageUrl) {
        if (
          inv.imageUrl.startsWith('http') ||
          inv.imageUrl.startsWith('data:')
        ) {
          imageSrc = inv.imageUrl;
        } else {
          imageSrc = `data:image/png;base64,${inv.imageUrl}`;
        }
      } else {
        // ✅ 만료 여부에 따라 기본 이미지 분기
        imageSrc = expired ? DefaultBad : DefaultGood;
      }

      return {
        id: inv?.userFoodId || `${rIng.name}-noid`,
        name: rIng.name,
        image: imageSrc, // ✅ 수정된 부분
        amount: inv?.amount || 0,
        unit: inv?.unit || '',
        expiryDate: inv?.expireDate || new Date().toISOString(),
        requiredAmount: parsedRequiredAmount,
      };
    }) || [];

  useEffect(() => {
    if (!inventory.length || !recipe?.ingredients?.length) return;

    const today = normalizeDate(new Date()); // ✅ 정규화된 오늘 날짜
    const insuff: {
      name: string;
      required: number;
      owned: number;
      expired?: boolean;
    }[] = [];

    recipe.ingredients.forEach((rIng) => {
      const inv = inventory.find(
        (i) => normalize(i.name) === normalize(rIng.name),
      );
      const required = Number(rIng.amount.replace(/[^0-9.]/g, '')) || 0;
      const owned = inv?.amount || 0;

      // ✅ 유통기한 비교 로직 수정
      const expired = inv
        ? normalizeDate(new Date(inv.expireDate)).getTime() < today.getTime()
        : false;

      if (!inv || owned < required || expired) {
        insuff.push({ name: rIng.name, required, owned, expired });
      }
    });

    setInsufficientItems(insuff);
  }, [inventory, recipe]);

  const handleConfirm = async () => {
    // 💡 유통기한 만료 재료가 있어도 차감하지 않는다면 이 로직 유지
    if (insufficientItems.length > 0) return;

    try {
      setLoading(true);
      const ingredientUseList = matchedItems
        .filter((m) =>
          inventory.some((i) => normalize(i.name) === normalize(m.name)),
        )
        .map((m) => {
          const inv = inventory.find(
            (i) => normalize(i.name) === normalize(m.name),
          );
          const rec = recipe.ingredients.find(
            (r) => normalize(r.name) === normalize(m.name),
          );
          const useAmount =
            rec && rec.amount
              ? Number(rec.amount.replace(/[^0-9.]/g, '')) || 0
              : 0;
          return {
            userFoodId: inv?.userFoodId,
            useAmount,
          };
        });

      await api.put('/api/ingredients', { ingredientUseList });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  // 💡 SubractCard에서 사용량을 변경할 때 호출되지만, 현재는 사용되지 않음
  // const handleChangeUsed = (id: string | number, usedAmount: number) => { /* ... */ };

  if (!isOpen) return null;

  const expiredItems = insufficientItems.filter((i) => i.expired);
  const shortageItems = insufficientItems.filter((i) => !i.expired);
  const hasExpired = expiredItems.length > 0;
  const hasShortage = shortageItems.length > 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center z-50 px-5 py-40">
      <div className="w-full bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* 헤더 */}
        <div className="p-5 flex justify-between items-center">
          <h2 className="text-neutral-800 text-xl font-normal">재료 차감</h2>
        </div>

        {/* 내용 */}
        <div className="p-6 pt-0 flex-1 overflow-y-auto custom-scrollbar">
          {(hasShortage || hasExpired) && (
            <div className="mb-3 space-y-1">
              {hasShortage && (
                <p className="text-red-500 text-sm font-medium">
                  부족한 재료: {shortageItems.map((i) => i.name).join(', ')}
                </p>
              )}
              {hasExpired && (
                <p className="text-orange-500 text-sm font-medium">
                  유통기한 지난 재료:{' '}
                  {expiredItems.map((i) => i.name).join(', ')}
                </p>
              )}
            </div>
          )}

          {/* ✅ 로딩 상태: 스켈레톤 표시 */}
          {loading ? (
            <div className="flex flex-col gap-[10px] py-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-[10px]">
              {matchedItems.length > 0 ? (
                matchedItems.map((item) => {
                  // ✅ JSX 내부 isExpired 수정
                  const today = normalizeDate(new Date());
                  const expiryDate = normalizeDate(new Date(item.expiryDate));
                  const isExpired = expiryDate.getTime() < today.getTime(); // ✅ 날짜 단위 비교

                  const isInsufficient = item.amount < item.requiredAmount;
                  return (
                    <div
                      key={item.id}
                      className={`rounded-xl p-3 flex items-center transition-colors duration-300 ${
                        isExpired || isInsufficient
                          ? 'border border-red-500 bg-red-50'
                          : 'border border-gray-200 hover:border-amber-300'
                      }`}
                    >
                      <SubtractCard item={item} />
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-neutral-500 py-10">
                  냉장고에 일치하는 재료가 없습니다.
                </p>
              )}
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="p-4 flex justify-between gap-3">
          <Button color="cancel" onClick={onBack} disabled={loading}>
            이전
          </Button>
          <Button
            color="default"
            onClick={handleConfirm}
            disabled={loading || hasShortage || hasExpired}
          >
            {hasShortage || hasExpired
              ? hasExpired
                ? '유통기한 경과'
                : '재료 부족'
              : loading
                ? '처리 중...'
                : '완료'}
          </Button>
        </div>
      </div>
    </div>
  );
}
