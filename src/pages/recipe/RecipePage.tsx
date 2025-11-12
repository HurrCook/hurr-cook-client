import React, { useEffect, useState } from 'react';
import { getRecipeList, type Recipe } from '@/apis/recipeApi';
import RecipeCard from './components/RecipeCard';
import RecipeEditModal from './components/RecipeEditModal';
import SubtractModal from './components/SubtractModal';
import { motion } from 'framer-motion';

export default function RecipePage() {
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    // localStorage에서 복원
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

  // 최초 렌더 시 API 호출 (localStorage 비어 있을 때만)
  useEffect(() => {
    if (recipes.length > 0) return;

    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const data = await getRecipeList();
        setRecipes(data);
        localStorage.setItem('recipes', JSON.stringify(data));
      } catch (err) {
        console.error('❌ 레시피 불러오기 실패:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // localStorage 동기화
  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

  const handleCardClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setSkipRecipeEnterAnimation(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  const handleStartSubtract = (updatedRecipe: Recipe) => {
    setSelectedRecipe(updatedRecipe);
    setSkipRecipeEnterAnimation(false);
    setIsModalOpen(false);
    setSubtractModalOpen(true);
  };

  const handleBackToRecipe = () => {
    setSkipRecipeEnterAnimation(true);
    setSubtractModalOpen(false);
    setIsModalOpen(true);
  };

  const handleSaveRecipe = (updatedRecipe: Recipe) => {
    if (!updatedRecipe || !updatedRecipe.id) return;

    // 로컬에서 즉시 반영하고 localStorage 동기화됨
    setRecipes((prev) =>
      prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r)),
    );
    setSelectedRecipe(updatedRecipe);
    console.log('수정 반영 완료 (fetch 없이)');
  };

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

      {isModalOpen && selectedRecipe && (
        <RecipeEditModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onDelete={(id) => {
            setRecipes((prev) => prev.filter((r) => r.id !== id));
          }}
          recipe={selectedRecipe}
          onStartCooking={handleStartSubtract}
          onSave={handleSaveRecipe}
          skipEnterAnimation={skipRecipeEnterAnimation}
        />
      )}

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
