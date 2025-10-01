import React, { useRef, useEffect } from 'react';

type CameraModalProps = {
  onClose: () => void;
};

export default function CameraModal({ onClose }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 430 },
            height: { ideal: 932 },
            aspectRatio: 430 / 932,
          },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('카메라 접근 실패:', err);
        alert('카메라 권한이 필요합니다.');
        onClose();
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [onClose]);

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = 430;
    canvas.height = 932;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `capture_${Date.now()}.png`;
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex justify-center items-center z-50">
      {/* 카메라 뷰 */}
      <div className="relative w-[430px] h-[932px] bg-black overflow-hidden flex flex-col justify-between">
        {/* 비디오 */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none scale-x-[-1]"
        />

        {/* 상단 영역 */}
        <div className="relative z-20 flex justify-start p-4">
          <button
            onClick={onClose}
            className="bg-black/20 text-white w-8 h-8 flex items-center justify-center rounded-full text-xl"
          >
            ✕
          </button>
        </div>

        {/* 하단 영역 */}
        <div className="relative z-20 flex justify-center p-6">
          <button
            onClick={takePhoto}
            className="w-20 h-20 rounded-full border-4 border-white bg-black/40 flex items-center justify-center mb-10"
          >
            <div className="w-12 h-12 bg-white rounded-full" />
          </button>
        </div>
      </div>

      {/* 캔버스 */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
