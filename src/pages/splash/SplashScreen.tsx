import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthed } from '@/lib/auth';
import Hurricon from '@/assets/Hurr1.svg';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      if (isAuthed()) {
        navigate('/chat', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }, 1000); // 1초 스플래시
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div
      className="flex justify-center items-center"
      style={{
        minHeight: '100vh',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div
        className="relative px-21 w-full h-full flex flex-col items-center overflow-hidden"
        style={{
          background: 'linear-gradient(to bottom, #FFB53F, #FF8800)',
        }}
      >
        <div className="absolute top-[28.15%] flex flex-col items-center">
          <img className="flex max-w-62 mb-[2.5%]" src={Hurricon} />
          <div className="text-[38.4px] text-white font-normal font-['Gretoon']">
            Hurr Cook
          </div>
        </div>
      </div>
    </div>
  );
}
