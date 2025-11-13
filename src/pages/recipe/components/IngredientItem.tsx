import React from 'react';

interface IngredientItemProps {
  name: string;
  amount: string; // 예: "3개" or "200g"
  isEditable?: boolean;
  onNameChange?: (value: string) => void;
  onAmountChange?: (value: string) => void; // 변경됨
}

const IngredientItem: React.FC<IngredientItemProps> = ({
  name,
  amount,
  isEditable = false,
  onNameChange,
  onAmountChange,
}) => {
  // amount 문자열에서 숫자 부분과 단위 부분 분리
  const numberPart = amount?.match(/\d+(\.\d+)?/)?.[0] || '';
  const unitPart = amount?.replace(numberPart, '') || '';

  return (
    <div className="flex gap-4">
      {/* 재료명 */}
      <div className="flex flex-col items-start gap-0.5 w-[100px]">
        <label className="text-zinc-500 text-[10px] font-light">재료명</label>
        <div className="h-[30px] bg-white rounded border border-stone-300 flex items-center px-2">
          <input
            type="text"
            value={name}
            readOnly={!isEditable}
            onChange={(e) => onNameChange?.(e.target.value)}
            className="w-full text-zinc-800 text-sm font-light focus:outline-none bg-transparent"
            aria-label="재료명"
          />
        </div>
      </div>

      {/* 갯수/용량 */}
      <div className="flex flex-col items-start gap-0.5 w-[90px]">
        <label className="text-zinc-500 text-[10px] font-light">
          갯수/용량
        </label>

        {isEditable ? (
          <div className="flex items-center gap-1 h-[30px]">
            <input
              type="number"
              min="0"
              step="1"
              value={numberPart}
              onChange={(e) => {
                const newNum = e.target.value;
                onAmountChange?.(`${newNum}${unitPart}`); // 변경됨
              }}
              className="w-[60px] h-[30px] rounded border border-stone-300 px-2
                         text-zinc-800 text-sm font-light bg-white focus:outline-none focus:border-amber-500 transition"
            />
            <span className="text-zinc-700 text-sm">{unitPart}</span>
          </div>
        ) : (
          <div className="h-[30px] bg-white rounded border border-stone-300 flex items-center px-2 w-full">
            <span className="text-zinc-800 text-sm font-light">
              {amount || '-'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default IngredientItem;
