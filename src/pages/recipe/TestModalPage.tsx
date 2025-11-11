import React, { useState } from 'react';
import RecipeEditModal from '@/pages/recipe/components/RecipeEditModal';
import SubtractModal from '@/pages/recipe/components/SubtractModal';

const dummyRecipe = {
  id: 1,
  name: '피망 볶음밥',
  image: 'https://placehold.co/245x163',
  ingredients: [
    { name: '피망', quantity: '2개' },
    { name: '양파', quantity: '1개' },
  ],
  instructions: ['재료 손질', '볶기', '간 맞추기'],
};

export default function TestModalPage() {
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(true);
  const [isSubtractModalOpen, setIsSubtractModalOpen] = useState(false);

  // 뒤로 돌아올 때 애니메이션 끌지 여부
  const [skipRecipeEnterAnimation, setSkipRecipeEnterAnimation] =
    useState(false);

  const handleStartCooking = () => {
    // 처음 Subtract로 갈 때는 애니메이션 정상 작동
    setSkipRecipeEnterAnimation(false);
    setIsRecipeModalOpen(false);
    setIsSubtractModalOpen(true);
  };

  const handleCloseSubtractModal = () => {
    setIsSubtractModalOpen(false);
  };

  const handleBackToRecipe = () => {
    // 🔥 뒤로 돌아올 땐 애니메이션 없이 바로 보이게
    setSkipRecipeEnterAnimation(true);
    setIsSubtractModalOpen(false);
    setIsRecipeModalOpen(true);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {isRecipeModalOpen && (
        <RecipeEditModal
          isOpen={isRecipeModalOpen}
          onClose={() => setIsRecipeModalOpen(false)}
          onDelete={(id) => console.log('삭제', id)}
          onStartCooking={handleStartCooking}
          onSave={(updated) => console.log('저장됨', updated)}
          recipe={dummyRecipe}
          skipEnterAnimation={skipRecipeEnterAnimation}
        />
      )}

      {isSubtractModalOpen && (
        <SubtractModal
          isOpen={isSubtractModalOpen}
          onClose={handleCloseSubtractModal}
          onBack={handleBackToRecipe}
          onConfirmSubtract={(id) => console.log('재료 차감 완료', id)}
          recipe={dummyRecipe}
        />
      )}
    </div>
  );
}
