// src/components/common/IngredientList.tsx

import React from 'react';
import IngredientItem from '@/components/common/IngredientItem';

// 💡 재료 데이터의 타입을 수정합니다. (UserInfoPage1_2와 동일하게 정의)
export type Ingredient = {
  id: number | string;
  name: string;
  image: string;
  date: string;
  quantity: number; // 💡 quantity를 number 타입으로 변경
  unit: 'EA' | 'g' | 'ml'; // 💡 unit 필드 추가 (단위 명시)
};

interface IngredientListProps {
  ingredients: Ingredient[];
  onCardClick: (id: number | string) => void;
  // 💡 새로운 Prop: quantity와 unit을 받아 포맷팅된 문자열을 반환하는 함수
  formatQuantity: (quantity: number, unit: 'EA' | 'g' | 'ml') => string;
}

const IngredientList: React.FC<IngredientListProps> = ({
  ingredients,
  onCardClick,
  formatQuantity, // 💡 Prop으로 받습니다.
}) => {
  return (
    <div className="flex flex-wrap w-full justify-between gap-y-4">
      {ingredients.map((ingredient, index) => (
        <div
          key={`${ingredient.id}-${index}`}
          // 💡 w-[48.5%]를 적용하여 카드가 비율에 맞게 크기 조정되도록 합니다.
          className="w-[48.5%] cursor-pointer"
          onClick={() => onCardClick(ingredient.id)} // 💡 클릭 시 ID 전달
        >
          <IngredientItem
            name={ingredient.name}
            image={ingredient.image}
            date={ingredient.date}
            // 💡 quantity와 unit을 formatQuantity 함수로 처리하여 전달
            quantity={formatQuantity(ingredient.quantity, ingredient.unit)}
          />
        </div>
      ))}
    </div>
  );
};

export default IngredientList;
