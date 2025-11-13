// src/components/common/IngredientEditList.tsx

import React from 'react';
import IngredientEditItem from './IngredientEditItem';

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
  onUpdate: (
    id: number | string,
    field: keyof IngredientEditData,
    value: string,
  ) => void;
  onOpenCamera: (id: number | string) => void;
  onSelectPhoto: (file: File) => void;
}

const IngredientEditList: React.FC<IngredientEditListProps> = ({
  ingredients,
  onUpdate,
  onOpenCamera,
  onSelectPhoto,
}) => {
  return (
    <div className="w-full inline-flex flex-col justify-start items-start gap-2.5">
      {ingredients.map((ingredient) => (
        <IngredientEditItem
          key={ingredient.id}
          {...ingredient}
          onUpdate={onUpdate}
          onOpenCamera={() => onOpenCamera(ingredient.id)}
          onSelectPhoto={onSelectPhoto}
        />
      ))}
    </div>
  );
};

export default IngredientEditList;
