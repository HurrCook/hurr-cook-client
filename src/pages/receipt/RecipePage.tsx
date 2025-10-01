import React, { useState } from 'react';
import RecipeCard from '@/pages/receipt/components/RecipeCard';
import RecipeModal from './components/RecipeModal';

// 레시피 데이터의 타입을 정의합니다. (date와 quantity 필드 포함)
type Recipe = {
  id: number;
  name: string;
  image: string;
  ingredients: { name: string; quantity: string }[];
  instructions: string[];
};

const RecipePage: React.FC = () => {
  // 상태 초기값을 RecipePage 컴포넌트 내부에서 정의합니다.
  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: 1,
      name: '피망 볶음밥',
      image: 'https://placehold.co/152x152',
      ingredients: [
        { name: '피망', quantity: '3개' },
        { name: '양파', quantity: '1개' },
      ],
      instructions: [
        '재료 손질하기\n 피망, 양파, 대파를 잘게 썬다. 계란은 미리 풀어둔다.',
        '계란 볶기 (선택)\n 팬에 기름을 두르고 계란을 스크램블처럼 살짝 익혀서 꺼내둔다.',
        '야채 볶기\n 팬에 기름을 두르고 대파 → 양파 → 피망 순서로 볶는다.\n (기호에 따라 마늘을 추가해도 좋아요)',
        '밥 넣기\n 밥을 넣고 잘 풀어가며 볶는다. 뭉치지 않게 해줘야 맛있음!',
        '양념하기\n 간장, 굴소스, 소금, 후추를 넣고 볶는다.',
        '계란 넣고 마무리\n 아까 볶아놓은 계란을 다시 넣고 가볍게 섞어주면 완성!',
      ],
    },
    {
      id: 2,
      name: '미트볼 스파게티',
      image: 'https://placehold.co/152x152',
      ingredients: [
        { name: '스파게티면', quantity: '200g' },
        { name: '미트볼', quantity: '5개' },
      ],
      instructions: ['면 삶기', '소스 만들기', '미트볼 익히기', '모두 섞기'],
    },
    {
      id: 3,
      name: '치킨',
      image: 'https://placehold.co/152x152',
      ingredients: [],
      instructions: [],
    },
    {
      id: 4,
      name: '카레',
      image: 'https://placehold.co/152x152',
      ingredients: [],
      instructions: [],
    },
    {
      id: 5,
      name: '닭볶음탕',
      image: 'https://placehold.co/152x152',
      ingredients: [],
      instructions: [],
    },
    {
      id: 6,
      name: '미트볼',
      image: 'https://placehold.co/152x152',
      ingredients: [],
      instructions: [],
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const handleCardClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  const handleDelete = (id: number) => {
    // 레시피 목록에서 해당 ID의 항목을 필터링하여 제거합니다.
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  return (
    <div className="w-full min-h-dvh flex flex-col items-center">
      <main className="w-full flex-1 py-4 pt-0 flex justify-center">
        <div className="flex flex-wrap w-[365px] h-52 justify-between gap-y-4">
          {/* recipes 배열을 사용합니다. */}
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => handleCardClick(recipe)}
              className="cursor-pointer"
            >
              <RecipeCard name={recipe.name} image={recipe.image} />
            </div>
          ))}
        </div>
      </main>

      {isModalOpen && selectedRecipe && (
        <RecipeModal
          isOpen={isModalOpen}
          onDelete={() => handleDelete(selectedRecipe.id)}
          onClose={handleCloseModal}
          recipe={selectedRecipe}
        />
      )}
    </div>
  );
};

export default RecipePage;
