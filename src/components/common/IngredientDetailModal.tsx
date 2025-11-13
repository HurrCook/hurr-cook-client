// src/components/common/IngredientDetailModal.tsx
import React, { useState, useEffect, useMemo } from 'react';
import TrashIcon from '@/assets/쓰레기통.svg';
import Button from '@/components/common/Button';
import CameraModal from '@/components/header/CameraModal';
import ImageOptionsModal from '@/components/modal/ImageOptionsModal';
import api from '@/lib/axios';
import { AxiosError } from 'axios';
import DefaultGoodContent from '@/assets/default_good.svg?raw';
import DefaultBadContent from '@/assets/default_bad.svg?raw';

interface IngredientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredientId: string;
  onUpdated?: () => void;
}

interface IngredientEditData {
  name: string;
  date: string;
  quantity: string;
  imageUrl: string;
}

// ✅ SVG XML 문자열을 Base64 Data URL로 변환하는 헬퍼 함수
const svgContentToBase64 = (svgContent: string): string => {
  const utf8Content = unescape(encodeURIComponent(svgContent));
  const base64 = btoa(utf8Content);
  return `data:image/svg+xml;base64,${base64}`;
};

// ✅ 이미지 소스를 안전하게 결정하는 헬퍼 함수 (유저 요청 반영)
const getSafeImageSrc = (imageUrl: string): string => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('data:image')) return imageUrl;

  // 순수한 Base64 문자열로 추정되면 PNG Data URL 프리픽스 붙여 반환
  // 길이와 문자열 패턴(A-Z, a-z, 0-9, +, /, =)을 검사하여 Base64로 간주
  if (imageUrl.length > 50 && imageUrl.match(/^[A-Za-z0-9+/=]+$/)) {
    return `data:image/png;base64,${imageUrl}`;
  }

  // 그 외의 잘못된 경로 문자열 등은 빈 문자열로 반환하여 기본 이미지 렌더링을 유도
  return '';
};

