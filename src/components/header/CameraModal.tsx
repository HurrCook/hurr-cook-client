import React, { useEffect, useRef, useState } from 'react';

type CameraModalProps = {
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
};

export default function CameraModal({ onClose, onCapture }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>(
    'environment',
  );
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async (mode: 'user' | 'environment') => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: 430, height: 932 },
        audio: false,
      });
      if (videoRef.current) videoRef.current.srcObject = newStream;
      setStream(newStream);
    } catch (err) {
      console.error('카메라 접근 실패:', err);
      alert('카메라 권한이 필요합니다.');
      onClose();
    }
  };

  useEffect(() => {
    void startCamera(facingMode);
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [facingMode]);

  const handleTakePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = 430;
    canvas.height = 932;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    onCapture(canvas.toDataURL('image/png'));
  };

  const handleSwitchCamera = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
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

        {/* 닫기 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute left-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white text-xl"
        >
          ✕
        </button>

        {/* 촬영 버튼 - 하단 중앙 */}
        <button
          onClick={handleTakePhoto}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 transform rounded-full border-[6px] border-white bg-white/10 p-2 z-20 active:scale-95 transition-transform"
        >
          <div className="h-16 w-16 rounded-full bg-white" />
        </button>

        {/* 전환 버튼 - 하단 우측 */}
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
