import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FooterButton from '/src/components/common/FooterButton';
import IngredientEditList, {
  IngredientEditData,
} from '@/components/common/IngredientEditList';

// 💡 Helper function: Ensures quantity is treated as a string for display/input
const parseQuantityValue = (value: string, field: string): string => {
  if (field === 'quantity') {
    // 숫자만 허용 (입력 필드에서 숫자가 아닌 문자를 막을 때 유용)
    return value.replace(/[^0-9]/g, '');
  }
  return value;
};

// 💡 Helper function: Formats date from YYYY-MM-DD (input default) to YYYY.MM.DD
const formatDateValue = (rawDate: string): string => {
  if (rawDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return rawDate.replace(/-/g, '.');
  }
  return rawDate;
};

export default function UserInfoPage2() {
  const navigate = useNavigate();

  // 💡 데이터 정의 (수정 가능하도록 setIngredients 사용)
  const [ingredients, setIngredients] = useState<IngredientEditData[]>([
    {
      id: 1,
      name: '피망',
      image: 'https://placehold.co/100x91',
      date: '2025.08.30',
      quantity: '3',
      unit: 'EA',
    },
    {
      id: 2,
      name: '피망',
      image: 'https://placehold.co/100x91',
      date: '2025.08.30',
      quantity: '3',
      unit: 'EA',
    },
    {
      id: 3,
      name: '피망',
      image: 'https://placehold.co/100x91',
      date: '2025.08.30',
      quantity: '3',
      unit: 'EA',
    },
    {
      id: 4,
      name: '피망',
      image: 'https://placehold.co/100x91',
      date: '2025.08.30',
      quantity: '3',
      unit: 'EA',
    },
    {
      id: 5,
      name: '감자',
      image: 'https://placehold.co/100x91',
      date: '2025.08.30',
      quantity: '5',
      unit: 'g',
    },
    {
      id: 6,
      name: '배추',
      image: 'https://placehold.co/100x91',
      date: '2025.08.30',
      quantity: '1',
      unit: 'EA',
    },
    {
      id: 7,
      name: '고기',
      image: 'https://placehold.co/100x91',
      date: '2025.08.30',
      quantity: '500',
      unit: 'g',
    },
  ]);

  // 💡 재료 데이터 업데이트 핸들러: IngredientEditItem에서 호출됩니다.
  const handleUpdateIngredient = (
    id: number | string,
    field: keyof IngredientEditData,
    value: string,
  ) => {
    setIngredients((prevIngredients) =>
      prevIngredients.map((ingredient) => {
        if (ingredient.id === id) {
          // 날짜 필드인 경우 포맷팅 적용
          const updatedValue =
            field === 'date'
              ? formatDateValue(value)
              : parseQuantityValue(value, field);

          return {
            ...ingredient,
            [field]: updatedValue,
          };
        }
        return ingredient;
      }),
    );
    console.log(`Updated ingredient ${id}: set ${field} to ${value}`);
  };

  // 💡 핸들러 함수들
  const handleNextClick = () => {
    // 💡 최종 데이터를 확인하고 다음 페이지로 이동
    console.log('Final Ingredients:', ingredients);
    navigate('/userinfopage3');
  };

  return (
    <div className="w-full h-full relative flex flex-col">
      {/* 🚀 메인 스크롤 영역: 재료 목록 배치 */}
      <div
        className="flex-grow overflow-y-auto w-full flex justify-center"
        style={{ paddingBottom: '15.99%' }}
      >
        {/* 💡 재료 목록 영역 */}
        <div className="w-full flex justify-center mt-[0.5px]">
          {' '}
          {/* 타이틀 아래 간격 조정 */}
          {/* 💡 너비 86.98% 컨테이너 (양옆 28px 간격 확보) */}
          <div className="w-[86.98%]">
            <IngredientEditList
              ingredients={ingredients}
              onUpdate={handleUpdateIngredient} // 💡 onUpdate 핸들러 전달
            />
          </div>
        </div>
      </div>

      {/* 푸터 영역 (fixed) */}
      <div className="w-full bg-gradient-to-b from-white/0 to-white backdrop-blur-[2px] flex flex-col items-center h-[15.99%] fixed bottom-0 inset-x-0">
        <div className="h-[26.17%] w-full"></div>
        <FooterButton
          className="w-[82.79%] h-[32.21%]"
          onClick={handleNextClick}
        >
          다음으로
        </FooterButton>
        <div className="flex-grow w-full"></div>
      </div>
    </div>
  );
}
