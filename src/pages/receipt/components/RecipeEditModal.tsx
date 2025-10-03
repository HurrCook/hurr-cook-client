import React, { useState, useEffect } from 'react';
import Button from '@/components/common/Button';
import IngredientItem from '@/pages/receipt/components/IngredientItem';
import Pen from '@/assets/연필.svg';
import Trash from '@/assets/쓰레기통.svg';

interface Ingredient {
  name: string;
  quantity: string;
}

interface RecipeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  onStartCooking: (recipeId: number) => void;
  onSave: (updatedRecipe: {
    id: number;
    name: string;
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
  const [editedName, setEditedName] = useState(recipe.name);
  const [editedInstructions, setEditedInstructions] = useState(
    recipe.instructions.join('\n'),
  );
  const [editedIngredients, setEditedIngredients] = useState<Ingredient[]>(
    recipe.ingredients,
  );
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Prop 동기화: recipe prop이 변경될 때마다 모달 내부 상태를 업데이트합니다.
  useEffect(() => {
    // 편집 중이 아닐 때만 업데이트하여 사용자의 입력 내용을 덮어쓰지 않도록 함
    if (!isEditing) {
      setEditedName(recipe.name);
      setEditedInstructions(recipe.instructions.join('\n'));
      setEditedIngredients(recipe.ingredients);
    }
    // 의존성 배열에 recipe 객체의 주요 값들을 넣어 prop 변경 시 실행되도록 합니다.
  }, [recipe.name, recipe.instructions, recipe.ingredients, isEditing]);

  if (!isOpen) return null;

  const handleEditToggle = () => {
    // 편집 시작 시, prop의 최신 데이터를 가져와 편집 상태를 초기화합니다.
    setEditedName(recipe.name);
    setEditedInstructions(recipe.instructions.join('\n'));
    setEditedIngredients(recipe.ingredients);
    setIsEditing(true);
  };

  const handleSave = () => {
    const updatedRecipeData = {
      id: recipe.id,
      name: editedName,
      instructions: editedInstructions.split('\n'),
      ingredients: editedIngredients,
    };

    // 1. 상위 컴포넌트의 onSave를 호출 (상위 컴포넌트가 이제 recipe 데이터를 업데이트해야 함)
    onSave(updatedRecipeData);

    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    // 1. 수정한 내용을 원래의 recipe Prop 값으로 초기화
    setEditedName(recipe.name);
    setEditedInstructions(recipe.instructions.join('\n'));
    setEditedIngredients(recipe.ingredients);

    // 2. 편집 모드 닫기
    setIsEditing(false);
  };

  const handleSubtractClick = () => {
    onStartSubtract(recipe.id);
  };

  const handleTrashClick = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteConfirmOpen(false);
  };

  const handleDeleteConfirm = () => {
    onDelete();
    setIsDeleteConfirmOpen(false);
    onClose();
  };

  const handleIngredientChange = (
    index: number,
    field: 'name' | 'quantity',
    value: string,
  ) => {
    const newIngredients = [...editedIngredients];
    newIngredients[index] = {
      ...newIngredients[index],
      [field]: value,
    };
    setEditedIngredients(newIngredients);
  };

  return (
    <>
      {/* 메인 레시피 모달 */}
      <div className="fixed inset-0 bg-black/50 flex justify-center z-50 px-5 py-40">
        <div className="w-full bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
          {/* 모달 상단 헤더 (수정/삭제 아이콘) */}
          <div className="p-5 flex justify-between items-center">
            <h2 className="text-neutral-800 text-xl font-normal">
              레시피 확인
            </h2>
            <div className="flex gap-4 text-neutral-600">
              {/* 비편집 모드일 때만 아이콘 표시 */}
              {!isEditing && (
                <img
                  src={Pen}
                  alt="수정아이콘"
                  className="cursor-pointer mt-1"
                  onClick={handleEditToggle}
                />
              )}
              {!isEditing && (
                <img
                  src={Trash}
                  alt="삭제아이콘"
                  className="cursor-pointer"
                  onClick={handleTrashClick}
                />
              )}
            </div>
          </div>

          {/* 모달 내용 스크롤 */}
          <div className="p-5 flex flex-col overflow-y-auto gap-5 custom-scrollbar">
            {/* 이미지 */}
            <div className="flex flex-col items-start gap-2.5">
              <div className="w-40 h-36 relative rounded-xl outline-1 outline-stone-300 overflow-hidden">
                <img
                  src={recipe.image}
                  alt={editedName}
                  className="w-full h-full object-cover cursor-pointer"
                />
              </div>
              <p className="text-amber-500 text-sm font-normal">
                만들 수 있어요!
              </p>
            </div>

            {/* 요리명 */}
            <div className="w-full flex flex-col justify-start items-start gap-2.5">
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
                    {editedName} {/* 수정된 이름 표시 */}
                  </span>
                </div>
              )}
            </div>

            {/* 필요한 재료 */}
            <div className="w-full flex flex-col justify-start items-start gap-2.5">
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
            <div className="w-full flex flex-col justify-start items-start gap-2.5">
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
                    {editedInstructions} {/* 수정된 설명 표시 */}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 푸터 버튼 *핵심 수정* */}
          <div className="p-4 flex justify-between gap-3">
            {isEditing ? (
              <>
                <Button color="cancel" onClick={handleCancelEdit}>
                  취소
                </Button>
                <Button color="default" onClick={handleSave}>
                  완료
                </Button>
              </>
            ) : (
              <>
                <Button color="cancel" onClick={onClose}>
                  취소
                </Button>
                <Button color="default" onClick={handleSubtractClick}>
                  재료차감
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-[9.60px] inline-flex p-6 w-72 flex-col items-center gap-7">
            <p className="text-neutral-700 text-sm font-medium">
              레시피를 삭제하시겠습니까?
            </p>
            <div className="flex gap-4 w-full justify-center ">
              <Button color="cancel" onClick={handleDeleteCancel}>
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
