import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRecipeList } from '@/apis/recipeApi';
import RecipeCard from './components/RecipeCard';
import RecipeEditModal from './components/RecipeEditModal';
import SubtractModal from './components/SubtractModal';
import { motion } from 'framer-motion';

//스켈레톤
const SkeletonCard = () => (
  <div className="w-44 h-52 bg-gray-200 rounded-xl animate-pulse" />
);

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

export default function RecipePage() {
  const {
    data: recipes = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['recipes'],
    queryFn: getRecipeList,
    staleTime: 1000 * 60 * 5, // 5분 캐싱
  });

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subtractModalOpen, setSubtractModalOpen] = useState(false);
  const [skipRecipeEnterAnimation, setSkipRecipeEnterAnimation] =
    useState(false);

  // 카드 클릭 시: 레시피 모달 열림 (애니메이션 포함)
  const handleCardClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setSkipRecipeEnterAnimation(false); // 처음엔 항상 애니메이션 켜기
    setIsModalOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  // 재료 차감 시작 (SubtractModal로 이동)
  const handleStartSubtract = () => {
    setSkipRecipeEnterAnimation(false); // 나갈 땐 그대로
    setIsModalOpen(false);
    setSubtractModalOpen(true);
  };

  // SubtractModal → 이전 (RecipeEditModal로 돌아가기)
  const handleBackToRecipe = () => {
    setSkipRecipeEnterAnimation(true); // 🔥 다시 돌아올 때는 애니메이션 OFF
    setSubtractModalOpen(false);
    setIsModalOpen(true);
  };

  // SubtractModal 닫기 (전체 흐름 종료)
  const handleEndFlow = () => {
    setSubtractModalOpen(false);
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  // 스켈레톤 표시
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center px-6 py-8">
        <div className="w-full max-w-[700px] grid grid-cols-2 md:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <p className="mt-6 text-gray-400 text-sm animate-pulse">
          불러오는 중입니다
        </p>
      </div>
    );
  }

  // 에러일 때
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-red-400">
        레시피를 불러오는 중 오류가 발생했습니다
      </div>
    );
  }

  // 데이터 없음
  if (!recipes || recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-gray-400">
        저장된 레시피가 없습니다 🍳
      </div>
    );
  }

  // 정상 렌더링
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center px-6 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="w-full max-w-[700px]">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {recipes.map((recipe, index) => (
            <motion.div
              key={recipe.id ?? `recipe-${index}`}
              className="cursor-pointer"
              onClick={() => handleCardClick(recipe)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.05 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <RecipeCard name={recipe.name} image={recipe.image} />
            </motion.div>
          ))}
        </div>
      </div>

      {isModalOpen && selectedRecipe && (
        <RecipeEditModal
          isOpen={isModalOpen}
          onDelete={() => console.log('삭제', selectedRecipe.id)}
          onClose={handleCloseModal}
          recipe={selectedRecipe}
          onStartCooking={handleStartSubtract}
          onSave={() => console.log('저장')}
          skipEnterAnimation={skipRecipeEnterAnimation}
        />
      )}

      {subtractModalOpen && selectedRecipe && (
        <SubtractModal
          isOpen={subtractModalOpen}
          onClose={handleEndFlow}
          onBack={handleBackToRecipe}
          recipe={selectedRecipe}
          onConfirmSubtract={() => console.log('재료 차감')}
        />
      )}
    </motion.div>
  );
}
