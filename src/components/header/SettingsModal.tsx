// src/components/header/SettingsModal.tsx
import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { AxiosError } from 'axios';

interface SettingsModalProps {
  onClose: () => void;
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  // 초기 사용자 설정 불러오기
  useEffect(() => {
    const fetchUserPreference = async () => {
      try {
        const res = await api.get('/api/users');
        if (res.data.success && res.data.data?.personalPreference) {
          setInputValue(res.data.data.personalPreference);
        }
      } catch (error: unknown) {
        const err = error as AxiosError;
        if (err.response) console.error('[GET /users 오류]', err.response.data);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUserPreference();
  }, []);

  // 저장 요청
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await api.post('/api/users', {
        personalPreference: inputValue.trim(),
      });

      if (res.data.success) {
        setStatusMessage('저장되었습니다.');
      } else {
        setStatusMessage(res.data.message || '저장에 실패했습니다.');
      }
    } catch (error: unknown) {
      const err = error as AxiosError;
      if (err.response) console.error('[POST /users 오류]', err.response.data);
      setStatusMessage('서버 요청 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      onClose();
    }
  };

  if (initialLoading) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20">
        <div className="bg-white rounded-2xl shadow-md px-10 py-6 text-[#555] text-sm">
          불러오는 중...
        </div>
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/20"
      onClick={onClose}
    >
      <div
        className="relative w-[90%] h-[70vh] bg-white rounded-xl shadow-lg flex flex-col p-5 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 내용 스크롤 가능 영역 */}
        <div className="flex-1 overflow-y-auto pr-1">
          {/* 타이틀 */}
          <h2 className="text-[#212121] text-[20px] font-pretendard font-normal">
            개인 맞춤 설정
          </h2>

          {/* 설명 */}
          <p className="mt-1 text-[#595959] text-[14px] font-pretendard font-normal">
            레시피 추천에 후르가 참고할 정보가 있다면 말해주세요!
          </p>

          {/* 입력 영역 */}
          <textarea
            className="mt-5 w-full min-h-[51vh] border border-[#BEBEBE] rounded-xl p-3 resize-none focus:outline-none text-[15px] text-[#313131] leading-relaxed"
            placeholder="예: 매운 음식을 좋아하지 않아요. 단백질 위주로 추천해주세요."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setStatusMessage('');
            }}
          />

          {/* 상태 메시지 */}
          {statusMessage && (
            <p className="mt-3 text-center text-[13px] text-[#888888] font-pretendard">
              {statusMessage}
            </p>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="sticky left-0 w-full flex justify-between bg-gradient-to-t from-white via-white/95 to-transparent">
          <button
            onClick={onClose}
            className="px-10 py-2 bg-[#EDEDED] text-[#777777] text-[15px] font-pretendard font-normal rounded-xl disabled:opacity-50"
            disabled={loading}
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-10 py-2 bg-[#FF8800] text-white text-[15px] font-pretendard font-normal rounded-xl disabled:opacity-50"
            disabled={loading}
          >
            {loading ? '저장 중...' : '적용'}
          </button>
        </div>
      </div>
    </div>
  );
}
