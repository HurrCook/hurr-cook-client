// src/components/common/RecipeModal.tsx
import React, { useState, useEffect } from 'react';
import Button from '@/components/common/Button';
import IngredientItem from '@/pages/recipe/components/IngredientItem';
import IngredientUsedBanner from '@/components/chat/IngredientUsedBanner';
import api from '@/lib/axios';
import DefaultFoodImage from '@/assets/FoodImage.svg';

interface Ingredient {
  name: string;
  quantity: string;
}

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: {
    id: number;
    name: string;
    image: string;
    ingredients: Ingredient[];
    instructions: string[];
  };
}

export default function RecipeModal({
  isOpen,
  onClose,
  recipe,
}: RecipeModalProps) {
  const [loading, setLoading] = useState(false);
  const [userIngredients, setUserIngredients] = useState<
    {
      userFoodId: string;
      name: string;
      amount: number;
      unit: string;
      expireDate: string;
    }[]
  >([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [showUsedBanner, setShowUsedBanner] = useState(false);

  useEffect(() => {
    if (isOpen) void fetchUserIngredients();
  }, [isOpen]);

  const fetchUserIngredients = async () => {
    try {
      const res = await api.get('/ingredients');
      if (res.data?.success && Array.isArray(res.data.data)) {
        const ingredients = res.data.data;
        setUserIngredients(ingredients);
        evaluateIngredientStatus(ingredients);
      }
    } catch (err) {
      console.error('[RecipeModal] GET /ingredients error:', err);
    }
  };

  const evaluateIngredientStatus = (
    ingredients: { name: string; expireDate: string }[],
  ) => {
    const today = new Date();
    const recipeIngredientNames = recipe.ingredients.map((i) => i.name.trim());
    const matched = ingredients.filter((i) =>
      recipeIngredientNames.includes(i.name.trim()),
    );

    const hasExpired = matched.some((i) => new Date(i.expireDate) < today);

    if (hasExpired) {
      setStatusMessage('재료 유통기한이 지났어요..');
    } else if (matched.length < recipe.ingredients.length) {
      setStatusMessage('재료가 부족해요..');
    } else {
      setStatusMessage('재료가 충분해요!');
    }
  };

  const handleUseIngredients = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const ingredientUseList = recipe.ingredients
        .map((recipeItem) => {
          const matched = userIngredients.find(
            (userItem) => userItem.name.trim() === recipeItem.name.trim(),
          );
          if (!matched) return null;
          return {
            userFoodId: matched.userFoodId,
            useAmount: Number(recipeItem.quantity) || 1,
          };
        })
        .filter((it): it is { userFoodId: string; useAmount: number } => !!it);

      const payload = { ingredientUseList };

      await api.put('/ingredients', payload);
      onClose();
      setShowUsedBanner(true);
      setTimeout(() => setShowUsedBanner(false), 3000);
    } catch (error) {
      console.error('[RecipeModal] PUT /ingredients error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex justify-center z-50 px-5 py-40">
        <div className="w-full bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
          <div className="p-5 flex justify-between items-center">
            <h2 className="text-neutral-800 text-xl font-normal">
              레시피 확인
            </h2>
          </div>

          <div className="p-6 pt-0 flex flex-col overflow-y-auto gap-4 custom-scrollbar">
            <div className="flex flex-col items-start gap-2.5">
              <div className="w-40 h-36 relative rounded-xl outline-1 outline-stone-300 overflow-hidden">
                <img
                  src={DefaultFoodImage} // ✅ 무조건 기본 이미지 사용
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
                {statusMessage}
              </p>
            </div>

            <div className="w-full flex flex-col justify-start items-start gap-2.5">
              <label className="text-neutral-400 text-xs font-normal">
                요리명
              </label>
              <div className="w-full h-10 px-2.5 py-1.5 bg-white rounded-xl outline-1 outline-stone-300 flex items-center">
                <span className="text-neutral-800 text-base font-normal truncate">
                  {recipe.name}
                </span>
              </div>
            </div>

            <div className="w-full flex flex-col justify-start items-start gap-2.5">
              <label className="text-neutral-400 text-xs font-normal">
                필요한 재료
              </label>
              <div className="w-full min-h-[128px] p-2 bg-white rounded-lg outline outline-1 outline-stone-300 flex flex-col gap-2">
                {recipe.ingredients.map((item, index) => (
                  <IngredientItem
                    key={index}
                    name={item.name}
                    quantity={item.quantity}
                    isEditable={false}
                  />
                ))}
              </div>
            </div>

            <div className="w-full flex flex-col justify-start items-start gap-2.5">
              <label className="text-neutral-400 text-xs font-normal">
                만드는 순서
              </label>
              <div className="w-full min-h-[288px] p-2 bg-white rounded-xl outline-1 outline-stone-300 overflow-hidden">
                <div className="text-zinc-600 text-sm font-normal leading-loose whitespace-pre-wrap">
                  {recipe.instructions.join('\n\n')}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 flex justify-between gap-3">
            <Button color="cancel" onClick={onClose}>
              취소
            </Button>
            <Button color="default" onClick={handleUseIngredients}>
              {loading ? '처리 중...' : '재료차감'}
            </Button>
          </div>
        </div>
      </div>

      <IngredientUsedBanner
        isVisible={showUsedBanner}
        onHide={() => setShowUsedBanner(false)}
      />
    </>
  );
}
