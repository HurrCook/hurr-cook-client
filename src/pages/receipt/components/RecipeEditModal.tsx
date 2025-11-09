import React, { useState, useEffect } from 'react';
import Button from '@/components/common/Button';
import IngredientItem from '@/pages/receipt/components/IngredientItem';
import Pen from '@/assets/연필.svg';
import Trash from '@/assets/쓰레기통.svg';
import { motion, AnimatePresence } from 'framer-motion';

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
}

const RecipeEditModal: React.FC<RecipeEditModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  onStartCooking: onStartSubtract,
  onSave,
  recipe,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isClosing, setIsClosing] = useState(false); // ✅ 닫힘 애니메이션용
  const [editedName, setEditedName] = useState(recipe.name);
  const [editedInstructions, setEditedInstructions] = useState(
    recipe.instructions.join('\n'),
  );
  const [editedIngredients, setEditedIngredients] = useState<Ingredient[]>(
    recipe.ingredients,
  );
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // recipe가 변경되면 내부 상태 업데이트
  useEffect(() => {
    setEditedName(recipe.name);
    setEditedInstructions(recipe.instructions.join('\n'));
    setEditedIngredients(recipe.ingredients);
  }, [recipe]);

  // ✅ 닫힘 애니메이션 (취소/삭제 전용)
  const handleAnimatedClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 250); // 0.25초 후 실제 닫기
  };

  // ✅ 재료차감은 바로 다음 모달로
  const handleStartSubtract = () => {
    onStartSubtract(recipe.id);
  };

  const handleSave = () => {
    const updatedRecipeData = {
      id: recipe.id,
      name: editedName,
      image: recipe.image,
      instructions: editedInstructions.split('\n'),
      ingredients: editedIngredients,
    };
    onSave(updatedRecipeData);
    setIsEditing(false);
  };

  const handleDeleteConfirm = () => {
    onDelete(recipe.id);
    setIsDeleteConfirmOpen(false);
    handleAnimatedClose(); // 닫힘 애니메이션 실행
  };

  const handleIngredientChange = (
    index: number,
    field: 'name' | 'quantity',
    value: string,
  ) => {
    const newIngredients = [...editedIngredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setEditedIngredients(newIngredients);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="recipe-modal"
            className="fixed inset-0 bg-black/50 flex justify-center z-50 px-5 py-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: isClosing ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="w-full bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
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
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full h-10 px-2.5 py-1.5 bg-white rounded-xl outline-1 outline-stone-300 text-neutral-800 text-base font-normal"
                    />
                  ) : (
                    <div className="w-full h-10 px-2.5 py-1.5 bg-white rounded-xl outline-1 outline-stone-300 flex items-center">
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
                  <div className="w-full min-h-[128px] p-2 bg-white rounded-lg outline-1 outline-stone-300 flex flex-col gap-2">
                    {editedIngredients.map((item, index) => (
                      <IngredientItem
                        key={index}
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
                    ))}
                  </div>
                </div>

                {/* 만드는 순서 */}
                <div className="w-full flex flex-col gap-2.5">
                  <label className="text-neutral-400 text-xs font-normal">
                    만드는 순서
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editedInstructions}
                      onChange={(e) => setEditedInstructions(e.target.value)}
                      className="w-full min-h-[288px] p-2 bg-white rounded-xl outline-1 outline-stone-300 text-zinc-600 text-sm font-normal resize-none"
                    />
                  ) : (
                    <div className="w-full min-h-[288px] p-2 bg-white rounded-xl outline-1 outline-stone-300 overflow-hidden">
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
