import React, { useState, useEffect } from 'react';

interface SubtractCardProps {
  item: {
    id: string | number;
    name: string;
    image: string;
    quantity: string; // 예: "3개" or "200g"
    expiryDate: string;
  };
  onChangeUsed?: (id: string | number, used: number) => void; // 상위로 전달할 콜백
}

const SubtractCard: React.FC<SubtractCardProps> = ({ item, onChangeUsed }) => {
  // 숫자와 단위 분리
  const quantityMatch = item.quantity.match(
    /^(\d+(?:\.\d+)?)([a-zA-Z가-힣]*)$/,
  );
  const owned = quantityMatch ? parseFloat(quantityMatch[1]) : 0;
  const unit = quantityMatch && quantityMatch[2] ? quantityMatch[2] : '';

  const [usedQuantity, setUsedQuantity] = useState(0);
  const [remaining, setRemaining] = useState(owned);

  // focus 감지
  const [isFocused, setIsFocused] = useState(false);

  // 선택 수량이 바뀔 때마다 남은 수량 및 상위 알림
  useEffect(() => {
    setRemaining(Math.max(owned - usedQuantity, 0));
    onChangeUsed?.(item.id, usedQuantity); // 상위 모달로 전달
  }, [usedQuantity, owned]);

  return (
    <div
      className={`w-full flex items-center gap-4 p-2 bg-white rounded-xl transition-colors duration-300 ${
        isFocused ? 'border-amber-500' : 'border-stone-300'
      }`}
    >
      {/* 이미지 */}
      <img
        src={item.image}
        alt={item.name}
        className="w-14 h-14 rounded-lg object-cover"
      />

      {/* 내용 */}
      <div className="flex flex-col flex-1 gap-1">
        <div className="flex justify-between items-center">
          <span className="text-neutral-800 text-base font-medium">
            {item.name}
          </span>
          <span className="text-xs text-neutral-500">
            {new Date(item.expiryDate).toLocaleDateString('ko-KR')}
          </span>
        </div>

        {/* 수량 선택 */}
        <div className="flex gap-2 items-center">
          <span className="text-xs text-neutral-500">
            보유: {owned}
            {unit}
          </span>

          <select
            value={usedQuantity}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => setUsedQuantity(Number(e.target.value))}
            className="h-[28px] px-2 rounded-md border border-stone-300 text-xs text-neutral-800
                       focus:border-amber-500 focus:outline-none cursor-pointer transition"
          >
            <option value={0}>0{unit}</option>
            {Array.from({ length: Math.floor(owned) }, (_, i) => i + 1).map(
              (num) => (
                <option key={num} value={num}>
                  {num}
                  {unit}
                </option>
              ),
            )}
          </select>

          <span className="text-xs text-neutral-500">
            남은 수량: {remaining}
            {unit}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SubtractCard;
