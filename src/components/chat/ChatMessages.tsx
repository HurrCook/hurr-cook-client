import React from 'react';
import MyMessage from '@/components/chat/MyMessage';
import HurrChat from '@/assets/HurrChat.png';
import ChatLoading from '@/assets/ChatLoading.png';
import RecipeCard from '@/components/chat/RecipeCard';

interface ChatMessageData {
  id: number;
  type: 'me' | 'recipe';
  text?: string;
  data?: {
    title?: string;
    category?: string;
    cuisine_type?: string;
    time?: string;
    tools?: string[];
    ingredients?: { name: string; amount: string | number; units: string }[];
    steps?: string[];
  };
}

interface ChatMessagesProps {
  messages?: ChatMessageData[];
  loading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function ChatMessages({
  messages = [],
  loading,
  messagesEndRef,
}: ChatMessagesProps) {
  return (
    <div className="flex flex-col gap-1">
      {Array.isArray(messages) && messages.length > 0 ? (
        messages.map((msg, index) => {
          if (msg.type === 'recipe' && msg.data) {
            const d = msg.data;
            const ingredients =
              d.ingredients
                ?.map((i) => `${i.name} ${i.amount}${i.units ? i.units : ''}`)
                .join(', ') || '재료 정보 없음';
            const steps = d.steps?.join('\n') || '조리 단계 정보 없음';

            return (
              <div key={msg.id} className="flex items-start gap-2 mt-4">
                <img
                  src={HurrChat || undefined}
                  alt="후르 프로필"
                  className="w-8 h-8 rounded-full"
                />
                <div className="max-w-[80%]">
                  <RecipeCard
                    imageUrl="https://placehold.co/100x100"
                    title={d.title || '이름 없는 레시피'}
                    ingredients={ingredients}
                    steps={steps}
                  />
                </div>
              </div>
            );
          }

          if (msg.type === 'me')
            return (
              <div key={msg.id}>
                <MyMessage
                  text={msg.text ?? ''}
                  className={index === 0 ? 'mt-20' : ''}
                />
              </div>
            );

          return null;
        })
      ) : (
        <p className="text-gray-400 text-sm text-center mt-10">
          메시지가 없습니다.
        </p>
      )}

      {loading && (
        <div className="flex items-center gap-2 mt-6">
          <img
            src={HurrChat || undefined}
            alt="후르 프로필"
            className="w-8 h-8 rounded-full"
          />
          <img src={ChatLoading || undefined} alt="로딩중" className="h-5" />
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
