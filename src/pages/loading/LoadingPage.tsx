import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hurr1 from '@/assets/Hurr1.svg';
import './loading.css';

export default function LoadingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // 스크롤 잠금
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      navigate('/refrigerator/photo-add');
    }, 5000);

    return () => {
      document.body.style.overflow = prevOverflow || '';
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-white"
      style={{ transform: 'translateY(-5rem)' }}
    >
      {/* 상단 이미지 */}
      <img
        src={Hurr1}
        alt="후르 아이콘"
        className="w-[140px] h-[140px] mb-10"
      />

      {/* 4개의 점 — 양방향으로 늘어나는 순차 애니메이션 */}
      <div className="flex items-center justify-center gap-3 mb-6 h-6">
        <span className="dot" style={{ animationDelay: '0ms' }} />
        <span className="dot" style={{ animationDelay: '150ms' }} />
        <span className="dot" style={{ animationDelay: '300ms' }} />
        <span className="dot" style={{ animationDelay: '450ms' }} />
      </div>

      {/* 텍스트 */}
      <p className="text-[#FF8800] text-center text-base font-normal font-[Pretendard] leading-relaxed">
        사진을 살펴보는 중이에요
        <br />
        조금만 기다려주세요!
      </p>
    </div>
  );
}
