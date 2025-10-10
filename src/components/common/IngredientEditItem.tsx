// src/components/common/IngredientEditItem.tsx
import React, { useState } from 'react';
import { IngredientEditData } from './IngredientEditList'; // ✅ 타입 가져오기

const UNIT_OPTIONS = ['EA', 'g', 'ml'];

interface IngredientEditItemProps extends IngredientEditData {
  onUpdate: (
    id: string | number,
    field: keyof IngredientEditData,
    value: string,
  ) => void;
  onOpenCamera: () => void;
  onSelectPhoto: (file: File) => void;
}

const IngredientEditItem: React.FC<IngredientEditItemProps> = ({
  id,
  name,
  image,
  date,
  quantity,
  unit,
  onUpdate,
  onOpenCamera,
  onSelectPhoto,
}) => {
  const [showChoiceModal, setShowChoiceModal] = useState(false);

  const handleChange = (field: keyof IngredientEditData, value: string) => {
    if (field === 'quantity') {
      const numericValue = value.replace(/[^0-9]/g, '');
      onUpdate(id, field, numericValue);
    } else {
      onUpdate(id, field, value);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onSelectPhoto(file);
    setShowChoiceModal(false);
  };

  return (
    <div
      className="w-full h-28 flex bg-white rounded-lg outline outline-[0.51px] outline-stone-300 overflow-hidden pl-[9px] pt-[7px] pb-[11px]"
      style={{ outlineOffset: '-0.51px' }}
    >
      {/* 이미지 클릭 시 선택 모달 열림 */}
      <div
        className="w-24 h-24 rounded overflow-hidden flex-shrink-0 mr-[5.58%] cursor-pointer"
        onClick={() => setShowChoiceModal(true)}
      >
        <img className="w-full h-full object-cover" src={image} alt={name} />
      </div>

      {/* 우측 입력 필드들 */}
      <div className="flex-grow flex flex-col justify-end">
        {/* 재료명 / 유통기한 */}
        <div className="flex justify-between items-start w-full">
          <div className="flex justify-start gap-[3.26%] pb-[9px] w-full">
            <div className="flex flex-col gap-[2px] items-start flex-1 w-0">
              <div className="text-zinc-500 text-[9.27px] font-light">
                재료명
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full h-7 bg-white rounded border-[0.46px] border-stone-300 px-2 text-zinc-800 text-xs font-light"
              />
            </div>

            <div className="flex flex-col gap-[2px] items-start flex-1 w-0 mr-[2.09%]">
              <div className="text-zinc-500 text-[9.27px] font-light">
                유통기한
              </div>
              <input
                type="text"
                value={date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full h-7 bg-white rounded border-[0.46px] border-stone-300 px-2 text-zinc-800 text-xs font-light"
                placeholder="YYYY.MM.DD"
              />
            </div>
          </div>
        </div>

        {/* 수량 / 단위 */}
        <div className="flex justify-start items-start gap-[3.26%] w-full">
          <div className="flex flex-col gap-[2px] items-start flex-1 w-0">
            <div className="text-zinc-500 text-[9.27px] font-light">
              갯수/용량
            </div>
            <input
              type="number"
              value={quantity}
              onChange={(e) => handleChange('quantity', e.target.value)}
              className="w-full h-7 bg-white rounded border-[0.46px] border-stone-300 px-2 text-zinc-800 text-xs font-light"
            />
          </div>

          <div className="flex flex-col gap-[2px] items-start flex-1 w-0 mr-[2.09%]">
            <div className="text-zinc-500 text-[9.27px] font-light">단위</div>
            <select
              value={unit}
              onChange={(e) => handleChange('unit', e.target.value)}
              className="w-full h-7 bg-white rounded border-[0.46px] border-stone-300 px-2 text-zinc-800 text-xs font-light appearance-none"
            >
              {UNIT_OPTIONS.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ✅ 사진 선택 모달 */}
      {showChoiceModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[9999]">
          <div className="bg-white rounded-lg w-[280px] p-5 text-center shadow-lg">
            <p className="text-sm font-medium text-gray-700 mb-4">
              사진을 추가할 방법을 선택하세요
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenCamera();
                  setShowChoiceModal(false);
                }}
                className="py-2 bg-[#FF8800] text-white rounded-md"
              >
                사진 촬영하기
              </button>

              <label className="py-2 bg-gray-200 text-gray-800 rounded-md cursor-pointer">
                사진 선택하기
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => setShowChoiceModal(false)}
                className="py-2 text-gray-500 text-sm"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientEditItem;
