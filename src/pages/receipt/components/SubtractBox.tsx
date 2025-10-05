import React from 'react';

interface SubtractBoxProps {
  name: string;
  expiryDate: string;
  ownedQuantity: string;
  usedQuantity: string;
  remainingQuantity: string;
}

const SubtractBox: React.FC<SubtractBoxProps> = ({
  name,
  expiryDate,
  ownedQuantity,
  usedQuantity,
  remainingQuantity,
}) => (
  // 기존 w-48 레이아웃을 재구성합니다.
  <div className="w-48 flex flex-col gap-2">
    {/* 재료명 & 유통기한 */}
    <div className="flex justify-between gap-2 w-full">
      {/* 재료명 */}
      <div className="flex flex-col items-start gap-0.5 w-[calc(50%-4px)]">
        <label className="text-zinc-500 text-[10px] font-light">재료명</label>
        <div className="h-[28px] w-full bg-white rounded border border-stone-300 flex items-center px-2">
          <span className="text-zinc-800 text-xs font-light truncate">
            {name}
          </span>
        </div>
      </div>

      {/* 유통기한 */}
      <div className="flex flex-col items-start gap-0.5 w-[calc(50%-4px)]">
        <label className="text-zinc-500 text-[10px] font-light">유통기한</label>
        <div className="h-[28px] w-full bg-white rounded border border-stone-300 flex items-center px-2">
          <span className="justify-start text-zinc-800 text-xs font-light truncate">
            {expiryDate}
          </span>
        </div>
      </div>
    </div>

    {/* 수량 정보 (보유 수량, 사용 수량, 남은 수량) */}
    <div className="w-full flex justify-between items-end gap-3">
      {/* 보유 수량 */}
      <div className="flex flex-col items-start gap-0.5 w-1/3">
        <label className="text-zinc-500 text-[10px] font-light">
          보유 수량
        </label>
        <div className="h-[28px] w-full bg-white rounded border border-stone-300 flex items-center px-2">
          <span className="text-zinc-800 text-xs font-light">
            {ownedQuantity}
          </span>
        </div>
      </div>

      {/* 사용 수량 (입력 필드) */}
      <div className="flex flex-col items-start gap-0.5 w-1/3">
        <label className="text-zinc-500 text-[10px] font-light">
          사용 수량
        </label>
        <div className="h-[28px] w-full bg-white rounded border border-stone-300 flex items-center px-2">
          <input
            type="text"
            defaultValue={usedQuantity} // 사용 수량은 입력 가능해야 하므로 defaultValue 사용
            className="w-full text-zinc-800 text-xs font-light focus:outline-none bg-transparent"
            aria-label="사용 수량"
          />
        </div>
      </div>

      {/* 남은 수량 */}
      <div className="flex flex-col items-start gap-0.5 w-1/3">
        <label className="text-zinc-500 text-[10px] font-light">
          남은 수량
        </label>
        <div className="h-[28px] w-full bg-white rounded border border-stone-300 flex items-center px-2">
          <span className="text-zinc-800 text-xs font-light">
            {remainingQuantity}
          </span>
        </div>
      </div>
    </div>
  </div>
);
export default SubtractBox;
