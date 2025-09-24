import React from 'react';

export default function ChatPage() {
  return (
    <div className="flex flex-col h-full p-4">
      {/* 채팅 영역 */}
      <div className="flex-1 overflow-y-auto space-y-3"></div>

      {/* 입력 영역 */}
      <div className="flex items-center border-t border-gray-200 mt-2 pt-2">
        <input
          type="text"
          placeholder="메시지를 입력하세요..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8800]"
        />
        <button className="ml-2 bg-[#FF8800] text-white px-4 py-2 rounded-lg font-semibold active:scale-[0.98]">
          전송
        </button>
      </div>
    </div>
  );
}
