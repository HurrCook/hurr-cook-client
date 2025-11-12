import React from 'react';

type ChatSuggestionsProps = {
  onSelect: (message: string) => void;
};

export default function ChatSuggestions({ onSelect }: ChatSuggestionsProps) {
  return (
    <div className="fixed bottom-12 left-0 right-0 pb-2 w-full pointer-events-none">
      <div className="flex gap-3 overflow-x-auto px-4 w-full scroll-hide pointer-events-auto">
        <style>
          {`
            .scroll-hide::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>

        <button
          onClick={() =>
            onSelect('계란과 양파로 만들 수 있는 간단한 요리 알려줘!')
          }
          className="bg-gray-100 shadow-sm rounded-xl px-3 py-2 flex-shrink-0 w-fit text-left"
        >
          <p className="text-sm text-gray-800">계란과 양파로 만들</p>
          <p className="text-xs text-gray-600">수 있는 간단한 요리 알려줘!</p>
        </button>

        <button
          onClick={() =>
            onSelect(
              '프라이팬 하나로 만들 수 있고, 설거지도 적게 나오는 요리 좀 추천해줘!',
            )
          }
          className="bg-gray-100 shadow-sm rounded-xl px-3 py-2 flex-shrink-0 w-fit text-left"
        >
          <p className="text-sm text-gray-800">프라이팬 하나로 만들 수 있고,</p>
          <p className="text-xs text-gray-600">
            설거지도 적게 나오는 요리 좀 추천해줘!
          </p>
        </button>

        <button
          onClick={() => onSelect('10분 안에 만들 수 있는 요리 알려줘!')}
          className="bg-gray-100 shadow-sm rounded-xl px-3 py-2 flex-shrink-0 w-fit text-left"
        >
          <p className="text-sm text-gray-800">10분 안에 만들 수 있는</p>
          <p className="text-xs text-gray-600">요리 알려줘!</p>
        </button>
      </div>
    </div>
  );
}
