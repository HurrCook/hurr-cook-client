import React, { useState, useEffect } from 'react';

interface SubtractBoxProps {
  name: string;
  expiryDate: string;
  ownedQuantity: string; // "10개" 같은 문자열 형태
}

const SubtractBox: React.FC<SubtractBoxProps> = ({
  name,
  expiryDate,
  ownedQuantity,
}) => {
  // 숫자 추출 (ex. "10개" → 10)
  const owned = parseInt(ownedQuantity.replace(/[^0-9]/g, ''), 10) || 0;

  // 상태 관리
  const [usedQuantity, setUsedQuantity] = useState<number>(0);
  const [remainingQuantity, setRemainingQuantity] = useState<number>(owned);

  // 사용 수량 변경 시 자동 계산
  useEffect(() => {
    setRemainingQuantity(Math.max(owned - usedQuantity, 0));
  }, [usedQuantity, owned]);

  return (
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
          <label className="text-zinc-500 text-[10px] font-light">
            유통기한
          </label>
          <div className="h-[28px] w-full bg-white rounded border border-stone-300 flex items-center px-2">
            <span className="justify-start text-zinc-800 text-xs font-light truncate">
              {expiryDate}
            </span>
          </div>
        </div>
      </div>

      {/* 수량 정보 (보유 / 사용 / 남은) */}
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

        {/* 사용 수량 (선택 박스) */}
        <div className="flex flex-col items-start gap-0.5 w-1/3">
          <label className="text-zinc-500 text-[10px] font-light">
            사용 수량
          </label>
          <select
            value={usedQuantity}
            onChange={(e) => setUsedQuantity(Number(e.target.value))}
            className="h-[28px] w-full bg-white rounded border border-stone-300
                       text-zinc-800 text-xs font-light focus:border-amber-500 focus:outline-none cursor-pointer"
          >
            <option value={0}>0개</option>
            {Array.from({ length: owned }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num}개
              </option>
            ))}
          </select>
        </div>

        {/* 남은 수량 */}
        <div className="flex flex-col items-start gap-0.5 w-1/3">
          <label className="text-zinc-500 text-[10px] font-light">
            남은 수량
          </label>
          <div className="h-[28px] w-full bg-white rounded border border-stone-300 flex items-center px-2">
            <span className="text-zinc-800 text-xs font-light">
              {remainingQuantity}개
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubtractBox;
