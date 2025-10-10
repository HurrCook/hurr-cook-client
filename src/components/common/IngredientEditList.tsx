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
  onOpenCamera: () => void; // ✅ 추가
  onSelectPhoto: (file: File) => void; // ✅ 추가
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
          onOpenCamera={onOpenCamera}
          onSelectPhoto={onSelectPhoto}
        />
      ))}
    </div>
  );
};

export default IngredientEditList;
