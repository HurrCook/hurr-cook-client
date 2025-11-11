import React, { useState, useEffect } from 'react';

interface SubtractCardProps {
  item: {
    id: string | number;
    name: string;
    image: string;
    quantity: string;
    expiryDate: string;
  };
}

const SubtractCard: React.FC<SubtractCardProps> = ({ item }) => {
  const owned = parseInt(item.quantity.replace(/[^0-9]/g, ''), 10) || 0;
  const [usedQuantity, setUsedQuantity] = useState(0);
  const [remaining, setRemaining] = useState(owned);

  // focus 감지
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setRemaining(Math.max(owned - usedQuantity, 0));
  }, [usedQuantity]);

  return (
    <div
      className={`w-full flex items-center gap-4 p-4 bg-white rounded-xl border transition-colors duration-300 ${
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
      <div className="flex flex-col flex-1">
        <div className="flex justify-between items-center">
          <span className="text-neutral-800 text-base font-medium">
            {item.name}
          </span>
          <span className="text-xs text-neutral-500">{item.expiryDate}</span>
        </div>

        {/* 수량 선택 */}
        <div className="flex gap-2 items-center">
          <span className="text-xs text-neutral-500">보유: {owned}개</span>

          {/* 🔶 셀렉트: focus 시 카드 전체도 주황색 border */}
          <select
            value={usedQuantity}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => setUsedQuantity(Number(e.target.value))}
            className="h-[28px] px-2 rounded-md border border-stone-300 text-xs text-neutral-800
                       focus:border-amber-500 focus:outline-none cursor-pointer transition"
          >
            <option value={0}>0개</option>
            {Array.from({ length: owned }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num}개
              </option>
            ))}
          </select>

          <span className="text-xs text-neutral-500">
            남은 수량: {remaining}개
          </span>
        </div>
      </div>
    </div>
  );
};

export default SubtractCard;
