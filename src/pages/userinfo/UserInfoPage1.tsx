// src/pages/userinfo/UserInfoPage1.tsx
/*import React, { useRef, useState } from 'react';
import FooterButton from '@/components/common/FooterButton';
import CameraModal from '@/components/header/CameraModal';
import ImageOptionsModal from '@/components/modal/ImageOptionsModal';
import axiosInstance from '@/apis/axiosInstance';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ingredientAdd from '@/assets/ingredient_add_image.svg';

export type DetectedIngredient = {
  id: string;
  name: string;
  quantity: number;
  unit: 'EA' | 'g' | 'ml';
  image?: string;
};

type BackendIngredient = {
  name?: string;
  amount?: number | string;
  crop_image?: string[];
  unit?: string;
};

export default function UserInfoPage1() {
  const navigate = useNavigate();
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [detectedIngredients, setDetectedIngredients] = useState<
    DetectedIngredient[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenOptions = () => setIsOptionsOpen(true);
  const handleCloseOptions = () => setIsOptionsOpen(false);
  const handleLaunchCamera = () => {
    handleCloseOptions();
    setIsCameraOpen(true);
  };
  const handleLaunchLibrary = () => {
    handleCloseOptions();
    fileInputRef.current?.click();
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const mergeByName = (
    prev: DetectedIngredient[],
    incoming: DetectedIngredient[],
  ): DetectedIngredient[] => {
    const map = new Map<string, DetectedIngredient>();
    for (const item of prev) map.set(item.name.trim(), { ...item });
    for (const item of incoming) {
      const key = item.name.trim();
      if (map.has(key)) {
        const exist = map.get(key)!;
        if (exist.unit !== item.unit) {
          console.warn(
            `[merge] 단위 불일치: '${exist.name}' (${exist.unit} vs ${item.unit})`,
          );
        }
        map.set(key, {
          ...exist,
          quantity: Number(exist.quantity) + Number(item.quantity ?? 0),
        });
      } else map.set(key, { ...item, quantity: Number(item.quantity ?? 0) });
    }
    return Array.from(map.values());
  };

  const detectOne = async (base64DataUrl: string) => {
    try {
      const pureBase64 = base64DataUrl.startsWith('data:')
        ? base64DataUrl.split(',')[1]
        : base64DataUrl;
      const payload = { base64_images: [pureBase64] };
      const { data } = await axiosInstance.post('/chats/yolo', payload, {
        headers: { 'Content-Type': 'application/json' },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });
      console.log('✅ YOLO 전체 응답:', data);
      const rawIngredients: BackendIngredient[] = data?.data?.ingredients ?? [];
      const incoming: DetectedIngredient[] = rawIngredients.map((item, idx) => {
        const name = typeof item.name === 'string' ? item.name : '재료';
        const amount =
          typeof item.amount === 'number'
            ? item.amount
            : Number(item.amount) || 1;
        const cropImageArr = Array.isArray(item.crop_image)
          ? item.crop_image
          : [];
        const firstImage = cropImageArr[0];
        const imageUrl = firstImage
          ? `data:image/jpeg;base64,${firstImage}`
          : undefined;
        return {
          id: `${Date.now()}_${Math.random()}_${idx}`,
          name,
          quantity: amount,
          unit: 'EA',
          image: imageUrl,
        };
      });
      setDetectedIngredients((prev) => mergeByName(prev, incoming));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(
          '[YOLO] 업로드 실패:',
          err.response?.status,
          err.response?.data,
        );
      } else if (err instanceof Error) {
        console.error('[YOLO] 업로드 실패:', err.message);
      } else {
        console.error('[YOLO] 알 수 없는 오류:', err);
      }
    }
  };

  const handleCapturedFromCamera = async (dataUrl: string) => {
    setIsCameraOpen(false);
    setImages((prev) => [...prev, dataUrl]);
    await detectOne(dataUrl);
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
    e,
  ) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    for (const file of files) {
      try {
        const base64 = await fileToBase64(file);
        setImages((prev) => [...prev, base64]);
        await detectOne(base64);
      } catch (err) {
        console.error('❌ 갤러리 업로드 실패:', err);
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleNext = () => {
    if (images.length === 0) {
      console.log('이미지가 없어서 이동하지 않음');
      return;
    }
    navigate('/userinfopage1_2', {
      state: { ingredients: detectedIngredients, images },
    });
  };

  return (
    <div className="relative flex h-full w-full flex-col">
      {isCameraOpen && (
        <CameraModal
          onClose={() => setIsCameraOpen(false)}
          onCapture={handleCapturedFromCamera}
        />
      )}

      <ImageOptionsModal
        isVisible={isOptionsOpen}
        onClose={handleCloseOptions}
        onLaunchCamera={handleLaunchCamera}
        onLaunchLibrary={handleLaunchLibrary}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <div
        className="flex w-full justify-center overflow-y-auto"
        style={{
          marginTop: '0.5px',
          paddingTop: '24px',
          paddingBottom: '16vh',
        }}
      >
        <div className="w-[86.98%]">
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={handleOpenOptions}
              className="aspect-square rounded-lg overflow-hidden border border-dashed border-amber-400 flex items-center justify-center hover:bg-amber-50"
            >
              <img
                src={ingredientAdd}
                alt="재료 추가"
                className="h-full w-full object-cover"
              />
            </button>

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

      <div className="fixed inset-x-0 bottom-0 flex h-[15.99%] flex-col items-center bg-gradient-to-b from-white/0 to-white backdrop-blur-[2px]">
        <div className="h-[26.17%] w-full" />
        <FooterButton className="h-[32.21%] w-[82.79%]" onClick={handleNext}>
          다음으로
        </FooterButton>
        <div className="w-full flex-1" />
      </div>
    </div>
  );
}*/

