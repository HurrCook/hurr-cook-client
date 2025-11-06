import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import RecipeCard from './components/RecipeCard';
import RecipeEditModal from './components/RecipeEditModal';
import SubtractModal from './components/SubtractModal';
import { getRecipeList, updateRecipe, deleteRecipe } from '@/apis/recipeApi';

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
  const queryClient = useQueryClient();

  const {
    data: recipes = [],
    isLoading,
    isError,
  } = useQuery<Recipe[]>({
    queryKey: ['recipes'],
    queryFn: getRecipeList,
  });
  console.log('불러온 레시피 데이터:', recipes);

  const updateRecipeMutation = useMutation({
    mutationFn: (updatedRecipe: Recipe) =>
      updateRecipe(updatedRecipe.id, updatedRecipe),
    onSuccess: () => {
      // 수정 후 목록 자동 갱신
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });

  const deleteRecipeMutation = useMutation({
    mutationFn: (id: number) => deleteRecipe(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] });
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [subtractModalOpen, setSubtractModalOpen] = useState(false);

  const handleCardClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  const handleEndFlow = () => {
    setSubtractModalOpen(false);
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  const handleStartSubtract = () => {
    setIsModalOpen(false);
    setSubtractModalOpen(true);
  };

  const handleBackToRecipe = () => {
    setSubtractModalOpen(false);
    setIsModalOpen(true);
  };

  const handleConfirmSubtract = (recipeId: number) => {
    console.log(`✅ ID ${recipeId} 레시피 재료 차감`);
  };

  const handleRecipeSave = (updatedRecipe: Recipe) => {
    updateRecipeMutation.mutate(updatedRecipe);
  };

  const handleDelete = (id: number) => {
    deleteRecipeMutation.mutate(id);
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  // --- 로딩 및 에러 상태 처리 ---
  if (isLoading) return <div className="text-center mt-10">⏳ 로딩 중...</div>;
  if (isError)
    return (
      <div className="text-center mt-10 text-red-500">
        ❌ 레시피 목록 불러오기 실패
      </div>
    );

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

      {/* ✅ 수정 모달 */}
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

      {/* ✅ 재료 차감 모달 */}
      {subtractModalOpen && selectedRecipe && (
        <SubtractModal
          isOpen={subtractModalOpen}
          onClose={handleEndFlow}
          onBack={handleBackToRecipe}
          recipe={selectedRecipe}
          onConfirmSubtract={handleConfirmSubtract}
        />
      )}
    </div>
  );
};

export default RecipePage;
