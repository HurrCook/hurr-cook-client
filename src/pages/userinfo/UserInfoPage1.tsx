import React, { useRef, useState, useEffect } from 'react';
import FooterButton from '/src/components/common/FooterButton';
import CameraModal from '/src/components/header/CameraModal';
import ImageOptionsModal from '/src/components/modal/ImageOptionsModal';
import ImagePreviewModal from '/src/components/modal/ImagePreviewModal';
import axiosInstance from '@/apis/axiosInstance';
import { useNavigate } from 'react-router-dom';

export default function UserInfoPage1() {
  const navigate = useNavigate();

  // 모달 상태
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // 이미지 관련 상태
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const [uploadedUrl] = useState<string | null>(null);
  const [displaySrc, setDisplaySrc] = useState<string | null>(null);

  const galleryObjectUrlRef = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** 옵션 모달 열고 닫기 */
  const handleOpenOptions = () => setIsOptionsOpen(true);
  const handleCloseOptions = () => setIsOptionsOpen(false);

  /** 카메라 열기 */
  const handleLaunchCamera = () => {
    handleCloseOptions();
    setIsCameraOpen(true);
  };

  /** 갤러리 열기 */
  const handleLaunchLibrary = () => {
    handleCloseOptions();
    fileInputRef.current?.click();
  };

  /** 갤러리 파일 선택 → base64 변환 후 전송 */
  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 썸네일 표시용 objectURL
    const objectUrl = URL.createObjectURL(file);
    galleryObjectUrlRef.current = objectUrl;
    setDisplaySrc(objectUrl);

    try {
      const base64 = await fileToBase64(file);
      await uploadToServer(base64);
    } catch (err) {
      console.error('❌ 갤러리 업로드 실패:', err);
      alert('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  /** 파일 → base64 문자열 변환 */
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  /** 카메라 촬영 완료 시 → 미리보기 모달 */
  const handleCapturedFromCamera = (dataUrl: string) => {
    setCapturedDataUrl(dataUrl);
    setIsCameraOpen(false);
    setIsPreviewOpen(true);
  };

  /** 다시 촬영하기 */
  const handleRetake = () => {
    setIsPreviewOpen(false);
    setIsCameraOpen(true);
  };

  /** ✅ base64 업로드 요청 (AI 서버 형식에 맞게 수정됨) */
  const uploadToServer = async (base64DataUrl: string) => {
    try {
      // 1️⃣ data:image/png;base64, 제거
      const base64 = base64DataUrl.split(',')[1];

      // 2️⃣ 백엔드 요구 스키마에 맞게 body 구성
      const payload = { base64_image: base64 };

      // 3️⃣ 요청 전송
      const { data } = await axiosInstance.post('/chats/yolo', payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('✅ YOLO 응답:', data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(
          '❌ YOLO 업로드 실패:',
          err.response?.data || err.message,
        );
      } else if (err instanceof Error) {
        console.error('❌ YOLO 업로드 실패:', err.message);
      } else {
        console.error('❌ YOLO 업로드 실패: 알 수 없는 오류', err);
      }
      alert('이미지 업로드 중 오류가 발생했습니다.');
    }
  };

  /** ✅ 미리보기에서 확정 → base64 업로드 */
  const handleConfirmPreview = async () => {
    if (!capturedDataUrl) return;
    setDisplaySrc(capturedDataUrl); // 즉시 미리보기 반영
    setIsPreviewOpen(false);
    await uploadToServer(capturedDataUrl);
  };

  /** 다음으로 버튼 */
  const handleNext = () => {
    if (!uploadedUrl && !displaySrc) {
      alert('이미지를 먼저 업로드해주세요.');
      return;
    }
    navigate('/userinfopage1_2');
  };

  /** ObjectURL 메모리 정리 */
  useEffect(() => {
    return () => {
      if (galleryObjectUrlRef.current) {
        URL.revokeObjectURL(galleryObjectUrlRef.current);
      }
    };
  }, []);

  return (
    <div className="relative h-full w-full">
      {/* 카메라 모달 */}
      {isCameraOpen && (
        <CameraModal
          onClose={() => setIsCameraOpen(false)}
          onCapture={handleCapturedFromCamera}
        />
      )}

      {/* 미리보기 모달 */}
      {isPreviewOpen && capturedDataUrl && (
        <ImagePreviewModal
          imageDataUrl={capturedDataUrl}
          onClose={() => setIsPreviewOpen(false)}
          onRetake={handleRetake}
          onConfirm={handleConfirmPreview}
        />
      )}

      {/* 옵션 모달 */}
      <ImageOptionsModal
        isVisible={isOptionsOpen}
        onClose={handleCloseOptions}
        onLaunchCamera={handleLaunchCamera}
        onLaunchLibrary={handleLaunchLibrary}
      />

      {/* 파일 입력 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* 안내 문구 */}
      <div className="mt-[18.5px] flex w-full justify-center">
        <div className="w-74 flex flex-col items-center justify-start gap-[23px] p-2.5">
          <div className="font-['Gretoon'] text-[32px] font-normal text-amber-500">
            Hurr Cook
          </div>
          <div className="text-center font-['Pretendard'] text-base font-normal text-amber-500">
            AI 레시피 추천 서비스를 이용하기 위해
            <br />
            아래 버튼을 클릭하여 재료를 추가해 주세요!
          </div>
        </div>
      </div>

      {/* 썸네일 박스 */}
      <div
        className="absolute aspect-square w-[37.20%] cursor-pointer overflow-hidden rounded-lg"
        style={{ left: '8.60%', top: '171px' }}
        onClick={handleOpenOptions}
      >
        <img
          className="h-full w-full object-cover"
          src={displaySrc || '/src/assets/ingredient_add_image.svg'}
          alt="재료 썸네일"
        />
      </div>

      {/* 하단 버튼 */}
      <div className="fixed inset-x-0 bottom-0 flex h-[15.99%] flex-col items-center bg-gradient-to-b from-white/0 to-white backdrop-blur-[2px]">
        <div className="h-[26.17%] w-full" />
        <FooterButton className="h-[32.21%] w-[82.79%]" onClick={handleNext}>
          다음으로
        </FooterButton>
        <div className="w-full flex-1" />
      </div>
    </div>
  );
}
