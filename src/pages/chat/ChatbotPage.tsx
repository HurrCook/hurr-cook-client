import React, { useState, useRef, useEffect } from 'react';
import ChatIcon from '@/assets/채팅.svg';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatEmptyCard from '@/components/chat/ChatEmptyCard';
import ChatSuggestions from '@/components/chat/ChatSuggestions';
import api from '@/lib/axios';

interface RecipeData {
  '레시피 명': string;
  '레시피 유형': string;
  카테고리: string;
  '필요 재료': { '재료 명': string; 양: number | string; 단위: string }[];
  '레시피 단계': string[];
  '조리 시간': string;
  추천점수: string;
}

interface Message {
  id: number;
  type: 'me' | 'recipe';
  text?: string;
  data?: RecipeData;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (msg?: string): Promise<void> => {
    const text = msg ?? input.trim();
    if (!text) return;

    const userMsg: Message = { id: messages.length + 1, type: 'me', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/chats', { 프롬프트: text });
      const { success, data, message } = res.data;

      if (success && data) {
        const recipeMsg: Message = {
          id: messages.length + 2,
          type: 'recipe',
          data,
        };
        setMessages((prev) => [...prev, recipeMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: messages.length + 2,
            type: 'me',
            text: message || '응답 형식이 올바르지 않습니다.',
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 2,
          type: 'me',
          text: '서버 오류가 발생했습니다.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-white flex flex-col">
      <main className="flex-1 px-4 pb-40 overflow-y-auto">
        {messages.length === 0 && !loading ? (
          <ChatEmptyCard />
        ) : (
          <ChatMessages
            messages={messages}
            loading={loading}
            messagesEndRef={messagesEndRef}
          />
        )}
      </main>

      <ChatSuggestions onSelect={handleSend} />

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