import React, { useRef, useState } from 'react';
import FooterButton from '@/components/common/FooterButton';
//import CameraModal from '@/components/header/CameraModal'; // 💡 이 파일은 이제 사용되지 않지만, import만 남겨둡니다.
import ImageOptionsModal from '@/components/modal/ImageOptionsModal';
import axiosInstance from '@/apis/axiosInstance';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ingredientAdd from '@/assets/ingredient_add_image.svg';

export type DetectedIngredient = {
  id: string;
  name: string;
  quantity: number;
  unit: 'EA' | 'g' | 'ml';
  image?: string;
};

type BackendIngredient = {
  name?: string;
  amount?: number | string;
  crop_image?: string[];
  unit?: string;
};

export default function UserInfoPage1() {
  const navigate = useNavigate();
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  // const [isCameraOpen, setIsCameraOpen] = useState(false); // ❌ CameraModal 관련 State 제거
  const [images, setImages] = useState<string[]>([]);
  const [detectedIngredients, setDetectedIngredients] = useState<
    DetectedIngredient[]
  >([]);

  // ✅ 카메라 및 라이브러리용 Ref 분리
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const libraryInputRef = useRef<HTMLInputElement>(null);

  const handleOpenOptions = () => setIsOptionsOpen(true);
  const handleCloseOptions = () => setIsOptionsOpen(false);

  // ✅ '카메라로 촬영하기' 클릭 시, 숨겨진 카메라 Input 클릭
  const handleLaunchCamera = () => {
    handleCloseOptions();
    cameraInputRef.current?.click();
  };

  // ✅ '사진 선택하기' 클릭 시, 숨겨진 라이브러리 Input 클릭
  const handleLaunchLibrary = () => {
    handleCloseOptions();
    libraryInputRef.current?.click();
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const mergeByName = (
    prev: DetectedIngredient[],
    incoming: DetectedIngredient[],
  ): DetectedIngredient[] => {
    const map = new Map<string, DetectedIngredient>();
    for (const item of prev) map.set(item.name.trim(), { ...item });
    for (const item of incoming) {
      const key = item.name.trim();
      if (map.has(key)) {
        const exist = map.get(key)!;
        if (exist.unit !== item.unit) {
          console.warn(
            `[merge] 단위 불일치: '${exist.name}' (${exist.unit} vs ${item.unit})`,
          );
        }
        map.set(key, {
          ...exist,
          quantity: Number(exist.quantity) + Number(item.quantity ?? 0),
        });
      } else map.set(key, { ...item, quantity: Number(item.quantity ?? 0) });
    }
    return Array.from(map.values());
  };

  const detectOne = async (base64DataUrl: string) => {
    try {
      const pureBase64 = base64DataUrl.startsWith('data:')
        ? base64DataUrl.split(',')[1]
        : base64DataUrl;
      const payload = { base64_images: [pureBase64] };
      const { data } = await axiosInstance.post('/chats/yolo', payload, {
        headers: { 'Content-Type': 'application/json' },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      });
      console.log('✅ YOLO 전체 응답:', data);
      const rawIngredients: BackendIngredient[] = data?.data?.ingredients ?? [];
      const incoming: DetectedIngredient[] = rawIngredients.map((item, idx) => {
        const name = typeof item.name === 'string' ? item.name : '재료';
        const amount =
          typeof item.amount === 'number'
            ? item.amount
            : Number(item.amount) || 1;
        const cropImageArr = Array.isArray(item.crop_image)
          ? item.crop_image
          : [];
        const firstImage = cropImageArr[0];
        const imageUrl = firstImage
          ? `data:image/jpeg;base64,${firstImage}`
          : undefined;
        return {
          id: `${Date.now()}_${Math.random()}_${idx}`,
          name,
          quantity: amount,
          unit: 'EA',
          image: imageUrl,
        };
      });
      setDetectedIngredients((prev) => mergeByName(prev, incoming));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(
          '[YOLO] 업로드 실패:',
          err.response?.status,
          err.response?.data,
        );
      } else if (err instanceof Error) {
        console.error('[YOLO] 업로드 실패:', err.message);
      } else {
        console.error('[YOLO] 알 수 없는 오류:', err);
      }
    }
  };

  // ❌ handleCapturedFromCamera 함수는 더 이상 필요 없습니다.

  // ✅ 갤러리/라이브러리 파일 변경 핸들러
  const handleLibraryFileChange: React.ChangeEventHandler<
    HTMLInputElement
  > = async (e) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    for (const file of files) {
      try {
        const base64 = await fileToBase64(file);
        setImages((prev) => [...prev, base64]);
        await detectOne(base64);
      } catch (err) {
        console.error('❌ 갤러리 업로드 실패:', err);
      }
    }
    if (libraryInputRef.current) libraryInputRef.current.value = '';
  };

  // ✅ 카메라 파일 변경 핸들러
  const handleCameraFileChange: React.ChangeEventHandler<
    HTMLInputElement
  > = async (e) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0]; // 카메라 촬영은 보통 파일이 1개만 옴

    try {
      const base64 = await fileToBase64(file);
      setImages((prev) => [...prev, base64]); // 촬영한 이미지도 이미지 목록에 추가
      await detectOne(base64);
    } catch (err) {
      console.error('❌ 카메라 업로드 실패:', err);
    }
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleNext = () => {
    if (images.length === 0) {
      console.log('이미지가 없어서 이동하지 않음');
      return;
    }
    navigate('/userinfopage1_2', {
      state: { ingredients: detectedIngredients, images },
    });
  };

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* ❌ CameraModal 렌더링 제거 */}
      {/* {isCameraOpen && (
        <CameraModal
          onClose={() => setIsCameraOpen(false)}
          onCapture={handleCapturedFromCamera}
        />
      )} */}

      <ImageOptionsModal
        isVisible={isOptionsOpen}
        onClose={handleCloseOptions}
        onLaunchCamera={handleLaunchCamera}
        onLaunchLibrary={handleLaunchLibrary}
      />

      {/* ✅ 라이브러리용 Input (multiple 파일 선택 가능) */}
      <input
        ref={libraryInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleLibraryFileChange}
      />

      {/* ✅ 카메라용 Input (capture="environment"로 후면 카메라 즉시 실행) */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment" // 핵심 속성
        className="hidden"
        onChange={handleCameraFileChange}
      />

      <div
        className="flex w-full justify-center overflow-y-auto"
        style={{
          marginTop: '0.5px',
          paddingTop: '24px',
          paddingBottom: '16vh',
        }}
      >
        <div className="w-[86.98%]">
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={handleOpenOptions}
              className="aspect-square rounded-lg overflow-hidden border border-dashed border-amber-400 flex items-center justify-center hover:bg-amber-50"
            >
              <img
                src={ingredientAdd}
                alt="재료 추가"
                className="h-full w-full object-cover"
              />
            </button>

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
