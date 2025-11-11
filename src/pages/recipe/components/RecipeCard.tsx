import React from 'react';

interface RecipeCardProps {
  name: string;
  image: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ name, image }) => {
  return (
    <div
      className="w-[180px] h-[220px] rounded-xl border border-[#DDDDDD] bg-white
                 overflow-hidden flex flex-col p-2 cursor-pointer
                 shadow-[1px_1px_4px_0px_rgba(230,230,230,1)]
                 transition-all duration-200 hover:scale-[1.02]"
    >
      {/* 이미지 영역 */}
      <div className="w-full h-[160px] bg-neutral-100 rounded-[10px] overflow-hidden flex items-center justify-center">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-[10px]"
        />
      </div>

      {/* 텍스트 영역 */}
      <div className="mt-3 w-full flex flex-col gap-1 px-1">
        <p className="text-[16px] font-normal leading-tight text-black truncate">
          {name}
        </p>
      </div>
    </div>
  );
};

export default RecipeCard;
