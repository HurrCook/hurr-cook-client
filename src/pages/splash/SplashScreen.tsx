import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthed } from '@/lib/auth';

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
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <p className="mt-4 text-textLight">스플래시 페이지입니다</p>
    </div>
  );
}
