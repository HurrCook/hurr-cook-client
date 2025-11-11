/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import Button from '@/components/common/Button';
import IngredientItem from '@/pages/recipe/components/IngredientItem';
import Pen from '@/assets/연필.svg';
import Trash from '@/assets/쓰레기통.svg';
import { motion, AnimatePresence } from 'framer-motion';
import { getRecipeDetail, updateRecipe, deleteRecipe } from '@/apis/recipeApi'; // ✅ API 연결 추가

interface Ingredient {
  name: string;
  quantity: string;
}

interface RecipeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (recipeId: number) => void;
  onStartCooking: (recipeId: number) => void;
  onSave: (updatedRecipe: {
    id: number;
    name: string;
    image: string;
    instructions: string[];
    ingredients: Ingredient[];
  }) => void;
  recipe: {
    id: number;
    name: string;
    image: string;
    ingredients: Ingredient[];
    instructions: string[];
  };
  skipEnterAnimation?: boolean;
}

const RecipeEditModal: React.FC<RecipeEditModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  onStartCooking: onStartSubtract,
  onSave,
  recipe,
  skipEnterAnimation = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // API에서 가져올 실제 데이터
  const [editedName, setEditedName] = useState(recipe.name);
  const [editedInstructions, setEditedInstructions] = useState(
    recipe.instructions.join('\n'),
  );
  const [editedIngredients, setEditedIngredients] = useState<Ingredient[]>(
    recipe.ingredients,
  );

  // 모달 열릴 때 상세 레시피 데이터 새로 불러오기
  useEffect(() => {
    if (isOpen && recipe.id) {
      (async () => {
        try {
          const data = await getRecipeDetail(recipe.id);
          setEditedName(data.name);
          setEditedInstructions(data.instructions.join('\n'));
          setEditedIngredients(data.ingredients);
        } catch (error) {
          console.error('❌ 레시피 상세 불러오기 실패:', error);
        }
      })();
    }
  }, [isOpen, recipe.id]);

  const handleAnimatedClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 250);
  };

  const handleStartSubtract = () => {
    onStartSubtract(recipe.id);
  };

  // 수정 저장 (API 연결)
  const handleSave = async () => {
    try {
      const updatedRecipeData = {
        id: recipe.id,
        name: editedName,
        image: recipe.image,
        instructions: editedInstructions.split('\n'),
        ingredients: editedIngredients,
      };

      const updated = await updateRecipe(recipe.id, updatedRecipeData);
      console.log('레시피 수정 완료:', updated);

      onSave(updated);
      setIsEditing(false);
    } catch (error) {
      console.error('❌ 레시피 수정 실패:', error);
    }
  };

  // 삭제 버튼 (API 연결)
  const handleDeleteConfirm = async () => {
    try {
      const success = await deleteRecipe(recipe.id);
      if (success) {
        console.log('레시피 삭제 완료');
        onDelete(recipe.id);
        setIsDeleteConfirmOpen(false);
        handleAnimatedClose();
      } else {
        console.error('레시피 삭제 실패: 서버 응답 실패');
      }
    } catch (error) {
      console.error('레시피 삭제 에러:', error);
    }
  };

  // 재료 변경 함수
  const handleIngredientChange = (
    index: number,
    field: 'name' | 'quantity',
    value: string,
  ) => {
    const newIngredients = [...editedIngredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setEditedIngredients(newIngredients);
  };

  const handleAddIngredient = () => {
    setEditedIngredients((prev) => [...prev, { name: '', quantity: '' }]);
  };

  const handleRemoveIngredient = (index: number) => {
    setEditedIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="recipe-modal"
            className="fixed inset-0 bg-black/50 flex justify-center z-50 px-5 py-40"
            initial={skipEnterAnimation ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: isClosing ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="w-full bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
              initial={
                skipEnterAnimation
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: 0, scale: 0.95, y: 30 }
              }
              animate={{
                opacity: isClosing ? 0 : 1,
                scale: isClosing ? 0.9 : 1,
                y: isClosing ? 20 : 0,
              }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 240, damping: 22 }}
            >
              {/* 헤더 */}
              <div className="p-5 flex justify-between items-center">
                <h2 className="text-neutral-800 text-xl font-normal">
                  레시피 확인
                </h2>
                <div className="flex gap-4 text-neutral-600">
                  {!isEditing && (
                    <img
                      src={Pen}
                      alt="수정아이콘"
                      className="cursor-pointer mt-1"
                      onClick={() => setIsEditing(true)}
                    />
                  )}
                  {!isEditing && (
                    <img
                      src={Trash}
                      alt="삭제아이콘"
                      className="cursor-pointer"
                      onClick={() => setIsDeleteConfirmOpen(true)}
                    />
                  )}
                </div>
              </div>

              {/* 내용 */}
              <div className="p-6 pt-0 flex flex-col overflow-y-auto gap-4 custom-scrollbar">
                {/* 이미지 */}
                <div className="flex flex-col items-start gap-2.5">
                  <div className="w-40 h-36 relative rounded-xl outline-1 outline-stone-300 overflow-hidden">
                    <img
                      src={recipe.image}
                      alt={editedName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-amber-500 text-sm font-normal">
                    만들 수 있어요!
                  </p>
                </div>

                {/* 요리명 */}
                <div className="w-full flex flex-col gap-2.5">
                  <label className="text-neutral-400 text-xs font-normal">
                    요리명
                  </label>
                  {isEditing ? (
                    <div
                      className="w-full h-12 px-4 rounded-lg bg-white outline outline-1 outline-offset-[-1px]
                                 flex items-center justify-between transition-colors outline-stone-300
                                 focus-within:outline-amber-500"
                    >
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="w-full text-neutral-800 text-base font-normal outline-none bg-transparent"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-12 px-4 rounded-lg bg-white outline outline-1 outline-stone-300 flex items-center">
                      <span className="text-neutral-800 text-base font-normal truncate">
                        {editedName}
                      </span>
                    </div>
                  )}
                </div>

                {/* 필요한 재료 */}
                <div className="w-full flex flex-col gap-2.5">
                  <label className="text-neutral-400 text-xs font-normal">
                    필요한 재료
                  </label>
                  <div
                    className="w-full min-h-[80px] p-3 bg-white rounded-lg outline outline-1 outline-stone-300
                               transition-colors outline-offset-[-1px] focus-within:outline-amber-500
                               flex flex-col gap-3"
                  >
                    {editedIngredients.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="flex-1">
                          <IngredientItem
                            name={item.name}
                            quantity={item.quantity}
                            isEditable={isEditing}
                            onNameChange={(value) =>
                              handleIngredientChange(index, 'name', value)
                            }
                            onQuantityChange={(value) =>
                              handleIngredientChange(index, 'quantity', value)
                            }
                          />
                        </div>
                        {isEditing && (
                          <button
                            onClick={() => handleRemoveIngredient(index)}
                            className="p-2 hover:bg-gray-100 rounded-full transition"
                          >
                            <img
                              src="/src/assets/delete.svg"
                              alt="삭제"
                              className="w-5 h-5 opacity-70 hover:opacity-100"
                            />
                          </button>
                        )}
                      </div>
                    ))}

                    {isEditing && (
                      <button
                        onClick={handleAddIngredient}
                        className="w-full py-2 mt-2 rounded-xl border border-dashed border-amber-400
                                   text-amber-500 text-sm font-medium hover:bg-amber-50 transition"
                      >
                        + 재료 추가
                      </button>
                    )}
                  </div>
                </div>

                {/* 만드는 순서 */}
                <div className="w-full flex flex-col gap-2.5">
                  <label className="text-neutral-400 text-xs font-normal">
                    만드는 순서
                  </label>
                  {isEditing ? (
                    <div
                      className="w-full min-h-[288px] p-2 bg-white rounded-xl outline outline-1 outline-stone-300
                                 transition-colors outline-offset-[-1px] focus-within:outline-amber-500"
                    >
                      <textarea
                        value={editedInstructions}
                        onChange={(e) => setEditedInstructions(e.target.value)}
                        className="w-full min-h-[260px] text-zinc-600 text-sm font-normal resize-none outline-none bg-transparent"
                      />
                    </div>
                  ) : (
                    <div className="w-full min-h-[288px] p-2 bg-white rounded-xl outline outline-1 outline-stone-300 overflow-hidden">
                      <div className="text-zinc-600 text-sm font-normal leading-loose whitespace-pre-wrap">
                        {editedInstructions}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 하단 버튼 */}
              <div className="p-4 flex justify-between gap-3">
                {isEditing ? (
                  <>
                    <Button color="cancel" onClick={() => setIsEditing(false)}>
                      취소
                    </Button>
                    <Button color="default" onClick={handleSave}>
                      완료
                    </Button>
                  </>
                ) : (
                  <>
                    <Button color="cancel" onClick={handleAnimatedClose}>
                      취소
                    </Button>
                    <Button color="default" onClick={handleStartSubtract}>
                      재료차감
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 삭제 확인 모달 */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-[9.6px] inline-flex p-6 w-72 flex-col items-center gap-7">
            <p className="text-neutral-700 text-sm font-medium">
              레시피를 삭제하시겠습니까?
            </p>
            <div className="flex gap-4 w-full justify-center">
              <Button
                color="cancel"
                onClick={() => setIsDeleteConfirmOpen(false)}
              >
                취소
              </Button>
              <Button color="default" onClick={handleDeleteConfirm}>
                삭제
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecipeEditModal;
