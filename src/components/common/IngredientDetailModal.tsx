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

// Base64 변환
const svgContentToBase64 = (svgContent: string): string => {
  const utf8Content = unescape(encodeURIComponent(svgContent));
  const base64 = btoa(utf8Content);
  return `data:image/svg+xml;base64,${base64}`;
};

// 안전한 이미지 URL 처리
const getSafeImageSrc = (imageUrl: string): string => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('data:image')) return imageUrl;

  if (imageUrl.includes('/assets/')) return imageUrl;

  if (imageUrl.length > 50 && imageUrl.match(/^[A-Za-z0-9+/=]+$/)) {
    return `data:image/png;base64,${imageUrl}`;
  }

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

  const defaultGoodBase64 = useMemo(
    () => svgContentToBase64(DefaultGoodContent),
    [],
  );

  const defaultBadBase64 = useMemo(
    () => svgContentToBase64(DefaultBadContent),
    [],
  );

  useEffect(() => {
    if (isOpen) {
      console.log(
        '📌 기본 이미지 Base64 Good:',
        defaultGoodBase64.slice(0, 40),
      );
    }
  }, [isOpen, defaultGoodBase64]);

  // 상세 데이터 요청
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
        }
      } catch (err) {
        const error = err as AxiosError;
        console.error('[GET /ingredients 오류]', error.response?.data);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchIngredient();
    return () => {
      ignore = true;
    };
  }, [isOpen, ingredientId]);

  // 업데이트
  const handleUpdate = async () => {
    try {
      const amountMatch = editData.quantity.match(/\d+(\.\d+)?/);
      const amount = amountMatch ? parseFloat(amountMatch[0]) : 1;

      let imageValue = editData.imageUrl;

      if (imageValue.startsWith('data:image')) {
        const comma = imageValue.indexOf(',');
        if (comma > -1) imageValue = imageValue.slice(comma + 1);
      }

      const payload = {
        name: editData.name.trim(),
        amount,
        imageUrl: imageValue,
        expireDate: new Date(editData.date.replace(/\./g, '-')).toISOString(),
      };

      await api.put(`/api/ingredients/${ingredientId}`, payload);

      onUpdated?.();
      onClose();
    } catch (err) {
      const error = err as AxiosError;
      console.error('[PUT 오류]', error.response?.data);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/ingredients/${ingredientId}`);
      onUpdated?.();
      onClose();
    } catch (err) {
      const error = err as AxiosError;
      console.error('[DELETE 오류]', error.response?.data);
    }
  };

  // 파일 → Base64
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // 라이브러리 오픈
  const handleLaunchLibrary = () => {
    setIsImageOptionOpen(false);
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (e: Event | React.ChangeEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement | null;
      const file = target?.files?.[0];
      if (!file) return;

      const base64 = await fileToBase64(file);
      setEditData((prev) => ({ ...prev, imageUrl: base64 }));
    };

    input.click();
  };

  if (!isOpen) return null;

  // 날짜 파싱 iOS 안전 버전
  const parseToLocalDate = (str: string) => {
    const parts = str.replace(/\s/g, '').split('.');
    if (parts.length !== 3) return null;
    const [y, m, d] = parts.map(Number);
    return new Date(y, m - 1, d);
  };

  const parsedDate = parseToLocalDate(editData.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isExpired = parsedDate ? parsedDate.getTime() < today.getTime() : false;

  const imageSrc = getSafeImageSrc(editData.imageUrl);

  return (
    <>
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
            <h2 className="text-[22px]">재료 상세</h2>
            <button onClick={() => setIsDeleteConfirmOpen(true)}>
              <img src={TrashIcon} className="w-[22px]" alt="" />
            </button>
          </div>

          {/* 본문 */}
          {loading ? (
            <div className="text-center py-10 text-gray-500">
              불러오는 중...
            </div>
          ) : (
            <div className="px-5 pb-6 flex flex-col gap-6 overflow-y-auto max-h-[70vh]">
              {/* 이미지 */}
              <div
                className="w-[162px] h-[162px] rounded-[10px] overflow-hidden cursor-pointer bg-neutral-100"
                onClick={() => setIsImageOptionOpen(true)}
              >
                {imageSrc ? (
                  <img src={imageSrc} className="w-full h-full object-cover" />
                ) : (
                  <img
                    src={isExpired ? defaultBadBase64 : defaultGoodBase64}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* 입력 필드 */}
              <div className="flex justify-between gap-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-500">재료명</label>
                  <input
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({ ...editData, name: e.target.value })
                    }
                    className="w-full border px-2 py-1 rounded mt-1"
                  />
                </div>

                <div className="flex-1">
                  <label className="text-xs text-gray-500">유통기한</label>
                  <input
                    value={editData.date}
                    onChange={(e) =>
                      setEditData({ ...editData, date: e.target.value })
                    }
                    className={`w-full border px-2 py-1 rounded mt-1 ${
                      isExpired ? 'text-red-500' : ''
                    }`}
                  />
                </div>

                <div className="w-20">
                  <label className="text-xs text-gray-500">수량</label>
                  <input
                    value={editData.quantity}
                    onChange={(e) =>
                      setEditData({ ...editData, quantity: e.target.value })
                    }
                    className="w-full border px-2 py-1 rounded mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 버튼 */}
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

      {/* 이미지 옵션 */}
      <ImageOptionsModal
        isVisible={isImageOptionOpen}
        onClose={() => setIsImageOptionOpen(false)}
        onLaunchCamera={() => {
          setIsImageOptionOpen(false);
          setIsCameraOpen(true);
        }}
        onLaunchLibrary={handleLaunchLibrary}
      />

      {isCameraOpen && <CameraModal onClose={() => setIsCameraOpen(false)} />}

      {/* 삭제 확인 */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-72 text-center">
            <p className="mb-6">재료를 삭제하시겠습니까?</p>
            <div className="flex justify-center gap-3">
              <Button onClick={() => setIsDeleteConfirmOpen(false)}>
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
