import React from 'react';

interface IngredientItemProps {
  name: string;
  quantity: string;
  isEditable?: boolean;
  onNameChange?: (value: string) => void;
  onQuantityChange?: (value: string) => void;
}

const IngredientItem: React.FC<IngredientItemProps> = ({
  name,
  quantity,
  isEditable = false,
  onNameChange,
  onQuantityChange,
}) => {
  const quantityOptions = Array.from({ length: 9 }, (_, i) => `${i + 1}개`);

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
            onChange={(e) => onNameChange && onNameChange(e.target.value)}
            className="w-full text-zinc-800 text-sm font-light focus:outline-none bg-transparent"
            aria-label="재료명"
          />
        </div>
      </div>

      {/* 갯수/용량 */}
      <div className="flex flex-col items-start gap-0.5 w-[80px]">
        <label className="text-zinc-500 text-[10px] font-light">
          갯수/용량
        </label>
        {isEditable ? (
          <select
            value={quantity}
            onChange={(e) =>
              onQuantityChange && onQuantityChange(e.target.value)
            }
            className="h-[30px] w-full rounded border border-stone-300 text-zinc-800 text-sm font-light
                       bg-white focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
          >
            <option value="">0개</option>
            {quantityOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <div className="h-[30px] bg-white rounded border border-stone-300 flex items-center px-2 w-full">
            <span className="text-zinc-800 text-sm font-light">
              {quantity || '-'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
export default IngredientItem;
