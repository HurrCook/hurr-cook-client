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
    '레시피 명': string;
    '필요 재료': { '재료 명': string; 양: string | number; 단위: string }[];
    '레시피 단계': string[];
  };
}

interface ChatMessagesProps {
  messages: ChatMessageData[];
  loading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function ChatMessages({
  messages,
  loading,
  messagesEndRef,
}: ChatMessagesProps) {
  return (
    <div className="flex flex-col gap-1">
      {messages.map((msg, index) => {
        if (msg.type === 'recipe' && msg.data) {
          const d = msg.data;
          const ingredients = d['필요 재료']
            .map(
              (i) => `${i['재료 명']} ${i['양']}${i['단위'] ? i['단위'] : ''}`,
            )
            .join(', ');
          const steps = d['레시피 단계'].join('\n');

          return (
            <div key={msg.id} className="flex items-start gap-2 mt-4">
              <img
                src={HurrChat}
                alt="후르 프로필"
                className="w-8 h-8 rounded-full"
              />
              <div className="max-w-[80%]">
                <RecipeCard
                  imageUrl="https://placehold.co/100x100"
                  title={d['레시피 명']}
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
      })}

      {loading && (
        <div className="flex items-center gap-2 mt-6">
          <img
            src={HurrChat}
            alt="후르 프로필"
            className="w-8 h-8 rounded-full"
          />
          <img src={ChatLoading} alt="로딩중" className="h-5" />
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
