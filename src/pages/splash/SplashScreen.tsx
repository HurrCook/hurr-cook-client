import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthed } from '@/lib/auth';
import Hurricon from '/src/assets/Hurr1.svg';

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
    <div className="flex justify-center items-center min-h-screen">
      {/* 앱 프레임 */}
      <div className="relative px-21 w-screen h-screen bg-gradient-to-b from-[#FFB53F] to-[#FF8800] flex flex-col items-center overflow-hidden">
        <div className="absolute top-[28.15%] flex flex-col items-center">
          <img className="flex max-w-62 mb-[2.5%] " src={Hurricon} />
          <div className="text-[38.4px] justify-center text-white font-normal font-['Gretoon']">
            Hurr Cook
          </div>
        </div>
      </div>
    </div>
  );
}
