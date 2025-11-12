import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FooterButton from '/src/components/common/FooterButton';
import IngredientEditList, {
  IngredientEditData,
} from '@/components/common/IngredientEditList';
import api from '@/lib/axios';

// 🔧 IngredientEditData에 imageUrl을 optional로 포함해 주세요.
// type IngredientEditData = {
//   id: number | string;
//   name: string;
//   image?: string;      // UI 표시용
//   imageUrl?: string;   // ✅ 서버로 보낼 값
//   date: string;        // 'YYYY-MM-DD'
//   quantity: string;    // 문자열
//   unit: 'EA' | 'g' | 'ml';
// };

const parseQuantityValue = (value: string, field: string): string =>
  field === 'quantity' ? value.replace(/[^0-9]/g, '') : value;

const getTodayDate = (): string => {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
};

type NavState = { ingredients?: IngredientEditData[] };

export default function UserInfoPage2() {
  const navigate = useNavigate();
  const location = useLocation();
  const incoming = (location.state as NavState | null)?.ingredients;

  // ✅ incoming.imageUrl 유지 (없으면 image에서 대체)
  const initial: IngredientEditData[] = useMemo(() => {
    if (Array.isArray(incoming) && incoming.length > 0) {
      return incoming.map((it, idx) => ({
        id: it.id ?? `${Date.now()}_${idx}`,
        name: it.name ?? '재료',
        image: it.image, // UI 표시용
        imageUrl: it.imageUrl ?? it.image, // ✅ 서버용
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
    return []; // 더미 제거
  }, [incoming]);

  const [ingredients, setIngredients] = useState<IngredientEditData[]>(initial);

  const handleUpdateIngredient = (
    id: number | string,
    field: keyof IngredientEditData,
    value: string,
  ) => {
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

  const toISODateOrToday = (raw?: string) => {
    if (!raw) return new Date().toISOString();
    const d = new Date(raw);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  };

  const handleNextClick = async () => {
    const payload = {
      ingredients: ingredients.map((ing) => ({
        name: ing.name,
        amount: Number(ing.quantity ?? 0),
        unit: normalizeUnit(ing.unit as string),
        expireDate: toISODateOrToday(ing.date),
        imageUrl: ing.imageUrl ?? null, // ✅ 그대로 보냄 (data:... 또는 http...)
      })),
    };

    console.log('📦 /ingredients POST payload:', payload);

    try {
      // 🔹 1) 재료 등록
      const res = await api.post('/ingredients', payload, {
        headers: { 'Content-Type': 'application/json' },
        maxBodyLength: Infinity,
      });
      console.log('✅ 서버 응답:', res.data);

      if (!res.data?.success) {
        console.warn('⚠️ 저장 실패:', res.data?.message);
        alert(res.data?.message ?? '저장에 실패했습니다.');
        return;
      }

      // 🔹 2) 저장 후 DB 목록 확인
      const getRes = await api.get('/ingredients');
      console.log('📦 현재 DB 재료 목록:', getRes.data);

      alert('✅ 재료가 성공적으로 저장되었습니다!');
      navigate('/userinfopage3');
    } catch (err) {
      console.error('❌ 재료 업로드 실패:', err);
      alert('업로드 중 오류가 발생했습니다.');
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
