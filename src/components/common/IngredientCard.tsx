import React from 'react';

interface IngredientCardProps {
  name: string;
  image: string;
  date: string;
  quantity: string;
}

const IngredientCard: React.FC<IngredientCardProps> = ({
  name,
  image,
  date,
  quantity,
}) => {
  const today = new Date();
  const parsedDate = new Date(date.replace(/\./g, '-'));
  const isExpired = parsedDate < today;

  return (
    <div
      className={`w-[180px] h-[220px] rounded-xl border overflow-hidden flex flex-col p-2 cursor-pointer
        ${
          isExpired
            ? 'bg-gradient-to-b from-[#FF8A80] to-[#FF4741] border-[#FF4741]'
            : 'bg-white border-[#DDDDDD]'
        }
        shadow-[1px_1px_4px_0px_rgba(230,230,230,1)] transition-all duration-200`}
    >
      <div className="w-full h-[160px] bg-neutral-100 rounded-[10px] overflow-hidden flex items-center justify-center">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-[10px]"
        />
      </div>

      <div className="mt-3 w-full flex flex-col gap-1">
        <p
          className={`text-[16px] font-normal leading-tight ${
            isExpired ? 'text-white' : 'text-black'
          }`}
        >
          {name}
        </p>

        <div className="flex justify-between items-end w-full">
          <span
            className={`text-[12px] font-light ${
              isExpired ? 'text-white/90' : 'text-[#484848]'
            }`}
          >
            {date}
          </span>
          <span
            className={`text-[16px] font-normal ${
              isExpired ? 'text-white' : 'text-black'
            }`}
          >
            {quantity}
          </span>
        </div>
      </div>
    </div>
  );
};

export default IngredientCard;
