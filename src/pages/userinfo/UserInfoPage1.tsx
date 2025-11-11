// /src/pages/userinfo/UserInfoPage1.tsx
import React, { useRef, useState } from 'react';
import FooterButton from '/src/components/common/FooterButton';
import CameraModal from '/src/components/header/CameraModal';
import ImageOptionsModal from '/src/components/modal/ImageOptionsModal';
import axiosInstance from '@/apis/axiosInstance';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export type DetectedIngredient = {
  id: string;
  name: string;
  quantity: number;
  unit: 'EA' | 'g' | 'ml';
  image?: string; // base64 (dataURL or raw) or URL
};

// 백엔드 YOLO 응답 단일 아이템 타입
type BackendIngredient = {
  name?: string;
  amount?: number | string;
  crop_image?: string[]; // base64 문자열 배열
  unit?: string;
};

export default function UserInfoPage1() {
  const navigate = useNavigate();

  // 모달 상태
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // 이미지 상태(사용자가 추가한 원본 이미지들 dataURL)
  const [images, setImages] = useState<string[]>([]);

  // YOLO 감지 결과 누적
  const [detectedIngredients, setDetectedIngredients] = useState<
    DetectedIngredient[]
  >([]);

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

  /** 파일 → base64 문자열(DataURL) 변환 */
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  /** 동일 이름 재료 수량 합치기 */
  const mergeByName = (
    prev: DetectedIngredient[],
    incoming: DetectedIngredient[],
  ): DetectedIngredient[] => {
    const map = new Map<string, DetectedIngredient>();

    // 기존 항목 먼저 입력
    for (const item of prev) {
      const key = item.name.trim();
      map.set(key, { ...item });
    }

    // 새 항목 합산
    for (const item of incoming) {
      const key = item.name.trim();
      if (map.has(key)) {
        const exist = map.get(key)!;
        if (exist.unit !== item.unit) {
          console.warn(
            `[merge] 단위 불일치: '${exist.name}' (${exist.unit} vs ${item.unit}). 수량만 합산합니다.`,
          );
        }
        map.set(key, {
          ...exist,
          quantity: Number(exist.quantity) + Number(item.quantity ?? 0),
        });
      } else {
        map.set(key, { ...item, quantity: Number(item.quantity ?? 0) });
      }
    }

    return Array.from(map.values());
  };

  /** YOLO 호출 (하나의 base64 이미지에 대해 즉시 전송) */
  const detectOne = async (base64DataUrl: string) => {
    try {
      const base64 = base64DataUrl.split(',')[1]; // data:image/...;base64, 제거
      const payload = { base64_image: base64 };

      const { data } = await axiosInstance.post('/chats/yolo', payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log('✅ YOLO 전체 응답:', data);

      const rawIngredients: unknown = data?.data?.ingredients ?? [];

      if (Array.isArray(rawIngredients)) {
        rawIngredients.forEach((item: BackendIngredient, idx: number) => {
          const name = typeof item.name === 'string' ? item.name : '이름없음';
          const amount =
            typeof item.amount === 'number'
              ? item.amount
              : Number(item.amount) || 0;
          const cropImage = Array.isArray(item.crop_image)
            ? item.crop_image
            : [];
          console.log(
            `📦 [${idx}] 재료명:`,
            name,
            '\n📏 수량:',
            amount,
            '\n🖼️ crop_image 배열 길이:',
            cropImage.length,
          );
        });
      }

      // 구조 변환 (crop_image 배열 → 첫 번째 이미지만 사용)
      const incoming: DetectedIngredient[] = Array.isArray(rawIngredients)
        ? rawIngredients.map((item: BackendIngredient, idx: number) => {
            const name = typeof item.name === 'string' ? item.name : '재료';
            const amount =
              typeof item.amount === 'number'
                ? item.amount
                : Number(item.amount) || 1;
            const cropImageArr = Array.isArray(item.crop_image)
              ? item.crop_image
              : [];
            const firstImage = cropImageArr[0];

            return {
              id: `${Date.now()}_${Math.random()}_${idx}`,
              name,
              quantity: amount,
              unit: 'EA',
              image: firstImage, // base64(raw) or dataURL. 표시 시 처리 가능
            };
          })
        : [];

      setDetectedIngredients((prev) => mergeByName(prev, incoming));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error('[YOLO] 업로드 실패:', err.response?.data || err.message);
      } else if (err instanceof Error) {
        console.error('[YOLO] 업로드 실패:', err.message);
      } else {
        console.error('[YOLO] 업로드 실패: 알 수 없는 오류', err);
      }
    }
  };

  /** ✅ 카메라에서 캡처 → 즉시 서버 전송 */
  const handleCapturedFromCamera = async (dataUrl: string) => {
    setIsCameraOpen(false);
    // 먼저 화면에 썸네일 반영
    setImages((prev) => [...prev, dataUrl]);
    // 즉시 YOLO 호출
    await detectOne(dataUrl);
  };

  /** ✅ 갤러리 파일 선택 → 즉시 서버 전송 */
  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e,
  ) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    for (const file of files) {
      try {
        const base64 = await fileToBase64(file);
        setImages((prev) => [...prev, base64]); // 먼저 표시
        await detectOne(base64); // 즉시 YOLO 요청
      } catch (err) {
        console.error('❌ 갤러리 업로드 실패:', err);
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /** 다음으로 이동 (감지 결과 들고가기) */
  const handleNext = () => {
    if (images.length === 0) {
      alert('이미지를 먼저 업로드하거나 촬영해 주세요.');
      return;
    }
    navigate('/userinfopage1_2', {
      state: { ingredients: detectedIngredients, images },
    });
  };

  return (
    // ✅ 전체 세로 플렉스 컨테이너, 가운데 영역만 스크롤
    <div className="relative flex h-full w-full flex-col">
      {/* 카메라 모달 */}
      {isCameraOpen && (
        <CameraModal
          onClose={() => setIsCameraOpen(false)}
          onCapture={handleCapturedFromCamera} // 미리보기 없이 즉시 detect
        />
      )}

      {/* 옵션 모달 */}
      <ImageOptionsModal
        isVisible={isOptionsOpen}
        onClose={handleCloseOptions}
        onLaunchCamera={handleLaunchCamera}
        onLaunchLibrary={handleLaunchLibrary}
      />

      {/* 파일 입력 (다중 선택 지원) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {/* ✅ 스크롤 컨테이너: 그리드가 여기에 들어감 */}
      <div
        className="flex w-full justify-center overflow-y-auto"
        style={{
          marginTop: '0.5px', // UserInfoPage2와 시작 오프셋 맞춤
          paddingTop: '24px', // 상단 텍스트(레이아웃)에 맞는 간격
          paddingBottom: '16vh', // 🔒 푸터 높이만큼 하단 여백
        }}
      >
        <div className="w-[86.98%]">
          <div className="grid grid-cols-3 gap-3">
            {/* 추가 타일 */}
            <button
              type="button"
              onClick={handleOpenOptions}
              className="aspect-square rounded-lg overflow-hidden border border-dashed border-amber-400 flex items-center justify-center hover:bg-amber-50"
            >
              <img
                src="/src/assets/ingredient_add_image.svg"
                alt="재료 추가"
                className="h-full w-full object-cover"
              />
            </button>

            {/* 업로드된 이미지들 */}
            {images.map((src, idx) => (
              <div
                key={idx}
                className="aspect-square rounded-lg overflow-hidden"
              >
                <img
                  src={src}
                  alt={`uploaded-${idx}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 고정 푸터 (블러 영역) */}
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
