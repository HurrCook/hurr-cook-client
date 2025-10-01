import React from 'react';
import Hurr1 from '@/assets/Hurr1.svg';

export default function ChatEmptyCard() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-40 h-44 bg-white rounded-xl flex items-center justify-center">
        <div className="flex flex-col items-center text-center mb-10">
          <img src={Hurr1} alt="후르" className="w-24 h-24 opacity-80" />
          <p className="mt-4 text-gray-700 text-sm font-pretendard leading-5">
            후르에게 레시피 <br /> 추천을 받아볼까요?
          </p>
        </div>
      </div>
    </div>
  );
}
