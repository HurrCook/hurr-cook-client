// src/pages/chat/ChatbotPage.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ChatIcon from '@/assets/채팅.svg';
import HurrChat from '@/assets/HurrChat.png';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatEmptyCard from '@/components/chat/ChatEmptyCard';
import ChatSuggestions from '@/components/chat/ChatSuggestions';
import RecipeSavedBanner from '@/components/chat/RecipeSavedBanner';
import IngredientUsedBanner from '@/components/chat/IngredientUsedBanner';
import api from '@/lib/axios';

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

interface RecipeData {
  title?: string;
  time?: string;
  calories?: string;
  ingredients: Ingredient[];
  steps?: string[];
}

interface Message {
  id: number;
  type: 'me' | 'system' | 'recipe';
  text?: string;
  data?: RecipeData;
}

const RecipeSkeletonCard = () => (
  <motion.div
    initial={{ opacity: 0, y: 25 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="flex items-start gap-2 mt-4"
  >
    <img src={HurrChat} alt="후르" className="w-8 h-8 rounded-full" />
    <div className="flex flex-col gap-2">
      <p className="text-gray-500 text-sm font-[Pretendard] mt-2">
        후르가 맛있는 레시피를 준비하고 있어요!
      </p>
      <div className="w-74 h-60 bg-gray-200 rounded-2xl animate-pulse" />
    </div>
  </motion.div>
);

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRecipeSkeleton, setShowRecipeSkeleton] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showUsedBanner, setShowUsedBanner] = useState(false);
  const [completionText, setCompletionText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const completionMessages = [
    '나도 한입만 주라 ㅠㅠ',
    '이 맛, 벌써부터 기대되지 않아?',
    '누가 봐도 오늘의 셰프는 너야!',
    '후르가 감탄 중... 진짜 맛있겠다!',
    '냉장고 재료가 이렇게 변신할 줄이야!',
    '사진 찍어 자랑해도 되겠어.',
    '따라하고 싶게 만드는 레시피.',
    '오늘 저녁, 완벽한 한 끼 완성!',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showRecipeSkeleton]);

  const handleSend = async (msg?: string) => {
    const text = msg ?? input.trim();
    if (!text) return;

    const userMsg: Message = { id: messages.length + 1, type: 'me', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setCompletionText('');

    const skeletonTimer = setTimeout(() => setShowRecipeSkeleton(true), 800);

    try {
      const res = await api.post('/api/chats', { message: text });
      clearTimeout(skeletonTimer);
      setShowRecipeSkeleton(false);

      const { success, data, message } = res.data as {
        success: boolean;
        data?: unknown;
        message?: string;
      };

      if (!success || !data) {
        setMessages((prev) => [
          ...prev,
          {
            id: messages.length + 2,
            type: 'system',
            text:
              message?.includes('냉장고') || message?.includes('재료') || !data
                ? '냉장고가 비어 있어요! 재료를 채워주세요!'
                : '레시피를 생성할 수 없어요. 다시 시도해주세요!',
          },
        ]);
        return;
      }

      const recipeData = data as Record<string, unknown> & {
        ingredients?: Record<string, unknown>[];
      };

      const normalizedData: RecipeData = {
        ...recipeData,
        time:
          (recipeData.time as string) ||
          (recipeData['조리시간'] as string) ||
          '',
        calories:
          (recipeData.calorie as string) ||
          (recipeData['칼로리'] as string) ||
          '',
        ingredients: Array.isArray(recipeData.ingredients)
          ? recipeData.ingredients.map((item) => ({
              name: String(item.name || item['재료명'] || ''),
              amount: Number(item.amount || item['양']) || 0,
              unit: String(item.unit || item['단위'] || ''),
            }))
          : [],
      };

      const recipeMsg: Message = {
        id: messages.length + 2,
        type: 'recipe',
        data: normalizedData,
      };

      setMessages((prev) => [...prev, recipeMsg]);

      const randomMessage =
        completionMessages[
          Math.floor(Math.random() * completionMessages.length)
        ];
      setCompletionText(randomMessage);
    } catch (err: unknown) {
      clearTimeout(skeletonTimer);
      setShowRecipeSkeleton(false);

      if (
        typeof err === 'object' &&
        err !== null &&
        (err as { response?: { status?: number } }).response?.status === 404
      ) {
        setMessages((prev) => [
          ...prev,
          {
            id: messages.length + 2,
            type: 'system',
            text: '냉장고가 비어 있어요! 재료를 채워 넣고 다시 시도해볼까요?',
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: messages.length + 2,
            type: 'system',
            text: '서버 오류가 발생했습니다.',
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeSaved = () => {
    setShowBanner(true);
    setTimeout(() => setShowBanner(false), 3000);
  };

  const handleIngredientsUsed = () => {
    setShowUsedBanner(true);
    setTimeout(() => setShowUsedBanner(false), 3000);
  };

  return (
    <div className="relative w-full h-screen bg-white flex flex-col">
      <main className="flex-1 px-4 pb-40 overflow-y-auto">
        {messages.length === 0 && !loading ? (
          <ChatEmptyCard />
        ) : (
          <>
            <ChatMessages
              messages={messages}
              loading={false}
              messagesEndRef={messagesEndRef}
              onRecipeSaved={handleRecipeSaved}
              onIngredientsUsed={handleIngredientsUsed}
            />

            {showRecipeSkeleton && <RecipeSkeletonCard />}

            {completionText && (
              <motion.p
                key={completionText}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-[#595959] text-[13px] font-[Pretendard] ml-10 mt-2"
              >
                {completionText}
              </motion.p>
            )}
          </>
        )}
      </main>

      <ChatSuggestions onSelect={handleSend} />

      <RecipeSavedBanner
        isVisible={showBanner}
        onHide={() => setShowBanner(false)}
        onClick={() => (window.location.href = '/recipe')}
      />
      <IngredientUsedBanner
        isVisible={showUsedBanner}
        onHide={() => setShowUsedBanner(false)}
      />

      <footer className="fixed bottom-0 left-0 right-0 px-4 py-2 bg-white">
        <div className="relative w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="메시지를 입력하세요..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none"
          />
          <button
            onClick={() => handleSend()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 active:scale-95 transition"
          >
            <img src={ChatIcon} alt="전송" className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
}
