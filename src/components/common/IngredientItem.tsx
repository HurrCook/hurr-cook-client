import React from 'react';

interface IngredientCardProps {
  name: string;
  image: string;
  date?: string;
  quantity?: string;
}

const IngredientItem: React.FC<IngredientCardProps> = ({
  name,
  image,
  date,
  quantity,
}) => {
  return (
    // 전체 카드 컨테이너 (기존 유지)
    <div className="w-full bg-white rounded-xl shadow-[1px_1px_4px_0px_rgba(230,230,230,1)] border border-zinc-300 overflow-hidden flex flex-col p-2">
      {/* ✅ 이미지 영역: 기본 구조 유지 + 430×932에서 162×162로 고정 */}
      <div
        className="w-full bg-neutral-100 rounded-[10px] overflow-hidden flex items-center justify-center"
        style={{
          width: '100%',
          height: 'auto',
          maxWidth: '162px',
          maxHeight: '162px',
          aspectRatio: '1 / 1',
        }}
      >
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* 텍스트 영역 */}
      <div className="mt-2 w-full px-1 flex flex-col gap-0.5">
        <p className="text-black text-base font-normal truncate">{name}</p>

        <div className="flex justify-between items-center">
          {date && <p className="text-zinc-700 text-xs font-light">{date}</p>}
          {quantity && (
            <p className="text-black text-base font-normal">{quantity}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default IngredientItem;
