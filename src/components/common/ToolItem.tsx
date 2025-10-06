// src/components/ToolItem.tsx

import React from 'react';
// 💡 SVG 파일 임포트
import CheckIcon from '/src/assets/check.svg';

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
  // 1. 외곽선 클래스: 선택 시 주황색, 미선택 시 회색
  const outlineClass = isSelected ? 'outline-amber-500' : 'outline-neutral-200';

  // 2. 체크박스 배경 클래스: 항상 회색으로 고정 (bg-gray-200)
  const checkboxBgClass = 'bg-gray-200';

  // 3. 체크 아이콘 색상: 선택 시 주황색 (SVG 내부 색상을 currentColor로 설정했을 경우 적용)
  const checkColorClass = 'text-amber-500';

  return (
    <div
      className={`self-stretch h-12 relative bg-white rounded-lg outline outline-1 outline-offset-[-1px] ${outlineClass} overflow-hidden cursor-pointer`}
      onClick={onClick}
    >
      {/* 텍스트 영역 */}
      <div className="left-[16px] top-[16px] absolute justify-start text-zinc-800 text-lg font-normal font-['Pretendard']">
        {name}
      </div>

      {/* 🚀 체크박스/토글 버튼 영역 (배경색은 항상 회색) */}
      <div
        className={`w-7 h-7 absolute rounded-full flex items-center justify-center ${checkboxBgClass}`}
        style={{ left: '86.98%', top: '12px' }}
      >
        {isSelected && (
          // 💡 SVG 파일을 이미지 태그로 불러와서 사용
          // 💡 width/height를 직접 SVG 파일에 설정하거나, img 태그의 w/h를 조정 (여기서는 w-6 h-6으로 설정)
          // 💡 checkColorClass는 SVG 파일의 fill/stroke가 currentColor일 때 적용됩니다.
          <img
            src={CheckIcon}
            alt="Check"
            className={`w-6 h-6 ${checkColorClass}`} // 크기를 24x24px로 설정
            style={
              {
                // SVG 파일 내부의 width/height가 고정되어 있다면 이 클래스는 무시될 수 있습니다.
                // SVG 파일의 stroke 속성이 currentColor라면 text-amber-500이 적용됩니다.
                // SVG 파일의 fill 속성이 currentColor라면 text-amber-500이 적용됩니다.
              }
            }
          />
        )}
      </div>
    </div>
  );
};

export default ToolItem;
