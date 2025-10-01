import React, { useState, useRef, useEffect } from 'react';
import Hurr1 from '@/assets/Hurr1.svg';
import ChatIcon from '@/assets/채팅.svg';
import OtherMessage from '@/components/chat/OtherMessage';
import MyMessage from '@/components/chat/MyMessage';
import HurrChat from '@/assets/HurrChat.png';
import ChatLoading from '@/assets/ChatLoading.png';
import ChatSuggestions from '@/components/chat/ChatSuggestions';

export default function ChatbotPage() {
  const [messages, setMessages] = useState<
    { id: number; type: string; text: string }[]
  >([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = (msg?: string) => {
    const text = msg ?? input.trim();
    if (!text) return;

    const userMsg = { id: messages.length + 1, type: 'me', text };
    setMessages((prev) => [...prev, userMsg]);

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

    setInput('');
  };

  return (
    <div className="relative w-full h-screen bg-white flex flex-col">
      {/* 중앙 안내 카드 */}
      <main className="flex-1 px-4 mt-20 pb-40 overflow-y-auto">
        {messages.length === 0 && !loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-40 h-44 bg-white rounded-xl flex items-center justify-center">
              <div className="flex flex-col items-center text-center mb-30">
                <img src={Hurr1} alt="후르" className="w-24 h-24 opacity-80" />
                <p className="mt-4 text-gray-700 text-sm font-pretendard leading-5">
                  후르에게 레시피 <br /> 추천을 받아볼까요?
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {messages.map((msg) =>
              msg.type === 'me' ? (
                <MyMessage key={msg.id} text={msg.text} />
              ) : (
                <OtherMessage key={msg.id} text={msg.text} profile={HurrChat} />
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
        )}
      </main>

      {/* ✅ 추천 멘트 (버튼 클릭 시 handleSend 호출) */}
      <ChatSuggestions onSelect={handleSend} />

      {/* 입력창 */}
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
