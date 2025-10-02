import React from 'react';

interface IngredientItemProps {
  name: string;
  quantity: string;
  isEditable?: boolean; // 편집 가능 여부
}

const IngredientItem: React.FC<IngredientItemProps> = ({
  name,
  quantity,
  isEditable = false,
}) => {
  return (
    <div className="flex gap-4">
      {/* 요리명 묶음 */}
      <div className="flex flex-col items-start gap-0.5 w-[100px]">
        <label className="text-zinc-500 text-[10px] font-light">재료명</label>
        <div className="h-[30px] bg-white rounded border border-stone-300 flex items-center px-2">
          <input
            type="text"
            value={name}
            readOnly={!isEditable}
            className="w-full text-zinc-800 text-sm font-light focus:outline-none bg-transparent"
            aria-label="재료명"
          />
        </div>
      </div>

      {/* 갯수/용량 묶음 */}
      <div className="flex flex-col items-start gap-0.5 w-[60px]">
        <label className="text-zinc-500 text-[10px] font-light">
          갯수/용량
        </label>
        <div className="h-[30px] bg-white rounded border border-stone-300 flex items-center px-2">
          <input
            type="text"
            value={quantity}
            readOnly={!isEditable}
            className="w-full text-zinc-800 text-sm font-light focus:outline-none bg-transparent"
            aria-label="갯수/용량"
          />
        </div>
      </div>
    </div>
  );
};
export default IngredientItem;
