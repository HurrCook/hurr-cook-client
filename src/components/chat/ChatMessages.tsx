import React from 'react';
import MyMessage from '@/components/chat/MyMessage';
import OtherMessage from '@/components/chat/OtherMessage';
import HurrChat from '@/assets/HurrChat.png';
import ChatLoading from '@/assets/ChatLoading.png';

type ChatMessagesProps = {
  messages: { id: number; type: string; text: string }[];
  loading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
};

export default function ChatMessages({
  messages,
  loading,
  messagesEndRef,
}: ChatMessagesProps) {
  return (
    <div className="flex flex-col gap-2">
      {messages.map((msg, index) =>
        msg.type === 'me' ? (
          <MyMessage
            key={msg.id}
            text={msg.text}
            className={index === 0 ? 'mt-20' : ''}
          />
        ) : (
          <OtherMessage
            key={msg.id}
            text={msg.text}
            profile={HurrChat}
            className={index === 0 ? 'mt-6' : ''}
          />
        ),
      )}

      {loading && (
        <div className="flex items-center gap-2">
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
