import React, { useState } from 'react';
import { IngredientEditData } from './IngredientEditList';

const UNIT_OPTIONS = ['EA', 'g', 'ml'];

interface IngredientEditItemProps extends IngredientEditData {
  onUpdate: (
    id: string | number,
    field: keyof IngredientEditData,
    value: string,
  ) => void;
  onOpenCamera: (id: number | string) => void;
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
}) => {
  const [isUnitOpen, setIsUnitOpen] = useState(false);

  /** ✅ 이미지 렌더링 안전 처리 */
  const getImageSrc = (image: string) => {
    if (!image) return 'https://placehold.co/245x163';
    if (image.startsWith('http')) return image;
    if (image.startsWith('data:image')) return image;
    return `data:image/png;base64,${image}`;
  };

  const handleChange = (field: keyof IngredientEditData, value: string) => {
    if (field === 'quantity') {
      const numericValue = value.replace(/[^0-9]/g, '');
      onUpdate(id, field, numericValue);
    } else {
      onUpdate(id, field, value);
    }
  };

  const handleUnitSelect = (value: string) => {
    onUpdate(id, 'unit', value);
    setIsUnitOpen(false);
  };

  return (
    <div
      className="w-full h-28 flex bg-white rounded-lg outline outline-[0.51px] outline-stone-300 pl-[9px] pt-[7px] pb-[11px]"
      style={{ outlineOffset: '-0.51px' }}
    >
      {/* ✅ 이미지 영역 */}
      <div
        className="w-24 h-24 rounded overflow-hidden flex-shrink-0 mr-[5.58%] cursor-pointer bg-gray-100"
        onClick={() => onOpenCamera(id)}
      >
        <img
          className="w-full h-full object-cover"
          src={getImageSrc(image)}
          alt={name || 'ingredient'}
        />
      </div>

      {/* 우측 입력 필드 */}
      <div className="flex-grow flex flex-col justify-end">
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

        <div className="flex justify-start items-start gap-[3.26%] w-full relative">
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

          {/* 단위 드롭다운 */}
          <div className="flex flex-col gap-[2px] items-start flex-1 w-0 mr-[2.09%] relative">
            <div className="text-zinc-500 text-[9.27px] font-light">단위</div>

            <button
              type="button"
              onClick={() => setIsUnitOpen((prev) => !prev)}
              className="w-full h-7 bg-white rounded border-[0.46px] border-stone-300 px-2 text-zinc-800 text-xs font-light text-left relative"
            >
              {unit || '단위 선택'}
            </button>

            {isUnitOpen && (
              <ul className="absolute left-0 top-full mt-[2px] w-full bg-white border border-stone-300 rounded shadow">
                {UNIT_OPTIONS.map((opt) => (
                  <li
                    key={opt}
                    onClick={() => handleUnitSelect(opt)}
                    className="px-2 py-1 text-xs text-zinc-800 hover:bg-gray-100 cursor-pointer"
                  >
                    {opt}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientEditItem;
