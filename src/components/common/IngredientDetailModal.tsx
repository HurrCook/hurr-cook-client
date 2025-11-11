import React, { useState, useEffect } from 'react';
import TrashIcon from '@/assets/쓰레기통.svg';
import Button from '@/components/common/Button';
import CameraModal from '@/components/header/CameraModal';
import ImageOptionsModal from '@/components/modal/ImageOptionsModal';
import api from '@/lib/axios';
import { AxiosError } from 'axios';

interface IngredientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ingredientId: string;
}

interface IngredientEditData {
  name: string;
  date: string;
  quantity: string;
  imageUrl: string;
}

export default function IngredientDetailModal({
  isOpen,
  onClose,
  ingredientId,
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

  // ✅ GET /ingredients/:id
  useEffect(() => {
    if (!isOpen || !ingredientId) return;
    let ignore = false;

    const fetchIngredient = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/ingredients/${ingredientId}`);
        if (!ignore && res.data.success && res.data.data) {
          const item = res.data.data;
          setEditData({
            name: item.name,
            date: item.expireDate.split('T')[0].replace(/-/g, '.'),
            quantity: `${item.amount}${item.unit}`,
            imageUrl: item.imageUrl || '',
          });
        }
      } catch (error: unknown) {
        const err = error as AxiosError;
        console.error('[GET 오류]', err.message);
        if (err.response) console.error('[응답 본문]', err.response.data);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchIngredient();
    return () => {
      ignore = true;
    };
  }, [isOpen, ingredientId]);

  // ✅ PUT /ingredients/:id
  const handleUpdate = async () => {
    try {
      const amountMatch = editData.quantity.match(/\d+(\.\d+)?/);
      const amount = amountMatch ? parseFloat(amountMatch[0]) : 1;
      const unitMatch = editData.quantity.replace(/[\d.]/g, '').trim();
      const unit = unitMatch || 'EA';

      let base64Image = editData.imageUrl;

      // URL → base64 변환 (이미 base64면 그대로 유지)
      if (base64Image && !base64Image.startsWith('data:image')) {
        try {
          const response = await fetch(base64Image);
          const blob = await response.blob();
          const reader = new FileReader();
          base64Image = await new Promise<string>((resolve, reject) => {
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.error('[이미지 base64 변환 실패]', error);
        }
      }

      const payload = {
        name: editData.name.trim(),
        amount,
        unit,
        imageUrl: base64Image || '',
        expireDate: new Date(editData.date.replace(/\./g, '-')).toISOString(),
      };

      const res = await api.put(`/ingredients/${ingredientId}`, payload);
      console.log('[PUT 성공]', res.status);
      onClose();
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error('[PUT 오류]', err.message);
      if (err.response) console.error('[응답 본문]', err.response.data);
    }
  };

  // ✅ DELETE /ingredients/:id
  const handleDelete = async () => {
    try {
      const res = await api.delete(`/ingredients/${ingredientId}`);
      console.log('[DELETE 성공]', res.status);
      onClose();
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error('[DELETE 오류]', err.message);
      if (err.response) console.error('[응답 본문]', err.response.data);
    }
  };

  // ✅ 파일 업로드 (항상 base64 반환)
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleLaunchCamera = () => {
    setIsImageOptionOpen(false);
    setIsCameraOpen(true);
  };

  const handleLaunchLibrary = () => {
    setIsImageOptionOpen(false);
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        const base64 = await fileToBase64(file);
        setEditData((prev) => ({ ...prev, imageUrl: base64 }));
      }
    };
    input.click();
  };

  if (!isOpen) return null;

  const today = new Date();
  const parsedDate = new Date(editData.date.replace(/\./g, '-'));
  const isExpired = parsedDate < today;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center px-6 py-10">
        <div
          className="w-full max-w-[420px] bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-5 flex justify-between items-center">
            <h2 className="text-[22px] font-normal text-[#212121] font-[Pretendard]">
              재료 상세
            </h2>
            <button onClick={() => setIsDeleteConfirmOpen(true)}>
              <img
                src={TrashIcon}
                alt="삭제 아이콘"
                className="w-[22px] h-[22px]"
              />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-10 text-gray-500 text-sm">
              불러오는 중...
            </div>
          ) : (
            <div className="px-5 pb-6 flex flex-col gap-6 overflow-y-auto max-h-[70vh]">
              <div
                className="w-[162px] h-[162px] bg-[#F5F5F5] rounded-[10px] overflow-hidden cursor-pointer"
                onClick={() => setIsImageOptionOpen(true)}
              >
                {editData.imageUrl ? (
                  <img
                    src={editData.imageUrl}
                    alt={editData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
                    이미지 추가
                  </div>
                )}
              </div>

              <div className="flex justify-between items-start w-full gap-3">
                <div className="flex-1 flex flex-col gap-1.5">
                  <label className="text-[#838383] text-[10px] font-light">
                    재료명
                  </label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEditData({ ...editData, quantity: e.target.value })
                    }
                    className="px-2 py-1.5 rounded border border-[#C8C8C8] text-[#313131] text-[14px] w-full"
                  />
                </div>
              </div>
            </div>
          )}

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

      <ImageOptionsModal
        isVisible={isImageOptionOpen}
        onClose={() => setIsImageOptionOpen(false)}
        onLaunchCamera={handleLaunchCamera}
        onLaunchLibrary={handleLaunchLibrary}
      />

      {isCameraOpen && <CameraModal onClose={() => setIsCameraOpen(false)} />}

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
