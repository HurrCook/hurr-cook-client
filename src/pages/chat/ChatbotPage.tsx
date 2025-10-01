import React from 'react';
import Hurr1 from '@/assets/Hurr1.svg';
import ChatIcon from '@/assets/채팅.svg';

export default function ChatbotPage() {
  return (
    <div className="relative w-full h-screen bg-white flex flex-col">
      {/* 중앙 안내 카드 */}
      <main className="flex-1 px-4 pb-40 flex items-center justify-center">
        <div className="w-40 h-44 bg-white rounded-xl flex items-center justify-center">
          <div className="flex flex-col items-center text-center">
            <img src={Hurr1} alt="후르" className="w-24 h-24 opacity-80" />
            <p className="mt-4 text-gray-700 text-sm font-pretendard leading-5">
              후르에게 레시피 <br /> 추천을 받아볼까요?
            </p>
          </div>
        </div>
      </main>

      {/* 추천 멘트 (입력창 위에 고정) */}
      <div className="fixed bottom-15 left-0 right-0 bg-white px-4 pb-2">
        <div className="flex flex-wrap gap-3">
          <div className="bg-gray-100 shadow-sm rounded-xl px-3 py-2 w-fit max-w-[60%]">
            <p className="text-sm text-gray-800">계란과 양파로 만들</p>
            <p className="text-xs text-gray-600">수 있는 간단한 요리 알려줘!</p>
          </div>
          <div className="bg-gray-100 shadow-sm rounded-xl px-3 py-2 w-fit max-w-[70%]">
            <p className="text-sm text-gray-800">
              프라이팬 하나로 만들 수 있고,
            </p>
            <p className="text-xs text-gray-600">
              설거지도 적게 나오는 요리 좀 추천해줘!
            </p>
          </div>
        </div>
      </div>

      {/* 입력창 (하단 고정) */}
      <footer className="fixed bottom-0 left-0 right-0 px-4 py-2 mb-2 bg-white">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="메시지를 입력하세요..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 active:scale-95 transition">
            <img src={ChatIcon} alt="전송" className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
}
