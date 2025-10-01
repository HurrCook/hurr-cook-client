import React from 'react';
import RecipeCard from '@/pages/receipt/components/RecipeCard';

const RECIPES = [
  { id: 1, name: '피망 볶음밥', image: 'https://placehold.co/176x160' },
  { id: 2, name: '미트볼 스파게티', image: 'https://placehold.co/176x160' },
  { id: 3, name: '치킨', image: 'https://placehold.co/176x160' },
  { id: 4, name: '카레', image: 'https://placehold.co/176x160' },
  { id: 5, name: '닭볶음탕', image: 'https://placehold.co/176x160' },
  { id: 6, name: '미트볼', image: 'https://placehold.co/176x160' },
];

const RecipePage: React.FC = () => {
  return (
    <div className="w-full min-h-dvh flex flex-col items-center ">
      <main className="w-full flex-1 py-4 px-7 pt-0">
        <div className="flex flex-wrap justify-center gap-x-2 gap-y-3.5">
          {RECIPES.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              name={recipe.name}
              image={recipe.image}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default RecipePage;
