/*import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderImageOptionsModalProps {
  isVisible: boolean;
  onClose: () => void;
  onLaunchCamera: (type: 'ingredient' | 'receipt') => void;
}

export default function HeaderImageOptionsModal({
  isVisible,
  onClose,
  onLaunchCamera,
}: HeaderImageOptionsModalProps) {
  const navigate = useNavigate();

  if (!isVisible) return null;

  const handleSelectClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    type: 'ingredient' | 'receipt',
  ) => {
    e.stopPropagation();
    console.log(`[handleSelectClick] ${type} 업로드 클릭됨`);

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;

    input.onchange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const files = target.files;
      if (!files || files.length === 0) {
        console.warn('[handleSelectClick] 파일이 선택되지 않음');
        return;
      }

      try {
        const base64Images = await Promise.all(
          Array.from(files).map(
            (file) =>
              new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = () => reject(new Error('파일 읽기 실패'));
                reader.readAsDataURL(file);
              }),
          ),
        );

        console.log(`[handleSelectClick] ${files.length}개 파일 변환 완료`);
        console.log(
          '[handleSelectClick] base64Images 샘플:',
          base64Images[0]?.slice(0, 30),
        );

        if (type === 'receipt') {
          console.log(
            '[handleSelectClick] 영수증 업로드 → /receipt-loading 이동',
          );
          navigate('/receipt-loading', {
            state: { base64_images: base64Images, type: 'receipt' },
          });
        } else {
          console.log('[handleSelectClick] 재료 업로드 → /loading 이동');
          navigate('/loading', {
            state: { base64_images: base64Images, type: 'ingredient' },
          });
        }
      } catch (err) {
        console.error('[handleSelectClick] 이미지 변환 실패:', err);
        navigate('/fail');
      }
    };

    input.click();
    onClose();
  };

  const handleCameraClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    type: 'ingredient' | 'receipt',
  ) => {
    e.stopPropagation();
    console.log(`[handleCameraClick] ${type} 촬영 클릭됨`);
    onClose();
    onLaunchCamera(type);
    console.log(`[handleCameraClick] ${type} 카메라 모달 실행됨`);
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 z-50 flex items-end justify-center"
      onClick={() => {
        console.log('[HeaderImageOptionsModal] 배경 클릭 → 닫기');
        onClose();
      }}
    >
      <div
        className="w-[93%] mb-[8vh] flex flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col bg-white rounded-xl overflow-hidden shadow-md">
          <button
            type="button"
            className="py-4 text-sky-500 text-lg font-medium border-b border-gray-200 active:bg-gray-50"
            onClick={(e) => handleCameraClick(e, 'ingredient')}
          >
            재료 촬영
          </button>

          <button
            type="button"
            className="py-4 text-sky-500 text-lg font-medium border-b border-gray-200 active:bg-gray-50"
            onClick={(e) => handleSelectClick(e, 'ingredient')}
          >
            재료 업로드
          </button>

          <button
            type="button"
            className="py-4 text-sky-500 text-lg font-medium border-b border-gray-200 active:bg-gray-50"
            onClick={(e) => handleCameraClick(e, 'receipt')}
          >
            영수증 촬영
          </button>

          <button
            type="button"
            className="py-4 text-sky-500 text-lg font-medium active:bg-gray-50"
            onClick={(e) => handleSelectClick(e, 'receipt')}
          >
            영수증 업로드
          </button>
        </div>

        <button
          type="button"
          className="w-full bg-white rounded-xl py-4 text-sky-500 text-lg font-medium shadow-sm active:bg-gray-50"
          onClick={(e) => {
            e.stopPropagation();
            console.log('[HeaderImageOptionsModal] 취소 클릭 → 닫기');
            onClose();
          }}
        >
          취소
        </button>
      </div>
    </div>
  );
}*/
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderImageOptionsModalProps {
  isVisible: boolean;
  onClose: () => void;
  // onLaunchCamera prop은 더 이상 필요하지 않지만, 기존 코드를 위해 유지합니다.
  onLaunchCamera: (type: 'ingredient' | 'receipt') => void;
}

