// src/components/IngredientEditItem.tsx

import React from 'react';

// Unit 옵션 정의
const UNIT_OPTIONS = ['EA', 'g', 'ml'];

// Prop 인터페이스 정의 (UserInfoPage2.tsx와 동일해야 함)
interface IngredientEditItemProps {
  id: string | number;
  name: string;
  image: string;
  date: string;
  quantity: string;
  unit: string;
  onUpdate: (id: string | number, field: string, value: string) => void;
}

const IngredientEditItem: React.FC<IngredientEditItemProps> = ({
  id,
  name,
  image,
  date,
  quantity,
  unit,
  onUpdate,
}) => {
  const handleChange = (field: string, value: string) => {
    if (field === 'quantity') {
      const numericValue = value.replace(/[^0-9]/g, '');
      onUpdate(id, field, numericValue);
    } else if (field === 'date') {
      onUpdate(id, field, value);
    } else {
      onUpdate(id, field, value);
    }
  };

  const inputClass = `
  w-full h-7 bg-white rounded border-[0.46px] border-stone-300 px-2 text-zinc-800 text-xs font-light font-['Pretendard']
`;
  return (
    <div
      className="w-full h-28 flex bg-white rounded-lg outline outline-[0.51px] outline-stone-300 overflow-hidden pl-[9px] pt-[7px] pb-[11px]"
      style={{ outlineOffset: '-0.51px' }}
    >
      {/* 1. 이미지 영역 */}
      <div className="w-24 h-24 rounded overflow-hidden flex-shrink-0 mr-[5.58%]">
        <img className="w-full h-full object-cover" src={image} alt={name} />
      </div>

      {/* 2. 메인 정보 컨테이너 (오른쪽: Flex-grow로 남은 공간 차지) */}
      <div className="flex-grow flex flex-col justify-end">
        {/* 🚀 상단 그룹 (재료명/유통기한) */}
        <div className="flex justify-between items-start w-full">
          {/* 2-1. 재료 정보 필드 그룹 */}
          <div className="flex justify-start gap-[3.26%] pb-[9px] w-full">
            {/* 2-1-1. 재료명 그룹 */}
            <div className="flex flex-col gap-[2px] items-start flex-1 w-0">
              <div className="text-zinc-500 text-[9.27px] font-light font-['Pretendard']">
                재료명
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={inputClass}
              />
            </div>

            {/* 2-1-2. 유통기한 그룹 (오른쪽 9px 마진 확보) */}
            <div className="flex flex-col gap-[2px] items-start flex-1 w-0 mr-[2.09%]">
              {' '}
              {/* 💡 mr-[2.09%] 추가 */}
              <div className="text-zinc-500 text-[9.27px] font-light font-['Pretendard']">
                유통기한
              </div>
              <input
                type="text"
                value={date}
                onChange={(e) => handleChange('date', e.target.value)}
                className={inputClass}
                placeholder="YYYY.MM.DD"
              />
            </div>
          </div>
        </div>

        {/* 🚀 하단 그룹 (갯수/용량 & 단위) */}
        <div className="flex justify-start items-start gap-[3.26%] w-full">
          {/* 3-1. 갯수/용량 그룹 */}
          <div className="flex flex-col gap-[2px] items-start flex-1 w-0">
            <div className="text-zinc-500 text-[9.27px] font-light font-['Pretendard']">
              갯수/용량
            </div>
            <input
              type="number"
              value={quantity}
              onChange={(e) => handleChange('quantity', e.target.value)}
              className={inputClass}
            />
          </div>

          {/* 3-2. 단위 그룹 (오른쪽 9px 마진 확보) */}
          <div className="flex flex-col gap-[2px] items-start flex-1 w-0 mr-[2.09%]">
            {' '}
            {/* 💡 mr-[2.09%] 추가 */}
            <div className="text-zinc-500 text-[9.27px] font-light font-['Pretendard']">
              단위
            </div>
            <div className="relative w-full">
              <select
                value={unit}
                onChange={(e) => handleChange('unit', e.target.value)}
                className={
                  'w-full h-7 bg-white rounded border-[0.46px] border-stone-300 text-left text-zinc-800 text-xs font-light font-["Pretendard"] appearance-none px-2'
                }
                style={{ paddingRight: '16px' }}
              >
                {UNIT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>

              {/* 🚀 커스텀 화살표 아이콘 */}
              <svg
                className="w-4 h-4 text-zinc-500 absolute right-0 top-1/2 transform -translate-y-1/2 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientEditItem;
