import React from 'react';

export default function ChatbotPage() {
  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* 상단 헤더 */}
      <header className="w-full h-14 flex items-center justify-between px-4 border-b border-gray-200">
        <div className="w-5 h-4 border-2 border-gray-800"></div>
        <h1 className="text-[#FF8800] font-gretoon text-lg font-semibold">
          Hurr Cook
        </h1>
        <div className="w-6 h-6 bg-gray-800 rounded"></div>
      </header>

      {/* 채팅 안내 영역 (중앙 카드) */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="w-40 h-44 bg-white rounded-xl shadow-sm flex items-center justify-center">
          <img
            src="https://placehold.co/96x95"
            alt="후르"
            className="w-24 h-24 opacity-80"
          />
        </div>
        <p className="mt-4 text-gray-700 text-sm font-pretendard leading-5">
          후르에게 레시피 <br /> 추천을 받아볼까요?
        </p>
      </div>

      {/* 추천 말풍선 영역 */}
      <div className="px-4 pb-4 space-y-3">
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
          <div className="bg-gray-100 shadow-sm rounded-xl px-3 py-2 w-fit max-w-[50%]">
            <p className="text-sm text-gray-800">다 먹기 직전인</p>
            <p className="text-xs text-gray-600">재료로 요리 추천해줘!</p>
          </div>
          <div className="bg-gray-100 shadow-sm rounded-xl px-3 py-2 w-fit max-w-[70%]">
            <p className="text-sm text-gray-800">
              지금 집에 있는 재료들로 만들
            </p>
            <p className="text-xs text-gray-600">
              수 있는 저녁 메뉴 중에서 칼로리 낮은 거 추천해줘!
            </p>
          </div>
        </div>
      </div>

      {/* 입력창 */}
      <footer className="border-t border-gray-200 px-4 py-2 flex items-center">
        <input
          type="text"
          placeholder="메시지를 입력하세요..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8800]"
        />
        <button className="ml-2 bg-[#FF8800] text-white px-4 py-2 rounded-lg font-semibold active:scale-95 transition">
          전송
        </button>
      </footer>
    </div>
  );
}
