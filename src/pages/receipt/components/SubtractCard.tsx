import React from 'react';
import SubtractBox from './SubtractBox'; // SubtractBox 임포트 필요

interface InventoryItem {
  id: number;
  name: string;
  image: string;
  quantity: string;
  expiryDate: string;
}

interface SubtractCardProps {
  item: InventoryItem;
}

const SubtractCard: React.FC<SubtractCardProps> = ({ item }) => {
  // 실제 로직에서는 재고와 레시피 필요량을 비교하여 계산해야 함
  const owned = item.quantity;
  const used = '3개'; // 임시 값
  const remaining = '7개'; // 임시 값

  return (
    <div className="w-full px-3 py-3.5 bg-white rounded-lg border-[0.3px] border-stone-300 inline-flex justify-start items-center gap-3.5 overflow-hidden shadow-sm">
      {/* 이미지 영역 */}
      <div className="w-[91px] h-full relative bg-gray-100 rounded overflow-hidden flex items-center justify-center flex-shrink-0">
        <img
          className="w-full h-full object-cover"
          src={
            item.image ||
            `https://placehold.co/100x91/f0f0f0/cccccc?text=${item.name[0]}`
          }
          alt={item.name}
          onError={(e) =>
            (e.target.src = `https://placehold.co/100x91/f0f0f0/cccccc?text=${item.name[0]}`)
          }
        />
      </div>

      {/* SubtractBox (상세 정보 영역) */}
      <SubtractBox
        name={item.name}
        expiryDate={item.expiryDate}
        ownedQuantity={owned}
        usedQuantity={used}
        remainingQuantity={remaining}
      />
    </div>
  );
};

export default SubtractCard;
