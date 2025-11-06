import React, { useState, useRef, useEffect } from 'react';
import ChatIcon from '@/assets/채팅.svg';
import ChatMessages from '@/components/chat/ChatMessages';
import ChatEmptyCard from '@/components/chat/ChatEmptyCard';
import ChatSuggestions from '@/components/chat/ChatSuggestions';

interface Message {
  id: number;
  type: 'me' | 'other' | 'recipe';
  text?: string;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = (msg?: string) => {
    const text = msg ?? input.trim();
    if (!text) return;

    const userMsg: Message = { id: messages.length + 1, type: 'me', text };
    setMessages((prev) => [...prev, userMsg]);

    // "후르" 입력 시 응답
    if (text === '후르') {
      setLoading(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: prev.length + 1, type: 'other', text: '안녕하세요!' },
        ]);
        setLoading(false);
      }, 1500);
    }

    // "레시피" 입력 시 레시피 카드 표시
    if (text === '레시피') {
      setLoading(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { id: prev.length + 1, type: 'recipe' },
        ]);
        setLoading(false);
      }, 500);
    }

    setInput('');
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
