// src/pages/userinfo/UserInfoPage2.tsx
import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FooterButton from '/src/components/common/FooterButton';
import IngredientEditList, {
  IngredientEditData,
} from '@/components/common/IngredientEditList';
import api from '@/lib/axios';

const parseQuantityValue = (value: string, field: string): string =>
  field === 'quantity' ? value.replace(/[^0-9]/g, '') : value;

const getTodayDate = (): string => {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(
    2,
    '0',
  )}-${String(t.getDate()).padStart(2, '0')}`;
};

type NavState = { ingredients?: IngredientEditData[] };

export default function UserInfoPage2() {
  const navigate = useNavigate();
  const location = useLocation();
  const incoming = (location.state as NavState | null)?.ingredients;

  const initial: IngredientEditData[] = useMemo(() => {
    if (Array.isArray(incoming) && incoming.length > 0) {
      return incoming.map((it, idx) => ({
        id: it.id ?? `${Date.now()}_${idx}`,
        name: it.name ?? '재료',
        image: it.image,
        imageUrl: it.imageUrl ?? it.image,
        date:
          it.date && /^\d{4}-\d{2}-\d{2}$/.test(it.date)
            ? it.date
            : getTodayDate(),
        quantity:
          typeof it.quantity === 'string'
            ? it.quantity
            : String(it.quantity ?? '1'),
        unit: (it.unit as IngredientEditData['unit']) ?? 'EA',
      }));
    }
    return [];
  }, [incoming]);

  const [ingredients, setIngredients] = useState<IngredientEditData[]>(initial);

  const handleUpdateIngredient = (
    id: number | string,
    field: keyof IngredientEditData,
    value: string,
  ): void => {
    setIngredients((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === 'quantity' ? parseQuantityValue(value, field) : value,
            }
          : item,
      ),
    );
  };

  const normalizeUnit = (u: string): 'EA' | 'G' | 'ML' => {
    const v = (u || '').toUpperCase();
    if (v === 'EA') return 'EA';
    if (v === 'G' || v === 'GRAM') return 'G';
    if (v === 'ML' || v === 'MILLILITER') return 'ML';
    return 'EA';
  };

  const toISODateOrToday = (raw?: string): string => {
    if (!raw) return new Date().toISOString();
    const d = new Date(raw);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  };

  const handleNextClick = async (): Promise<void> => {
    const payload = {
      ingredients: ingredients.map((ing) => ({
        name: ing.name,
        amount: Number(ing.quantity ?? 0),
        unit: normalizeUnit(ing.unit as string),
        expireDate: toISODateOrToday(ing.date),
        imageUrl: ing.imageUrl ?? null,
      })),
    };

    try {
      const res = await api.post('/ingredients', payload, {
        headers: { 'Content-Type': 'application/json' },
        maxBodyLength: Infinity,
      });

      if (!res.data?.success) return;

      await api.get('/ingredients');
      navigate('/userinfopage3');
    } catch (err) {
      console.error('[UserInfoPage2] POST /ingredients error:', err);
    }
  };

  return (
    <div className="w-full h-full relative flex flex-col">
      <div
        className="flex-grow overflow-y-auto w-full flex justify-center"
        style={{ paddingBottom: '16vh' }}
      >
        <div className="w-full flex justify-center mt-[0.5px]">
          <div className="w-[86.98%]">
            {ingredients.length === 0 ? (
              <div className="text-center text-neutral-500 py-8">
                등록할 재료가 없습니다. 이전 단계에서 사진을 업로드해 주세요.
              </div>
            ) : (
              <IngredientEditList
                ingredients={ingredients}
                onUpdate={handleUpdateIngredient}
              />
            )}
          </div>
        </div>
      </div>

      <div className="w-full bg-gradient-to-b from-white/0 to-white backdrop-blur-[2px] flex flex-col items-center h-[15.99%] fixed bottom-0 inset-x-0">
        <div className="h-[26.17%] w-full" />
        <FooterButton
          className="w-[82.79%] h-[32.21%]"
          onClick={handleNextClick}
        >
          다음으로
        </FooterButton>
        <div className="flex-grow w-full" />
      </div>
    </div>
  );
}
