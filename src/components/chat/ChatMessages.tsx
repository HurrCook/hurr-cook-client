import React from 'react';
import MyMessage from '@/components/chat/MyMessage';
import OtherMessage from '@/components/chat/OtherMessage';
import HurrChat from '@/assets/HurrChat.png';
import ChatLoading from '@/assets/ChatLoading.png';
import RecipeCard from '@/components/chat/RecipeCard';

// ChatMessages.tsx
type ChatMessagesProps = {
  messages: { id: number; type: string; text?: string }[];
  loading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
};

export default function ChatMessages({
  messages,
  loading,
  messagesEndRef,
}: ChatMessagesProps) {
  return (
    <div className="flex flex-col gap-1">
      {messages.map((msg, index) => {
        const prev = messages[index - 1];
        const isDifferentSender = !!prev && prev.type !== msg.type;
        const marginClass = isDifferentSender ? 'mt-4' : '';

        if (msg.type === 'recipe') {
          return (
            <div
              key={msg.id}
              className={`${marginClass} flex items-start gap-2`}
            >
              <img
                src={HurrChat}
                alt="후르 프로필"
                className="w-8 h-8 rounded-full"
              />
              <div className="max-w-[80%]">
                <RecipeCard
                  imageUrl="https://placehold.co/100x100"
                  title="피망 볶음밥"
                  ingredients="밥 200g, 피망 50g, 양파 30g, 대파 15g, 계란 1개, 간장 15mL, 굴소스 15mL, 식용유 15mL, 소금 0.5g, 후추 0.2g"
                  steps={`재료 손질하기: 피망, 양파, 대파를 잘게 썬다. 계란은 미리 풀어둔다.
계란 볶기: 팬에 기름을 두르고 계란을 스크램블처럼 살짝 익혀서 꺼내둔다.
야채 볶기: 팬에 기름을 두르고 대파 → 양파 → 피망 순서로 볶는다.
밥 넣기: 밥을 넣고 잘 풀어가며 볶는다.
양념하기: 간장, 굴소스, 소금, 후추를 넣고 볶는다.
계란 넣고 마무리: 아까 볶아놓은 계란을 다시 넣고 가볍게 섞어주면 완성!`}
                  onCook={() => alert('요리 시작!')}
                />
              </div>
            </div>
          );
        }

        return msg.type === 'me' ? (
          <div key={msg.id} className={marginClass}>
            <MyMessage
              text={msg.text ?? ''}
              className={index === 0 ? 'mt-20' : ''}
            />
          </div>
        ) : (
          <div key={msg.id} className={marginClass}>
            <OtherMessage
              text={msg.text ?? ''}
              profile={HurrChat}
              className={index === 0 ? 'mt-6' : ''}
            />
          </div>
        );
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
