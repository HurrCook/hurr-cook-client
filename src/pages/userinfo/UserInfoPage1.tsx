import React, { useRef, useState } from 'react';
import FooterButton from '/src/components/common/FooterButton';
import CameraModal from '/src/components/header/CameraModal';
import ImageOptionsModal from '/src/components/modal/ImageOptionsModal';
import ImagePreviewModal from '/src/components/modal/ImagePreviewModal';
import axiosInstance from '@/apis/axiosInstance';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export type DetectedIngredient = {
  id: string;
  name: string;
  quantity: number;
  unit: 'EA' | 'g' | 'ml';
  image?: string;
};

export default function UserInfoPage1() {
  const navigate = useNavigate();

  // 모달 상태
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // 이미지 상태
  const [images, setImages] = useState<string[]>([]); // dataURL 배열
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null); // 카메라 미리보기 용

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

  /** 파일 → base64 문자열 변환 */
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

    for (const item of prev) {
      const key = item.name.trim();
      map.set(key, { ...item });
    }

    for (const item of incoming) {
      const key = item.name.trim();
      if (map.has(key)) {
        const exist = map.get(key)!;
        if (exist.unit !== item.unit) {
          console.warn(
            `[merge] 단위 불일치 감지: '${exist.name}' (${exist.unit} vs ${item.unit}). 일단 수량만 합산합니다.`,
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

  /** YOLO 호출 (하나의 base64 이미지에 대해) */
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
        rawIngredients.forEach((item: Record<string, unknown>, idx) => {
          const name = typeof item.name === 'string' ? item.name : '이름없음';
          const amount =
            typeof item.amount === 'number'
              ? item.amount
              : Number(item.amount) || 0;
          const cropImage = Array.isArray(item.crop_image)
            ? (item.crop_image as string[])
            : [];

          console.log(
            `📦 [${idx}] 재료명:`,
            name,
            '\n📏 수량:',
            amount,
            '\n🖼️ crop_image 배열:',
            cropImage,
          );
        });
      }

      const incoming: DetectedIngredient[] = Array.isArray(rawIngredients)
        ? rawIngredients.map((item, idx) => {
            const asAny = item as Record<string, unknown>;
            const name = typeof asAny.name === 'string' ? asAny.name : '재료';
            const amount =
              typeof asAny.amount === 'number'
                ? asAny.amount
                : Number(asAny.amount) || 1;
            const cropImage = Array.isArray(asAny.crop_image)
              ? (asAny.crop_image as string[])
              : [];
            const firstImage = cropImage[0] ?? undefined;

            return {
              id: `${Date.now()}_${Math.random()}_${idx}`,
              name,
              quantity: amount,
              unit: 'EA',
              image: firstImage,
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

  /** 갤러리 파일 선택 → 여러 장 처리 */
  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e,
  ) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    for (const file of files) {
      try {
        const base64 = await fileToBase64(file);
        setImages((prev) => [...prev, base64]); // 그리드에 표시
        await detectOne(base64); // 감지 + 병합 누적
      } catch (err) {
        console.error('❌ 갤러리 업로드 실패:', err);
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  /** 카메라 촬영 완료 → 미리보기 모달 */
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

  /** 미리보기 확정 → images에 추가 + YOLO 호출(병합) */
  const handleConfirmPreview = async () => {
    if (!capturedDataUrl) return;
    const img = capturedDataUrl;
    setIsPreviewOpen(false);
    setImages((prev) => [...prev, img]);
    await detectOne(img);
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
    // ✅ 전체를 세로 플렉스 컨테이너로 만들고, 가운데 영역만 스크롤되게
    <div className="relative flex h-full w-full flex-col">
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
          marginTop: '0.5px', // UserInfoPage2와 동일한 시작 오프셋
          paddingTop: '24px', // HurrCook 텍스트와 간격 맞춤
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
