import React from 'react';
import IngredientItem from '@/components/common/IngredientItem';

export type Ingredient = {
  id: number | string;
  name: string;
  image: string;
  date: string;
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
          onClick={() => onCardClick(ingredient.id)} // 🔥 클릭 시 ID 전달
        >
          <IngredientItem
            name={ingredient.name}
            image={ingredient.image}
            date={ingredient.date}
            quantity={formatQuantity(ingredient.quantity, ingredient.unit)}
          />
        </div>
      ))}
    </div>
  );
};

export default IngredientList;
