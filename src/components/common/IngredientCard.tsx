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
  // ✅ 수정된 날짜 파싱 및 비교 로직 (가장 안정적인 방식)

  // 1. "YYYY.MM.DD" 문자열을 연, 월, 일로 분리
  const dateParts = date.split('.').map((part) => parseInt(part, 10));

  // 날짜 파싱 실패 시 만료되지 않은 것으로 간주하고 렌더링을 차단
  if (dateParts.length !== 3 || dateParts.some(isNaN)) {
    console.error('Invalid date format received:', date);
    return null;
  }

  const [year, month, day] = dateParts;
  // new Date() 생성자는 월(Month)을 0부터 시작 (1월=0, 12월=11).
  const monthIndex = month - 1;

  // 2. 만료일: 로컬 시간대 기준으로 00:00:00에 해당하는 Date 객체 생성
  const parsedDate = new Date(year, monthIndex, day, 0, 0, 0, 0);

  // 3. 오늘: 오늘 날짜의 시간을 00:00:00으로 설정
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 4. 유통기한이 오늘 날짜와 같거나 (<=) 이미 지났으면 true
  const isExpired = parsedDate <= today;
  // ------------------------------------

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
