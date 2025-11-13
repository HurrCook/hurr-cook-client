import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Hurr1 from '@/assets/Hurr1.svg';
import axiosInstance from '@/lib/axios';
import axios from 'axios'; // ✅ axios import 추가
import './loading.css';

export default function ReceiptLoadingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const base64Images = location.state?.base64_images || [];

  const defaultReceiptImage = 'https://placehold.co/430x932?text=Receipt+Image';

  useEffect(() => {
    const analyzeReceipt = async () => {
      console.log('===============================');
      console.log('[ReceiptLoadingPage] 영수증 분석 시작');
      console.log('▶ base64Images 개수:', base64Images.length);
      console.log('===============================');

      if (!base64Images || base64Images.length === 0) {
        console.warn(
          '[ReceiptLoadingPage] base64Images가 비어 있음 → /fail 이동',
        );
        navigate('/fail');
        return;
      }

      try {
        console.log('[ReceiptLoadingPage] POST 요청 시작 → /chats/ocr');

        // 💡 API 호출 시, 데이터 전송 용량 제한 회피를 위해 설정 유지
        const { data, status } = await axiosInstance.post(
          'api/chats/ocr',
          { base64_images: base64Images },
          {
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
          },
        );

        console.log(
          `[ReceiptLoadingPage] API 응답 수신 완료 (Status: ${status})`,
        );
        console.log('▶ 응답 데이터:', data);

        const detected = data?.data?.ingredients ?? [];
        const hasDetected = Array.isArray(detected) && detected.length > 0;

        if (data?.success && hasDetected) {
          console.log(
            '[ReceiptLoadingPage] 감지 성공 → /refrigerator/photo-add 이동',
          );
          navigate('/refrigerator/photo-add', {
            state: {
              base64_images: [defaultReceiptImage],
              detected,
              type: 'ocr', // ✅ 영수증 명시
            },
          });
        } else {
          // 💡 API는 성공했으나 감지된 재료가 없는 경우
          console.warn(
            '[ReceiptLoadingPage] 감지 실패 (API 성공, 재료 0개) → /fail 이동',
          );
          navigate('/fail');
        }
      } catch (err) {
        // 💡 API 요청 자체에서 오류가 난 경우
        if (axios.isAxiosError(err)) {
          console.error(
            '[ReceiptLoadingPage] API 요청 실패:',
            err.response?.status,
            err.response?.data,
          );
        } else {
          console.error('[ReceiptLoadingPage] 기타 API 요청 중 오류:', err);
        }
        navigate('/fail');
      }
    };

    analyzeReceipt();
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
      <p className="text-[#FF8800] text-center text-base font-normal font-[Pretendard] leading-relaxed whitespace-pre-line">
        {'영수증을 분석 중이에요\n조금만 기다려주세요!'}
      </p>
    </div>
  );
}
