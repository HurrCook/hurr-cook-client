import React, { useState } from 'react';
import RecipeCard from './components/RecipeCard';
import RecipeEditModal from './components/RecipeEditModal';
import SubtractModal from './components/SubtractModal';

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
  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: 1,
      name: '피망 볶음밥',
      image: 'https://placehold.co/245x163',
      ingredients: [
        { name: '피망', quantity: '3개' },
        { name: '양파', quantity: '1개' },
        { name: '간장', quantity: '1숟가락' },
      ],
      instructions: ['재료 손질', '볶기', '양념하기'],
    },
    {
      id: 2,
      name: '미트볼 스파게티',
      image: 'https://placehold.co/245x163',
      ingredients: [
        { name: '스파게티면', quantity: '200g' },
        { name: '미트볼', quantity: '5개' },
      ],
      instructions: ['면 삶기', '소스 만들기', '섞기'],
    },
    {
      id: 3,
      name: '치킨 카레',
      image: 'https://placehold.co/245x163',
      ingredients: [{ name: '닭고기', quantity: '500g' }],
      instructions: ['볶기', '졸이기'],
    },
  ]);

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
    console.log(`✅ ID ${recipeId} 레시피의 재료 차감`);
  };

  const handleRecipeSave = (updatedRecipe: Recipe) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r)),
    );
    setSelectedRecipe(updatedRecipe);
  };

  const handleDelete = (id: number) => {
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-6 relative">
      <div className="w-full max-w-[700px]">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="cursor-pointer"
              onClick={() => handleCardClick(recipe)}
            >
              <RecipeCard name={recipe.name} image={recipe.image} />
            </div>
          ))}
        </div>
      </div>

      {/* Recipe Edit Modal */}
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

      {/* 재료 차감 모달 */}
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
}
