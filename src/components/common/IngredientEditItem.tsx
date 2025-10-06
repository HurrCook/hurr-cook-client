import React from 'react';

interface IngredientEditItemProps {
  name: string;
  image: string;
  date: string;
  quantity: string;
  unit: string; // 단위 필드를 명시적으로 추가
}

const IngredientEditItem: React.FC<IngredientEditItemProps> = ({
  name,
  image,
  date,
  quantity,
  unit,
}) => {
  return (
    // 💡 부모의 너비를 따르도록 w-full로 설정
    <div className="w-full h-28 relative bg-white rounded-lg outline-[0.51px] outline-offset-[-0.51px] outline-stone-300 overflow-hidden">
      {/* 삭제/수정 아이콘 영역 (비율로 위치 조정) */}
      <div
        className="w-6 h-6 absolute"
        style={{ left: '80.8%', top: '6.4%' }}
      />

      {/* 이미지 (96x96, left 9px, top 7px) */}
      <div
        className="w-24 h-24 absolute bg-white rounded overflow-hidden"
        style={{ left: '2.09%', top: '6.1%' }}
      >
        <img
          className="w-24 h-24 absolute"
          src={image}
          alt={name}
          style={{ left: '-5px', top: '0px' }}
        />
      </div>

      {/* 메인 정보 컨테이너 */}
      <div
        className="w-[69.76%] absolute flex flex-col justify-start gap-1"
        style={{ left: '28.6%' }}
      >
        {/* 재료명/유통기한 행 */}
        <div className="inline-flex justify-start items-center gap-3.5 mt-2">
          <div className="justify-start text-zinc-800 text-xs font-light font-['Pretendard']">
            {name}
          </div>
          <div className="justify-start text-zinc-500 text-[9.27px] font-light font-['Pretendard']">
            재료명
          </div>

          <div className="justify-start text-zinc-800 text-xs font-light font-['Pretendard']">
            {date}
          </div>
          <div className="justify-start text-zinc-500 text-[9.27px] font-light font-['Pretendard']">
            유통기한
          </div>
        </div>

        {/* 갯수/용량 행 */}
        <div className="mt-4 flex items-center justify-start gap-3">
          {/* 갯수/용량 입력 박스 */}
          <div className="w-28 h-7 bg-white rounded border-[0.46px] border-stone-300 flex items-center justify-start pl-2">
            <div className="justify-start text-zinc-800 text-xs font-light font-['Pretendard']">
              {quantity}
            </div>
          </div>

          {/* 단위 입력 박스 */}
          <div className="w-14 h-7 bg-white rounded border-[0.46px] border-stone-300 flex items-center justify-center">
            <div className="justify-start text-zinc-800 text-xs font-light font-['Pretendard']">
              {unit}
            </div>
          </div>

          {/* 갯수/용량 레이블 */}
          <div className="justify-start text-zinc-500 text-[9.27px] font-light font-['Pretendard']">
            갯수/용량
          </div>

          {/* 단위 레이블 */}
          <div className="justify-start text-zinc-500 text-[9.27px] font-light font-['Pretendard']">
            단위
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientEditItem;
