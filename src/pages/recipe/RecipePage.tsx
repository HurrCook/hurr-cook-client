import React, { useEffect, useState } from 'react';
import { getRecipeList, type Recipe } from '@/apis/recipeApi';
import RecipeCard from './components/RecipeCard';
import RecipeEditModal from './components/RecipeEditModal';
import SubtractModal from './components/SubtractModal';
import { motion } from 'framer-motion';

export default function RecipePage() {
  // 최초 localStorage에서 복원
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('recipes');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subtractModalOpen, setSubtractModalOpen] = useState(false);
  const [loading, setLoading] = useState(recipes.length === 0);
  const [error, setError] = useState(false);
  const [skipRecipeEnterAnimation, setSkipRecipeEnterAnimation] =
    useState(false);

  // 페이지 진입 시: localStorage → 화면 먼저 로드 후, 서버 fetch는 백그라운드로 갱신
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await getRecipeList();
        // 서버 데이터가 비어 있지 않으면 localStorage 업데이트
        if (data && data.length > 0) {
          setRecipes(data);
          localStorage.setItem('recipes', JSON.stringify(data));
        }
      } catch (err) {
        console.error('❌ 레시피 불러오기 실패:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  //recipes 상태 바뀔 때마다 localStorage 동기화
  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

  // 카드 클릭 시 모달 열기
  const handleCardClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setSkipRecipeEnterAnimation(false);
    setIsModalOpen(true);
  };

  //모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  // 재료 차감 시작
  const handleStartSubtract = (updatedRecipe: Recipe) => {
    setSelectedRecipe(updatedRecipe);
    setSkipRecipeEnterAnimation(false);
    setIsModalOpen(false);
    setSubtractModalOpen(true);
  };

  // 뒤로 가기
  const handleBackToRecipe = () => {
    setSkipRecipeEnterAnimation(true);
    setSubtractModalOpen(false);
    setIsModalOpen(true);
  };

  // 저장 (신규 + 수정 모두)
  const handleSaveRecipe = (updatedRecipe: Recipe) => {
    if (!updatedRecipe || !updatedRecipe.id) return;

    setRecipes((prev) => {
      const exists = prev.some((r) => r.id === updatedRecipe.id);
      const updatedList = exists
        ? prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r))
        : [...prev, updatedRecipe]; // 새 레시피 추가
      localStorage.setItem('recipes', JSON.stringify(updatedList));
      return updatedList;
    });

    setSelectedRecipe(updatedRecipe);
    console.log('✅ 레시피 저장됨 (localStorage 즉시 반영)');
  };

  // 삭제
  const handleDeleteRecipe = (id: string) => {
    setRecipes((prev) => {
      const updatedList = prev.filter((r) => r.id !== id);
      localStorage.setItem('recipes', JSON.stringify(updatedList));
      return updatedList;
    });
  };

  // 종료
  const handleEndFlow = () => {
    setSubtractModalOpen(false);
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        불러오는 중입니다...
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-400">
        레시피를 불러오는 중 오류가 발생했습니다.
      </div>
    );

  if (recipes.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-400">
        저장된 레시피가 없습니다.
      </div>
    );

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center px-6 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* 목록 */}
      <div className="w-full max-w-[700px] grid grid-cols-2 md:grid-cols-3 gap-5">
        {recipes.map((recipe, index) => (
          <motion.div
            key={recipe.id}
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

      {/* 수정 모달 */}
      {isModalOpen && selectedRecipe && (
        <RecipeEditModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onDelete={handleDeleteRecipe}
          recipe={selectedRecipe}
          onStartCooking={handleStartSubtract}
          onSave={handleSaveRecipe}
          skipEnterAnimation={skipRecipeEnterAnimation}
        />
      )}

      {/* 차감 모달 */}
      {subtractModalOpen && selectedRecipe && (
        <SubtractModal
          isOpen={subtractModalOpen}
          onClose={handleEndFlow}
          onBack={handleBackToRecipe}
          recipe={selectedRecipe}
        />
      )}
    </motion.div>
  );
}
