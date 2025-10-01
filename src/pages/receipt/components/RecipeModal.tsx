import React, { useState } from 'react';
import Button from '@/components/common/Button';
import IngredientItem from '@/pages/receipt/components/IngredientItem';
import Pen from '@/assets/연필.svg';
import Trash from '@/assets/쓰레기통.svg';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  recipe: {
    id: number;
    name: string;
    image: string;
    ingredients: { name: string; quantity: string }[];
    instructions: string[];
  };
}

const RecipeModal: React.FC<RecipeModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  recipe,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(recipe.name);
  const [editedInstructions, setEditedInstructions] = useState(
    recipe.instructions.join('\n'),
  );
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  if (!isOpen) return null;

  const handleEditToggle = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // 실제 서버 저장 로직 추가 가능
    console.log('저장된 요리명:', editedName);
    console.log('저장된 만드는 순서:', editedInstructions.split('\n'));
    setIsEditing(false);
  };

  const handleTrashClick = () => {
    setIsDeleteConfirmOpen(true); // 삭제 확인 모달 열기
  };

  const handleDeleteCancel = () => {
    setIsDeleteConfirmOpen(false);
  };

  const handleDeleteConfirm = () => {
    onDelete();
    setIsDeleteConfirmOpen(false);
    onClose(); // 모달 닫기
  };

  return (
    <>
      {/* 메인 레시피 모달 */}
      <div className="fixed inset-0 bg-black/50 flex justify-center z-50 px-5 py-40">
        <div className="w-full bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
          {/* 모달 상단 헤더 */}
          <div className="p-5 flex justify-between items-center border-b border-gray-100">
            <h2 className="text-neutral-800 text-xl font-normal">
              레시피 확인
            </h2>
            <div className="flex gap-4 text-neutral-600">
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
                  alt={recipe.name}
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
                  <span className="text-neutral-800 text-base font-normal">
                    {recipe.name}
                  </span>
                </div>
              )}
            </div>

            {/* 필요한 재료 */}
            <div className="w-full flex flex-col justify-start items-start gap-2.5">
              <label className="text-neutral-400 text-xs font-normal">
                필요한 재료
              </label>
              <div className="w-full min-h-[128px] p-2 bg-white rounded-lg outline outline-1 outline-stone-300 flex flex-col gap-2">
                {recipe.ingredients.map((item, index) => (
                  <IngredientItem
                    key={index}
                    name={item.name}
                    quantity={item.quantity}
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
                    {recipe.instructions.map((step, index) => (
                      <React.Fragment key={index}>
                        {step}
                        {index < recipe.instructions.length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 푸터 버튼 */}
          <div className="p-4 flex justify-between gap-3 border-t border-gray-100">
            <Button color="cancel" onClick={onClose}>
              취소
            </Button>
            {isEditing ? (
              <Button color="default" onClick={handleSave}>
                완료
              </Button>
            ) : (
              <Button color="default" onClick={handleEditToggle}>
                요리하기
              </Button>
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

export default RecipeModal;
