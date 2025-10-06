import React, { useState } from 'react';
import RecipeCard from './components/RecipeCard';
import RecipeEditModal from './components/RecipeEditModal';
import SubtractModal from './components/SubtractModal';

// --- 공통 인터페이스 정의 ---
interface Ingredient {
  name: string;
  quantity: string;
}

interface Recipe {
  id: number;
  name: string;
  image: string;
  ingredients: Ingredient[];
  instructions: string[];
}

const RecipePage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: 1,
      name: '피망 볶음밥',
      image: 'https://placehold.co/152x152',
      ingredients: [
        { name: '피망', quantity: '3개' },
        { name: '양파', quantity: '1개' },
        { name: '간장', quantity: '1숟가락' }, // 👈 간장 추가
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
  const [subtractModalOpen, setSubtractModalOpen] = useState(false);

  // --- 모달 상태 관리 함수 ---

  // 1. 레시피 카드 클릭 (RecipeEditModal 열기)
  const handleCardClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  // 2. RecipeEditModal 닫기 (전체 플로우 종료)
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  // 3. 모달 플로우 전체 종료 (SubtractModal 완료/취소 시 호출)
  const handleEndFlow = () => {
    setSubtractModalOpen(false);
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  // 4. RecipeEditModal에서 '재료차감' 클릭
  const handleStartSubtract = () => {
    setIsModalOpen(false);
    setSubtractModalOpen(true);
  };

  // 5. SubtractModal에서 '이전' 클릭
  const handleBackToRecipe = () => {
    setSubtractModalOpen(false); // SubtractModal 닫기
    setIsModalOpen(true); // CookingModal 열기
  };

  // 6. SubtractModal에서 '완료' 클릭 (재료 차감 로직)
  const handleConfirmSubtract = (recipeId: number) => {
    console.log(`✅ ID ${recipeId} 레시피의 재료 차감 API 호출 (임시 로직)`);
    // 이 로직이 수행된 후 SubtractModal 내부에서 onClose (여기서는 handleEndFlow)가 호출되어 플로우가 종료됩니다.
  };

  // 7. 레시피 수정 후 저장
  const handleRecipeSave = (updatedRecipe: Recipe) => {
    console.log('✅ 레시피 업데이트 API 호출:', updatedRecipe.name);
    setRecipes(
      recipes.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r)),
    );
  };

  // 10. 레시피 삭제
  const handleDelete = (id: number) => {
    console.log('❌ 레시피 삭제 API 호출:', id);
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };
  return (
    <div className="w-full min-h-dvh flex flex-col items-center">
      <main className="w-full flex-1 py-4 pt-0 flex justify-center">
        <div className="flex flex-wrap w-[365px] h-52 justify-between gap-y-4">
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
        <RecipeEditModal
          isOpen={isModalOpen}
          onDelete={() => handleDelete(selectedRecipe.id)}
          onClose={handleCloseModal}
          recipe={selectedRecipe}
          onStartCooking={handleStartSubtract}
          onSave={handleRecipeSave}
        />
      )}

      {subtractModalOpen && selectedRecipe && (
        <SubtractModal
          isOpen={subtractModalOpen}
          onClose={handleEndFlow}
          onBack={handleBackToRecipe} // ✅ 이전으로 돌아가는 함수 연결
          recipe={selectedRecipe}
          onConfirmSubtract={handleConfirmSubtract} // 차감 로직
        />
      )}
    </div>
  );
};

export default RecipePage;
