// src/components/common/RecipeModal.tsx
import React, { useState, useEffect, useMemo } from 'react';
import Button from '@/components/common/Button';
import IngredientItem from '@/pages/recipe/components/IngredientItem';
import IngredientUsedBanner from '@/components/chat/IngredientUsedBanner';
import SubtractModal from '@/pages/recipe/components/SubtractModal';
import api from '@/lib/axios';
import DefaultFoodImage from '@/assets/FoodImage.svg';

interface Ingredient {
  name: string;
  amount: number;
  unit?: string;
  userFoodId?: string;
  quantity?: number | string;
}

interface UserIngredient {
  userFoodId: string;
  name: string;
  amount: number;
  unit: string;
  expireDate: string;
}

interface Recipe {
  id: number;
  name: string;
  image: string;
  ingredients?: Ingredient[];
  instructions?: string[];
  time?: string;
  calories?: string;
}

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe;
}

export default function RecipeModal({
  isOpen,
  onClose,
  recipe,
}: RecipeModalProps) {
  const [loading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userIngredients, setUserIngredients] = useState<UserIngredient[]>([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [showUsedBanner, setShowUsedBanner] = useState(false);
  const [showSubtractModal, setShowSubtractModal] = useState(false);
  const [isExpiredFound, setIsExpiredFound] = useState(false); // ✅ 만료 재료 존재 여부 상태

  // ✅ 재료 정규화
  const normIngredients = useMemo(() => {
    return (recipe?.ingredients ?? []).map((it) => {
      const rawAmount = (it.amount ?? it.quantity ?? '') as number | string;
      const parsedAmount =
        typeof rawAmount === 'string'
          ? parseFloat(rawAmount.replace(/[^0-9.]/g, '')) || 0
          : Number(rawAmount) || 0;
      return {
        name: it.name,
        amount: parsedAmount,
        unit: it.unit ?? '',
      };
    });
  }, [recipe?.ingredients]);

  useEffect(() => {
    if (isOpen) void fetchUserIngredients();
  }, [isOpen]);

  // ✅ 냉장고 재료 불러오기
  const fetchUserIngredients = async (): Promise<void> => {
    try {
      const res = await api.get('/api/ingredients');
      if (res.data?.success && Array.isArray(res.data.data)) {
        const ingredients: UserIngredient[] = res.data.data;
        setUserIngredients(ingredients);
        evaluateIngredientStatus(ingredients);
      }
    } catch (err) {
      console.error('[RecipeModal] GET /ingredients error:', err);
    }
  };

  // ✅ 재료 충분 여부 판단
  const evaluateIngredientStatus = (
    ingredients: { name: string; expireDate: string }[],
  ): void => {
    // 🚨 수정: 현재 시각(today)의 시간 정보를 UTC 자정(00:00:00Z)으로 리셋
    const todayUTC = new Date();
    todayUTC.setUTCHours(0, 0, 0, 0); // 오늘 날짜의 UTC 자정으로 설정 (시간 정보 제거)

    const normalizeName = (s: string): string => s.normalize('NFC').trim();
    const recipeNames = normIngredients.map((i) => normalizeName(i.name));
    const matched = ingredients.filter((i) =>
      recipeNames.includes(normalizeName(i.name)),
    );

    // ✅ 만료 로직: 유통기한 날짜(expiry)가 오늘 날짜(todayUTC)보다 엄격하게 작은 경우에만 만료 처리
    // -> 만료일 당일(expiry == todayUTC)은 유효한 것으로 간주합니다.
    const hasExpired = matched.some((i) => {
      const expiry = new Date(i.expireDate);
      return expiry.getTime() < todayUTC.getTime();
    });

    setIsExpiredFound(hasExpired); // ✅ 상태 업데이트

    if (hasExpired) setStatusMessage('재료 유통기한이 지났어요.');
    else if (matched.length < normIngredients.length)
      setStatusMessage('재료가 부족해요.');
    else setStatusMessage('재료가 충분해요!');
  };

  // ✅ SubtractModal 열기
  const handleGoSubtract = (): void => {
    // 만료된 재료가 있다면 차감 로직 실행 방지
    if (isExpiredFound) {
      // 사용자에게 시각적인 경고를 줄 수 있습니다.
      return;
    }

    setShowSubtractModal(true);
  };

  if (!isOpen) return null;
  const instructions = recipe.instructions ?? [];

  return (
    <>
      {/* ✅ SubtractModal이 열리면 RecipeModal 숨김 */}
      {!showSubtractModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center z-50 px-5 py-40">
          <div className="w-full bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-5 flex justify-between items-center">
              <h2 className="text-neutral-800 text-xl font-normal">
                레시피 확인
              </h2>
            </div>

            <div className="p-6 pt-0 flex flex-col overflow-y-auto gap-4 custom-scrollbar">
              {/* 이미지 + 상태 */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-start gap-2.5 shrink-0">
                  <div className="w-40 h-36 relative rounded-xl outline-1 outline-stone-300 overflow-hidden">
                    <img
                      src={recipe.image || DefaultFoodImage}
                      alt={recipe.name}
                      className="w-full h-full object-cover cursor-default select-none opacity-90"
                      draggable={false}
                    />
                  </div>
                  <p
                    className={`text-sm font-normal ${
                      statusMessage.includes('충분')
                        ? 'text-amber-500'
                        : 'text-red-500'
                    }`}
                  >
                    {statusMessage || '재료 정보를 확인 중...'}
                  </p>
                </div>

                {/* 조리시간, 칼로리 → 텍스트로만 표시 */}
                <div className="flex flex-col justify-start h-36 flex-1 gap-1">
                  {recipe.time && (
                    <p className="text-sm text-neutral-600 font-normal">
                      <span className="text-neutral-400 text-xs">
                        조리 시간:{' '}
                      </span>
                      {recipe.time}
                    </p>
                  )}
                  {recipe.calories && (
                    <p className="text-sm text-neutral-600 font-normal">
                      <span className="text-neutral-400 text-xs">칼로리: </span>
                      {recipe.calories}
                    </p>
                  )}
                </div>
              </div>

              {/* 요리명 */}
              <div className="w-full flex flex-col gap-2.5">
                <label className="text-neutral-400 text-xs font-normal">
                  요리명
                </label>
                <div className="w-full h-10 px-2.5 py-1.5 bg-white rounded-xl outline-1 outline-stone-300 flex items-center">
                  <span className="text-neutral-800 text-base font-normal truncate">
                    {recipe.name}
                  </span>
                </div>
              </div>

              {/* 재료 */}
              <div className="w-full flex flex-col gap-2.5">
                <label className="text-neutral-400 text-xs font-normal">
                  필요한 재료
                </label>
                <div className="w-full min-h-[128px] p-2 bg-white rounded-lg outline outline-1 outline-stone-300 flex flex-col gap-2">
                  {normIngredients.length > 0 ? (
                    normIngredients.map((item, index) => (
                      <IngredientItem
                        key={index}
                        name={item.name}
                        amount={`${item.amount ?? '-'} ${item.unit ?? ''}`}
                        isEditable={false}
                      />
                    ))
                  ) : (
                    <p className="text-neutral-400 text-sm">재료 정보 없음</p>
                  )}
                </div>
              </div>

              {/* 만드는 순서 */}
              <div className="w-full flex flex-col gap-2.5">
                <label className="text-neutral-400 text-xs font-normal">
                  만드는 순서
                </label>
                <div className="w-full min-h-[288px] p-2 bg-white rounded-xl outline-1 outline-stone-300 overflow-hidden">
                  <div className="text-zinc-600 text-sm font-normal leading-loose whitespace-pre-wrap">
                    {instructions.length > 0
                      ? instructions.join('\n\n')
                      : '조리 단계 정보 없음'}
                  </div>
                </div>
              </div>
            </div>

            {/* 버튼 */}
            <div className="p-4 flex justify-between gap-3">
              <Button color="cancel" onClick={onClose}>
                취소
              </Button>
              <Button
                color="default"
                onClick={handleGoSubtract}
                // ✅ 만료된 재료가 발견되면 버튼 비활성화
                disabled={loading || isExpiredFound}
              >
                {loading ? '처리 중...' : '재료차감'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ SubtractModal (RecipeModal 숨김 후 렌더링) */}
      {showSubtractModal && (
        <SubtractModal
          isOpen={showSubtractModal}
          onClose={() => {
            setShowSubtractModal(false);
            onClose(); // 차감 후 RecipeModal도 닫기
          }}
          onBack={() => setShowSubtractModal(false)}
          recipe={{
            id: String(recipe.id),
            name: recipe.name,
            ingredients: normIngredients.map((i) => ({
              name: i.name,
              amount: String(i.amount),
            })),
          }}
        />
      )}

      <IngredientUsedBanner
        isVisible={showUsedBanner}
        onHide={() => setShowUsedBanner(false)}
      />
    </>
  );
}
