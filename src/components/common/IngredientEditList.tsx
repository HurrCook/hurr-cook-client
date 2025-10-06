// src/components/IngredientEditList.tsx

import React from 'react';
// 💡 IngredientEditItem을 임포트합니다. 경로를 맞게 수정해주세요.
import IngredientEditItem from './IngredientEditItem';

// UserInfoPage2에서 사용할 데이터 타입을 정의합니다.
export type IngredientEditData = {
  id: number | string;
  name: string;
  image: string;
  date: string;
  quantity: string;
  unit: string;
};

interface IngredientEditListProps {
  ingredients: IngredientEditData[];
}

const IngredientEditList: React.FC<IngredientEditListProps> = ({
  ingredients,
}) => {
  return (
    // 💡 gap-2.5는 항목 간의 세로 간격을 제공합니다.
    <div className="w-full inline-flex flex-col justify-start items-start gap-2.5">
      {ingredients.map((ingredient) => (
        <IngredientEditItem
          key={ingredient.id}
          name={ingredient.name}
          image={ingredient.image}
          date={ingredient.date}
          quantity={ingredient.quantity}
          unit={ingredient.unit}
        />
      ))}
    </div>
  );
};

export default IngredientEditList;
