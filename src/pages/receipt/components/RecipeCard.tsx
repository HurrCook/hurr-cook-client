import React from 'react';

interface RecipeCardProps {
  name: string;
  image: string;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ name, image }) => {
  return (
    <div className="w-44 h-52 bg-white rounded-xl shadow-[1px_1px_4px_0px_rgba(230,230,230,1)] border border-zinc-300 overflow-hidden flex flex-col p-2">
      <div className="w-full h-40 bg-neutral-100 rounded-[10px] overflow-hidden flex items-center justify-center">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="mt-2 w-full px-1 flex flex-col gap-0.5">
        <p className="text-black text-base font-normal truncate">{name}</p>
      </div>
    </div>
  );
};

export default RecipeCard;
