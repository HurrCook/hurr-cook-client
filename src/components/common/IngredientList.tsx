// src/components/common/IngredientList.tsx

import React from 'react';
import IngredientCard from '@/components/common/IngredientCard';

// 재료 데이터의 타입을 정의합니다. (UserInfoPage1_2와 동일하게 정의)
export type Ingredient = {
  id: number | string;
  name: string;
  image: string;
  date: string;
  quantity: string;
};

interface IngredientListProps {
  ingredients: Ingredient[];
  onCardClick: (id: number | string) => void; // 💡 새로운 Prop 추가
}

const IngredientList: React.FC<IngredientListProps> = ({
  ingredients,
  onCardClick,
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
          <IngredientCard
            name={ingredient.name}
            image={ingredient.image}
            date={ingredient.date}
            quantity={ingredient.quantity}
          />
        </div>
      ))}
    </div>
  );
};

export default IngredientList;