export default function IngredientDetailModal({
  isOpen,
  onClose,
  ingredientId,
  onUpdated,
}: IngredientDetailModalProps) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isImageOptionOpen, setIsImageOptionOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState<IngredientEditData>({
    name: '',
    date: '',
    quantity: '',
    imageUrl: '',
  });

  // ✅ 기본 이미지를 useMemo를 사용하여 Base64 Data URL로 변환
  const defaultGoodBase64 = useMemo(() => {
    return svgContentToBase64(DefaultGoodContent);
  }, []);

  const defaultBadBase64 = useMemo(() => {
    return svgContentToBase64(DefaultBadContent);
  }, []);

  // 💡 디버그용
  useEffect(() => {
    if (isOpen) {
      console.log('--- 기본 이미지 Base64 확인 ---');
      console.log('Good Base64 Start:', defaultGoodBase64.slice(0, 50));
      console.log('---------------------------');
    }
  }, [isOpen, defaultGoodBase64]);

  /** 재료 상세 데이터 불러오기 */
  useEffect(() => {
    if (!isOpen || !ingredientId) return;
    let ignore = false;

    const fetchIngredient = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/ingredients/${ingredientId}`);
        if (!ignore && res.data.success && res.data.data) {
          const item = res.data.data;
          setEditData({
            name: item.name,
            date: item.expireDate.split('T')[0].replace(/-/g, '.'),
            quantity: `${item.amount}${item.unit}`,
            imageUrl: item.imageUrl || '',
          });
          console.log('[API Image URL]', item.imageUrl || 'None');
        }
      } catch (error: unknown) {
        const err = error as AxiosError;
        if (err.response)
          console.error('[GET /ingredients 오류]', err.response.data);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchIngredient();
    return () => {
      ignore = true;
    };
  }, [isOpen, ingredientId]);

  /** 재료 수정 */
  const handleUpdate = async () => {
    try {
      const amountMatch = editData.quantity.match(/\d+(\.\d+)?/);
      const amount = amountMatch ? parseFloat(amountMatch[0]) : 1;

      let imageValue = editData.imageUrl || '';
      // data:image 접두사 제거 로직 유지 (서버 전송용)
      if (imageValue.startsWith('data:image')) {
        const commaIndex = imageValue.indexOf(',');
        if (commaIndex !== -1) imageValue = imageValue.slice(commaIndex + 1);
      }

      const payload = {
        name: editData.name.trim(),
        amount,
        imageUrl: imageValue,
        expireDate: new Date(editData.date.replace(/\./g, '-')).toISOString(),
      };

      await api.put(`/api/ingredients/${ingredientId}`, payload, {
        headers: { 'Content-Type': 'application/json' },
        maxBodyLength: 15 * 1024 * 1024,
      });

      onUpdated?.();
      onClose();
    } catch (error: unknown) {
      const err = error as AxiosError;
      if (err.response)
        console.error('[PUT /ingredients 수정 오류]', err.response.data);
    }
  };

  /** 재료 삭제 */
  const handleDelete = async () => {
    try {
      await api.delete(`/api/ingredients/${ingredientId}`);
      onUpdated?.();
      onClose();
    } catch (error: unknown) {
      const err = error as AxiosError;
      if (err.response)
        console.error('[DELETE /ingredients 삭제 오류]', err.response.data);
    }
  };

  /** 파일 → Base64 변환 */
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  /** 카메라 실행 */
  const handleLaunchCamera = () => {
    setIsImageOptionOpen(false);
    setIsCameraOpen(true);
  };

  /** 갤러리 실행 */
  const handleLaunchLibrary = () => {
    setIsImageOptionOpen(false);
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: Event | React.ChangeEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement | null;
      const file = target?.files?.[0];
      if (file) {
        const base64 = await fileToBase64(file);
        setEditData((prev) => ({ ...prev, imageUrl: base64 }));
      }
    };
    input.click();
  };

  if (!isOpen) return null;

  // ✅ 유통기한 비교 로직
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parsedDate = editData.date
    ? new Date(editData.date.replace(/\./g, '-'))
    : today;
  parsedDate.setHours(0, 0, 0, 0);

  // 유통기한이 오늘 날짜와 같거나 이미 지난 경우 isExpired = true
  const isExpired = parsedDate <= today;

  // 💡 렌더링 시 사용할 최종 이미지 소스 결정
  const imageSrc = getSafeImageSrc(editData.imageUrl);

  return (
    <>
      {/* 메인 모달 */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center px-6 py-10"
        onClick={onClose}
      >
        <div
          className="w-full max-w-[420px] bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div className="p-5 flex justify-between items-center">
            <h2 className="text-[22px] font-normal text-[#212121] font-[Pretendard]">
              재료 상세
            </h2>
            <button type="button" onClick={() => setIsDeleteConfirmOpen(true)}>
              <img
                src={TrashIcon}
                alt="삭제 아이콘"
                className="w-[22px] h-[22px]"
              />
            </button>
          </div>

          {/* 본문 */}
          {loading ? (
            <div className="text-center py-10 text-gray-500 text-sm">
              불러오는 중...
            </div>
          ) : (
            <div className="px-5 pb-6 flex flex-col gap-6 overflow-y-auto max-h-[70vh]">
              {/* 이미지 */}
              <div
                className="w-[162px] h-[162px] bg-[#F5F5F5] rounded-[10px] overflow-hidden cursor-pointer"
                onClick={() => setIsImageOptionOpen(true)}
              >
                {imageSrc ? ( // ✅ imageSrc가 유효하면 (비어 있지 않으면)
                  <img
                    src={imageSrc} // ✅ 안전하게 처리된 URL 사용
                    alt={editData.name || '재료 이미지'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // ✅ imageSrc가 비어있으면 기본 이미지 사용
                  <img
                    src={isExpired ? defaultBadBase64 : defaultGoodBase64}
                    alt="기본 재료 이미지"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* 입력 필드 */}
              <div className="flex justify-between items-start w-full gap-3">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[#838383] text-[10px] font-light">
                    재료명
                  </label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    className="px-2 py-1.5 rounded border border-[#C8C8C8] text-[#313131] text-[14px] w-full"
                  />
                </div>

                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[#838383] text-[10px] font-light">
                    유통기한
                  </label>
                  <input
                    type="text"
                    value={editData.date}
                    onChange={(e) =>
                      setEditData({ ...editData, date: e.target.value })
                    }
                    placeholder="YYYY.MM.DD"
                    className={`px-2 py-1.5 rounded border border-[#C8C8C8] text-[14px] w-full ${
                      isExpired ? 'text-[#FF4741]' : 'text-[#313131]'
                    }`}
                  />
                </div>

                <div className="flex-[0.6] flex flex-col gap-1.5">
                  <label className="text-[#838383] text-[10px] font-light">
                    갯수/용량
                  </label>
                  <input
                    type="text"
                    value={editData.quantity}
                    onChange={(e) =>
                      setEditData({ ...editData, quantity: e.target.value })
                    }
                    className="px-2 py-1.5 rounded border border-[#C8C8C8] text-[#313131] text-[14px] w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 하단 버튼 */}
          <div className="p-5 flex justify-end gap-3">
            <Button color="cancel" onClick={onClose}>
              닫기
            </Button>
            <Button color="default" onClick={handleUpdate}>
              수정
            </Button>
          </div>
        </div>
      </div>

      {/* 이미지 선택 모달 */}
      <ImageOptionsModal
        isVisible={isImageOptionOpen}
        onClose={() => setIsImageOptionOpen(false)}
        onLaunchCamera={handleLaunchCamera}
        onLaunchLibrary={handleLaunchLibrary}
      />

      {/* 카메라 모달 */}
      {isCameraOpen && <CameraModal onClose={() => setIsCameraOpen(false)} />}

      {/* 삭제 확인 모달 */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[60]">
          <div className="bg-white rounded-[9.6px] inline-flex p-6 w-72 flex-col items-center gap-7">
            <p className="text-neutral-700 text-sm font-medium">
              재료를 삭제하시겠습니까?
            </p>
            <div className="flex gap-4 w-full justify-center">
              <Button
                color="cancel"
                onClick={() => setIsDeleteConfirmOpen(false)}
              >
                취소
              </Button>
              <Button color="default" onClick={handleDelete}>
                삭제
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
