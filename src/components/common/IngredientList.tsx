import React, { useState } from 'react';
import IngredientCard from '@/components/common/IngredientCard';

// 레시피 데이터의 타입을 정의합니다. (date와 quantity 필드 포함)
type Ingredients = {
  id: number;
  name: string;
  image: string;
  date: string;
  quantity: string;
};

const RecipePage: React.FC = () => {
  const [ingredients] = useState<Ingredients[]>([
    {
      id: 1,
      name: '당근',
      image: 'https://placehold.co/152x152',
      date: '2025.07.30',
      quantity: '3개',
    },
    {
      id: 2,
      name: '피망',
      image: 'https://placehold.co/152x152',
      date: '2025.07.30',
      quantity: '1개',
    },
    {
      id: 3,
      name: '뿡',
      image: 'https://placehold.co/152x152',
      date: '2025.07.30',
      quantity: '4개',
    },
  ]);

  return (
    <div className="w-full min-h-dvh flex flex-col items-center">
      <main className="w-full flex-1 py-4 pt-0 flex justify-center">
        <div className="flex flex-wrap w-[365px] h-52 justify-between gap-y-4">
          {/* recipes 배열을 사용합니다. */}
          {ingredients.map((ingredient) => (
            <div key={ingredient.id} className="cursor-pointer">
              <IngredientCard
                name={ingredient.name}
                image={ingredient.image}
                date={ingredient.date}
                quantity={ingredient.quantity}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default RecipePage;
