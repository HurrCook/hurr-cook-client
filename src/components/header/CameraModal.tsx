import React, { useEffect, useRef } from 'react';

type CameraModalProps = {
  onClose: () => void;
  onCapture: (dataUrl: string) => void; // 촬영 결과를 dataURL로 부모에 전달
};

export default function CameraModal({ onClose, onCapture }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: 430, height: 932 },
          audio: false,
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error('카메라 접근 실패:', err);
        alert('카메라 권한이 필요합니다.');
        onClose();
      }
    };
    startCamera();

    return () => {
      const tracks = (
        videoRef.current?.srcObject as MediaStream | null
      )?.getTracks();
      tracks?.forEach((t) => t.stop());
    };
  }, [onClose]);

  const handleTakePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = 430;
    canvas.height = 932;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    onCapture(dataUrl); // 촬영만 하고 저장은 상위에서 확정 시점에!
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
      <div className="relative h-[932px] w-[430px] overflow-hidden rounded-md bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute inset-0 h-full w-full object-cover scale-x-[-1]"
        />

        {/* 닫기 */}
        <button
          onClick={onClose}
          className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white text-xl"
        >
          ✕
        </button>

        {/* 촬영 */}
        <button
          onClick={handleTakePhoto}
          className="absolute bottom-20 left-1/2 z-10 -translate-x-1/2 transform rounded-full border-[6px] border-white bg-white/10 p-2"
        >
          <div className="h-16 w-16 rounded-full bg-white" />
        </button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
