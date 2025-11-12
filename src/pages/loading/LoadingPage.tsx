import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Hurr1 from '@/assets/Hurr1.svg';
import axiosInstance from '@/lib/axios';
import './loading.css';

export default function LoadingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const base64Images = location.state?.base64_images || [];

  useEffect(() => {
    const analyzeImage = async () => {
      if (!base64Images || base64Images.length === 0) {
        navigate('/fail');
        return;
      }

      try {
        const { data } = await axiosInstance.post('/chats/yolo', {
          base64_images: base64Images,
        });

        const detected = data?.data?.ingredients ?? [];
        const hasDetected = Array.isArray(detected) && detected.length > 0;

        if (data?.success && hasDetected) {
          navigate('/refrigerator/photo-add', {
            state: { base64_images: base64Images, detected },
          });
        } else {
          navigate('/fail');
        }
      } catch {
        navigate('/fail');
      }
    };

    analyzeImage();
  }, [base64Images, navigate]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-white"
      style={{ transform: 'translateY(-5rem)' }}
    >
      <img
        src={Hurr1}
        alt="후르 아이콘"
        className="w-[140px] h-[140px] mb-10"
      />

      <div className="flex items-center justify-center gap-3 mb-6 h-6">
        <span className="dot" style={{ animationDelay: '0ms' }} />
        <span className="dot" style={{ animationDelay: '150ms' }} />
        <span className="dot" style={{ animationDelay: '300ms' }} />
        <span className="dot" style={{ animationDelay: '450ms' }} />
      </div>

      <p className="text-[#FF8800] text-center text-base font-normal font-[Pretendard] leading-relaxed">
        사진을 살펴보는 중이에요
        <br />
        조금만 기다려주세요!
      </p>
    </div>
  );
}
