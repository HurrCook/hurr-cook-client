// src/pages/userinfo/UserInfoPage2.tsx
import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FooterButton from '/src/components/common/FooterButton';
import IngredientEditList, {
  IngredientEditData,
} from '@/components/common/IngredientEditList';
// ✅ 공용 axios 인스턴스(api) 사용
import api from '@/lib/axios';

// 숫자만 허용
const parseQuantityValue = (value: string, field: string): string => {
  if (field === 'quantity') return value.replace(/[^0-9]/g, '');
  return value;
};

// 오늘 날짜 YYYY-MM-DD
const getTodayDate = (): string => {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

type NavState = { ingredients?: IngredientEditData[] };

export default function UserInfoPage2() {
  const navigate = useNavigate();
  const location = useLocation();
  const incoming = (location.state as NavState | null)?.ingredients;

  // 초기 데이터 설정
  const initial: IngredientEditData[] = useMemo(() => {
    if (Array.isArray(incoming) && incoming.length > 0) {
      return incoming.map((it, idx) => ({
        id: it.id ?? `${Date.now()}_${idx}`,
        name: it.name ?? '재료',
        image: it.image ?? 'https://placehold.co/100x91',
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
    // 기본 더미 1개(원하시면 []로 바꾸세요)
    return [];
  }, [incoming]);

  const [ingredients, setIngredients] = useState<IngredientEditData[]>(initial);

  // 수정 핸들러
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

  // 단위 정규화
  const normalizeUnit = (u: string): 'EA' | 'G' | 'ML' => {
    const v = (u || '').toUpperCase();
    if (v === 'EA') return 'EA';
    if (v === 'G' || v === 'GRAM') return 'G';
    if (v === 'ML' || v === 'MILLILITER') return 'ML';
    return 'EA';
  };

  // 날짜 ISO (빈 값이면 오늘)
  const toISODateOrToday = (raw?: string) => {
    if (!raw) return new Date().toISOString();
    const d = new Date(raw);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  };

  // 저장
  const handleNextClick = async () => {
    const payload = {
      ingredients: ingredients.map((ing) => ({
        name: ing.name,
        amount: Number(ing.quantity ?? 0),
        unit: normalizeUnit(ing.unit as string),
        expireDate: toISODateOrToday(ing.date),
      })),
    };

    console.log('📦 요청 보낼 payload:', payload);

    try {
      // ✅ 공용 api 사용 (Authorization/withCredentials 포함)
      const postRes = await api.post('/ingredients', payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('✅ 서버 응답:', postRes.data);

      if (!postRes.data?.success) {
        console.warn('⚠️ 저장 실패:', postRes.data?.message);
        alert(postRes.data?.message ?? '저장에 실패했습니다.');
        return;
      }

      // 확인용 조회(선택)
      const getRes = await api.get('/ingredients');
      console.log('📦 현재 DB 재료 목록:', getRes.data?.data);

      alert('✅ 재료가 성공적으로 저장되었습니다!');
      navigate('/userinfopage3');
    } catch (err) {
      console.error('❌ 재료 업로드 실패:', err);
      alert('업로드 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="w-full h-full relative flex flex-col">
      {/* 스크롤 영역 */}
      <div
        className="flex-grow overflow-y-auto w-full flex justify-center"
        style={{ paddingBottom: '16vh' }}
      >
        <div className="w-full flex justify-center mt-[0.5px]">
          <div className="w-[86.98%]">
            <IngredientEditList
              ingredients={ingredients}
              onUpdate={handleUpdateIngredient}
            />
          </div>
        </div>
      </div>

      {/* 푸터 */}
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
