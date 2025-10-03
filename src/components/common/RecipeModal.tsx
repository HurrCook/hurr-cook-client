import React from 'react';
import Button from '@/components/common/Button';
import IngredientItem from '@/pages/receipt/components/IngredientItem';

interface Ingredient {
  name: string;
  quantity: string;
}

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  recipe: {
    id: number;
    name: string;
    image: string;
    ingredients: Ingredient[];
    instructions: string[];
  };
}

const RecipeModal: React.FC<RecipeModalProps> = ({
  isOpen,
  onClose,
  onNext,
  recipe,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center z-50 px-5 py-40">
      <div className="w-full bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* 모달 상단 헤더 */}
        <div className="p-5 flex justify-between items-center">
          <h2 className="text-neutral-800 text-xl font-normal">레시피 확인</h2>
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
              재료가 충분해요!
            </p>
          </div>

          {/* 요리명 */}
          <div className="w-full flex flex-col justify-start items-start gap-2.5">
            <label className="text-neutral-400 text-xs font-normal">
              요리명
            </label>
            <div className="w-full h-10 px-2.5 py-1.5 bg-white rounded-xl outline-1 outline-stone-300 flex items-center">
              <span className="text-neutral-800 text-base font-normal truncate">
                {recipe.name}
              </span>
            </div>
          </div>

          {/* 필요한 재료*/}
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
                  isEditable={false} // 읽기 전용 설정
                />
              ))}
            </div>
          </div>

          {/* 만드는 순서 */}
          <div className="w-full flex flex-col justify-start items-start gap-2.5">
            <label className="text-neutral-400 text-xs font-normal">
              만드는 순서
            </label>
            <div className="w-full min-h-[288px] p-2 bg-white rounded-xl outline-1 outline-stone-300 overflow-hidden">
              <div className="text-zinc-600 text-sm font-normal leading-loose whitespace-pre-wrap">
                {recipe.instructions.join('\n\n')}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 flex justify-between gap-3 ">
          <Button color="cancel" onClick={onClose}>
            취소
          </Button>
          <Button color="default" onClick={onNext}>
            재료차감
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;
