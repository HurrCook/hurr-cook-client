// src/components/ToolItem.tsx
import React from 'react';

interface ToolItemProps {
  name: string;
  isSelected?: boolean;
  onClick: () => void;
}

const ToolItem: React.FC<ToolItemProps> = ({
  name,
  isSelected = false,
  onClick,
}) => {
  const outlineClass = isSelected ? 'outline-amber-500' : 'outline-neutral-200';
  const checkColorClass = isSelected ? 'text-amber-500' : 'text-transparent';

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'w-full h-12 px-4 rounded-lg bg-white',
        'outline outline-1 outline-offset-[-1px]',
        'flex items-center justify-between',
        'transition-colors',
        outlineClass,
      ].join(' ')}
    >
      {/* 왼쪽 텍스트 */}
      <span className="text-zinc-800 text-base font-normal font-['Pretendard'] truncate">
        {name}
      </span>

      {/* 오른쪽 체크 원형 (배경은 항상 회색) */}
      <span className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
        {/* 선택 시만 색이 보이도록 currentColor 사용 */}
        <svg
          viewBox="0 0 24 24"
          className={`w-5 h-5 ${checkColorClass}`}
          aria-hidden="true"
        >
          <path
            d="M20 6L9 17l-5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
};

export default ToolItem;
