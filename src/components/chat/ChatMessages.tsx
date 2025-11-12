import React from 'react';
import { motion } from 'framer-motion';
import MyMessage from '@/components/chat/MyMessage';
import HurrChat from '@/assets/HurrChat.png';
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
    ingredients?: { name: string; amount: string | number; unit: string }[];
    steps?: string[];
  };
}

interface ChatMessagesProps {
  messages?: ChatMessageData[];
  loading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onRecipeSaved?: () => void;
  onIngredientsUsed?: () => void;
}

export default function ChatMessages({
  messages = [],
  loading,
  messagesEndRef,
  onRecipeSaved,
  onIngredientsUsed,
}: ChatMessagesProps) {
  return (
    <div className="flex flex-col gap-1">
      {Array.isArray(messages) &&
        messages.map((msg, index) => {
          if (msg.type === 'recipe' && msg.data) {
            const d = msg.data;
            const ingredients =
              d.ingredients
                ?.map((i) => `${i.name} ${i.amount}${i.unit ? i.unit : ''}`)
                .join(', ') || '재료 정보 없음';
            const steps = d.steps?.join('\n') || '조리 단계 정보 없음';

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className={`flex items-start gap-2 ${
                  index > 0 && messages[index - 1].type === 'me'
                    ? 'mt-6'
                    : 'mt-4'
                }`}
              >
                <img
                  src={HurrChat}
                  alt="후르 프로필"
                  className="w-8 h-8 rounded-full"
                />
                <div className="max-w-[80%]">
                  <RecipeCard
                    imageUrl="https://placehold.co/100x100"
                    title={d.title || '이름 없는 레시피'}
                    ingredients={ingredients}
                    steps={steps}
                    onSaved={onRecipeSaved}
                    onIngredientsUsed={onIngredientsUsed}
                  />
                </div>
              </motion.div>
            );
          }

          if (msg.type === 'me') {
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <MyMessage
                  text={msg.text ?? ''}
                  className={index === 0 ? 'mt-20' : 'mt-4'}
                />
              </motion.div>
            );
          }

          return null;
        })}

      {/* 로딩 중 */}
      {loading && (
        <div className="flex items-center gap-2 mt-6">
          <img
            src={HurrChat}
            alt="후르 프로필"
            className="w-8 h-8 rounded-full"
          />
          <div className="w-[100px] h-[20px] bg-gray-200 animate-pulse rounded-full" />
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