export default function HeaderImageOptionsModal({
  isVisible,
  onClose,
  //onLaunchCamera, // 💡 실제 카메라 실행 로직은 이제 내부에서 처리됩니다.
}: HeaderImageOptionsModalProps) {
  const navigate = useNavigate();

  if (!isVisible) return null;

  // 파일 업로드 로직 (기존과 동일)
  const handleSelectClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    type: 'ingredient' | 'receipt',
  ) => {
    e.stopPropagation();
    console.log(`[handleSelectClick] ${type} 업로드 클릭됨`);

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;

    input.onchange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const files = target.files;
      if (!files || files.length === 0) {
        console.warn('[handleSelectClick] 파일이 선택되지 않음');
        return;
      }

      try {
        const base64Images = await Promise.all(
          Array.from(files).map(
            (file) =>
              new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = () => reject(new Error('파일 읽기 실패'));
                reader.readAsDataURL(file);
              }),
          ),
        );

        console.log(`[handleSelectClick] ${files.length}개 파일 변환 완료`);
        console.log(
          '[handleSelectClick] base64Images 샘플:',
          base64Images[0]?.slice(0, 30),
        );

        if (type === 'receipt') {
          console.log(
            '[handleSelectClick] 영수증 업로드 → /receipt-loading 이동',
          );
          navigate('/receipt-loading', {
            state: { base64_images: base64Images, type: 'receipt' },
          });
        } else {
          console.log('[handleSelectClick] 재료 업로드 → /loading 이동');
          navigate('/loading', {
            state: { base64_images: base64Images, type: 'ingredient' },
          });
        }
      } catch (err) {
        console.error('[handleSelectClick] 이미지 변환 실패:', err);
        navigate('/fail');
      }
    };

    input.click();
    onClose();
  };

  // ✅ 촬영 버튼 로직 수정: input type="file" capture="environment"로 카메라 즉시 실행
  const handleCameraClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    type: 'ingredient' | 'receipt',
  ) => {
    e.stopPropagation();
    console.log(`[handleCameraClick] ${type} 촬영 클릭됨`);

    // 1. 숨겨진 Input 요소 생성
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = false; // 촬영은 보통 1개 파일만 받습니다.
    input.setAttribute('capture', 'environment'); // 📸 후면 카메라 즉시 실행 핵심 속성

    // 2. 파일 변경(촬영 완료) 시 실행될 로직
    input.onchange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];

      if (!file) {
        console.warn('[handleCameraClick] 촬영이 취소되거나 파일이 없음');
        return;
      }

      try {
        // 촬영된 파일을 Base64로 변환
        const base64Image = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('파일 읽기 실패'));
          reader.readAsDataURL(file);
        });

        console.log('[handleCameraClick] 촬영 이미지 변환 완료');

        // 3. 로딩 페이지로 이동 (이동 로직은 select와 동일)
        if (type === 'receipt') {
          console.log(
            '[handleCameraClick] 영수증 촬영 → /receipt-loading 이동',
          );
          navigate('/receipt-loading', {
            state: { base64_images: [base64Image], type: 'receipt' },
          });
        } else {
          console.log('[handleCameraClick] 재료 촬영 → /loading 이동');
          navigate('/loading', {
            state: { base64_images: [base64Image], type: 'ingredient' },
          });
        }
      } catch (err) {
        console.error('[handleCameraClick] 이미지 처리 실패:', err);
        navigate('/fail');
      }
    };

    // 4. Input 클릭 (카메라 실행)
    input.click();

    // 5. 모달 닫기
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 z-50 flex items-end justify-center"
      onClick={() => {
        console.log('[HeaderImageOptionsModal] 배경 클릭 → 닫기');
        onClose();
      }}
    >
      <div
        className="w-[93%] mb-[8vh] flex flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col bg-white rounded-xl overflow-hidden shadow-md">
          <button
            type="button"
            className="py-4 text-sky-500 text-lg font-medium border-b border-gray-200 active:bg-gray-50"
            onClick={(e) => handleCameraClick(e, 'ingredient')}
          >
            재료 촬영
          </button>

          <button
            type="button"
            className="py-4 text-sky-500 text-lg font-medium border-b border-gray-200 active:bg-gray-50"
            onClick={(e) => handleSelectClick(e, 'ingredient')}
          >
            재료 업로드
          </button>

          <button
            type="button"
            className="py-4 text-sky-500 text-lg font-medium border-b border-gray-200 active:bg-gray-50"
            onClick={(e) => handleCameraClick(e, 'receipt')}
          >
            영수증 촬영
          </button>

          <button
            type="button"
            className="py-4 text-sky-500 text-lg font-medium active:bg-gray-50"
            onClick={(e) => handleSelectClick(e, 'receipt')}
          >
            영수증 업로드
          </button>
        </div>

        <button
          type="button"
          className="w-full bg-white rounded-xl py-4 text-sky-500 text-lg font-medium shadow-sm active:bg-gray-50"
          onClick={(e) => {
            e.stopPropagation();
            console.log('[HeaderImageOptionsModal] 취소 클릭 → 닫기');
            onClose();
          }}
        >
          취소
        </button>
      </div>
    </div>
  );
}
