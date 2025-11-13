// src/components/chat/ChatMessages.tsx
import React from 'react';
import { motion } from 'framer-motion';
import MyMessage from '@/components/chat/MyMessage';
import HurrChat from '@/assets/HurrChat.png';
import RecipeCard from '@/components/chat/RecipeCard';

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

interface RecipeData {
  title?: string;
  ingredients?: Ingredient[];
  steps?: string[];
  time?: string;
  calories?: string;
}

interface Message {
  id: string;
  type: 'me' | 'recipe' | 'system';
  text?: string;
  data?: RecipeData;
}

interface ChatMessagesProps {
  messages: Message[];
  loading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onRecipeSaved: () => void;
  onIngredientsUsed: () => void;
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
      {messages.map((msg, index) => {
        if (msg.type === 'recipe' && msg.data) {
          const d = msg.data;
          const ingredients =
            d.ingredients
              ?.map((i) => `${i.name} ${i.amount}${i.unit}`)
              .join(', ') || '재료 정보 없음';
          const steps = d.steps?.join('\n') || '조리 단계 정보 없음';

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="flex items-start gap-2 mt-4"
            >
              <img src={HurrChat} alt="후르" className="w-8 h-8 rounded-full" />
              <div className="max-w-[80%]">
                <RecipeCard
                  title={d.title || '이름 없는 레시피'}
                  ingredients={ingredients}
                  steps={steps}
                  time={d.time || ''}
                  calories={d.calories || ''}
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
              transition={{ duration: 0.25 }}
            >
              <MyMessage
                text={msg.text || ''}
                className={index === 0 ? 'mt-20' : 'mt-4'}
              />
            </motion.div>
          );
        }

        if (msg.type === 'system') {
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-2 mt-4"
            >
              <img src={HurrChat} alt="후르" className="w-8 h-8 rounded-full" />
              <div className="bg-gray-100 text-gray-700 text-sm rounded-2xl px-4 py-2 max-w-[75%] font-[Pretendard]">
                {msg.text}
              </div>
            </motion.div>
          );
        }

        return null;
      })}

      {loading && (
        <div className="flex items-center gap-2 mt-6">
          <img src={HurrChat} alt="후르" className="w-8 h-8 rounded-full" />
          <div className="w-[100px] h-[20px] bg-gray-200 animate-pulse rounded-full" />
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
