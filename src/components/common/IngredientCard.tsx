import React from 'react';

interface IngredientCardProps {
  name: string;
  image: string;
  date?: string;
  quantity?: string;
}

const IngredientCard: React.FC<IngredientCardProps> = ({
  name,
  image,
  date,
  quantity,
}) => {
  return (
    // 전체 카드 컨테이너: 세로형 카드 (w-44 h-52) 구조 유지
    <div className="w-44 h-52 bg-white rounded-xl shadow-[1px_1px_4px_0px_rgba(230,230,230,1)] border border-zinc-300 overflow-hidden flex flex-col p-2">
      {/* 1. 이미지 영역 (상단): 크기 w-full h-40 유지 */}
      <div className="w-full h-40 bg-neutral-100 rounded-[10px] overflow-hidden flex items-center justify-center">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>

      {/* 2. 텍스트 정보 영역 (하단) */}
      <div className="mt-2 w-full px-1 flex flex-col gap-0.5">
        {/* 요리 이름 (이름이 길 경우 잘립니다) */}
        <p className="text-black text-base font-normal truncate">{name}</p>

        {/* 날짜와 수량 (한 줄에 배치) */}
        <div className="flex justify-between items-center">
          {/* 날짜 (왼쪽): 작은 회색 텍스트 */}
          {date && <p className="text-zinc-700 text-xs font-light">{date}</p>}

          {/* 수량 (오른쪽): 일반 크기 텍스트 */}
          {quantity && (
            <p className="text-black text-base font-normal">{quantity}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IngredientCard;
