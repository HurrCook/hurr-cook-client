// src/components/common/IngredientEditList.tsx

import React from 'react';
import IngredientEditItem from './IngredientEditItem';

// UserInfoPage2에서 사용할 데이터 타입을 정의합니다. (Props와 일치해야 함)
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
  // 💡 새로운 Prop: 상위 컴포넌트의 업데이트 함수
  onUpdate: (
    id: number | string,
    field: keyof IngredientEditData,
    value: string,
  ) => void;
}

const IngredientEditList: React.FC<IngredientEditListProps> = ({
  ingredients,
  onUpdate,
}) => {
  return (
    <div className="w-full inline-flex flex-col justify-start items-start gap-2.5">
      {ingredients.map((ingredient) => (
        <IngredientEditItem
          key={ingredient.id}
          // 💡 모든 데이터를 전달합니다.
          {...ingredient}
          // 💡 onUpdate 핸들러를 하위 컴포넌트로 전달합니다.
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

export default IngredientEditList;
