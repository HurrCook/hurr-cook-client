import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

type ReceiptCameraModalProps = {
  onClose: () => void;
};

export default function ReceiptCameraModal({
  onClose,
}: ReceiptCameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>(
    'environment',
  );
  const [stream, setStream] = useState<MediaStream | null>(null);
  const navigate = useNavigate();

  /** ✅ 카메라 실행 */
  const startCamera = async (mode: 'user' | 'environment') => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: 430, height: 932 },
        audio: false,
      });
      if (videoRef.current) videoRef.current.srcObject = newStream;
      setStream(newStream);
      console.log('[ReceiptCameraModal] 카메라 시작:', mode);
    } catch (err) {
      console.error('[ReceiptCameraModal] 카메라 접근 실패:', err);
      alert('카메라 권한이 필요합니다.');
      onClose();
    }
  };

  useEffect(() => {
    void startCamera(facingMode);
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
      console.log('[ReceiptCameraModal] 스트림 종료');
    };
  }, [facingMode]);

  /** ✅ 촬영 시 영수증 로딩페이지로 이동 */
  const handleTakePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = 430;
    canvas.height = 932;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');

    console.log('[ReceiptCameraModal] 촬영 완료 → ReceiptLoadingPage 이동');
    console.log('[navigate state]', {
      base64_images: [dataUrl],
      type: 'receipt', // ✅ 추가
    });

    navigate('/receipt-loading', {
      state: {
        base64_images: [dataUrl],
        type: 'receipt', // ✅ 추가
      },
    });

    onClose();
  };

  /** ✅ 전후면 전환 */
  const handleSwitchCamera = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
    console.log(
      '[ReceiptCameraModal] 카메라 전환 →',
      facingMode === 'user' ? '후면' : '전면',
    );
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
      onClick={onClose}
    >
      <div
        className="relative h-[932px] w-[430px] overflow-hidden rounded-md bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute inset-0 h-full w-full object-cover z-0 pointer-events-none"
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute left-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white text-xl"
        >
          ✕
        </button>

        <button
          onClick={handleTakePhoto}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 transform rounded-full border-[6px] border-white bg-white/10 p-2 z-20 active:scale-95 transition-transform"
        >
          <div className="h-16 w-16 rounded-full bg-white" />
        </button>

        <button
          onClick={handleSwitchCamera}
          className="absolute bottom-24 right-16 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-black/40 text-white text-xl active:scale-95 transition-transform"
        >
          전환
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
