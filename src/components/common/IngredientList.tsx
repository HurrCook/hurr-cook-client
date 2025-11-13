import React from 'react';
import IngredientItem from '@/components/common/IngredientItem';

export type Ingredient = {
  id: number | string;
  name: string;
  image: string;
  quantity: number;
  unit: 'EA' | 'g' | 'ml';
};

interface IngredientListProps {
  ingredients: Ingredient[];
  onCardClick: (id: number | string) => void;
  formatQuantity: (quantity: number, unit: 'EA' | 'g' | 'ml') => string;
}

const IngredientList: React.FC<IngredientListProps> = ({
  ingredients,
  onCardClick,
  formatQuantity,
}) => {
  return (
    <div className="flex w-full flex-wrap justify-between gap-y-4">
      {ingredients.map((ingredient, index) => (
        <div
          key={`${ingredient.id}-${index}`}
          className="w-[48.5%] cursor-pointer"
          onClick={() => onCardClick(ingredient.id)}
        >
          <IngredientItem
            name={ingredient.name}
            image={ingredient.image}
            quantity={formatQuantity(ingredient.quantity, ingredient.unit)} // ✅ 수량 표시 유지
          />
        </div>
      ))}
    </div>
  );
};

export default IngredientList;
