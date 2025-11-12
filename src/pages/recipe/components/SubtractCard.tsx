import React, { useState, useEffect } from 'react';

interface SubtractCardProps {
  item: {
    id: string | number;
    name: string;
    image: string;
    amount: number;
    unit: string;
    expiryDate: string;
    requiredAmount?: number;
  };
  onChangeUsed?: (id: string | number, usedAmount: number) => void;
}

const SubtractCard: React.FC<SubtractCardProps> = ({ item, onChangeUsed }) => {
  const owned = item.amount || 0;
  const unit = item.unit || '';
  const initialUsed =
    item.requiredAmount && item.requiredAmount <= owned
      ? item.requiredAmount
      : 0;

  const [usedAmount, setUsedAmount] = useState(initialUsed);
  const [remaining, setRemaining] = useState(owned - initialUsed);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const newRemaining = Math.max(owned - usedAmount, 0);
    setRemaining(newRemaining);

    if (typeof onChangeUsed === 'function') {
      onChangeUsed(item.id, usedAmount);
    }
  }, [usedAmount, owned]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const validValue = Math.min(Math.max(value, 0), owned);
    setUsedAmount(validValue);
  };

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
        {/* 이름 + 유통기한 */}
        <div className="flex justify-between items-center">
          <span className="text-neutral-800 text-base font-medium">
            {item.name}
          </span>
          <span className="text-xs text-neutral-500">
            {new Date(item.expiryDate).toLocaleDateString('ko-KR')}
          </span>
        </div>

        {/* 수량 입력줄 (보유 - 인풋 - 남은 중앙정렬) */}
        <div className="flex items-center justify-between">
          {/* 왼쪽: 보유 */}
          <span className="text-xs text-neutral-500">
            보유: {owned}
            {unit}
          </span>

          {/* 가운데: 입력창 */}
          <div className="flex justify-center flex-1">
            <input
              type="number"
              min={0}
              max={owned}
              step={1}
              value={usedAmount}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={handleInputChange}
              className="h-[28px] w-16 px-2 rounded-md border border-stone-300 text-xs text-neutral-800
                         focus:border-amber-500 focus:outline-none text-center transition"
            />
          </div>

          {/* 오른쪽: 남은 수량 */}
          <span className="text-xs text-neutral-500 text-right">
            남은: {remaining}
            {unit}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SubtractCard;
