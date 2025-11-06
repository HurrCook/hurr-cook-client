import React from 'react';

interface IngredientToolTabProps {
  activeTab: 'ingredient' | 'tool';
  onChange: (tab: 'ingredient' | 'tool') => void;
}

const RefrigeratorTab: React.FC<IngredientToolTabProps> = ({
  activeTab,
  onChange,
}) => {
  return (
    <div className="w-full flex justify-center items-center gap-3 bg-white/70 backdrop-blur-sm">
      {/* 재료 탭 */}
      <button
        onClick={() => onChange('ingredient')}
        className={`w-full py-2 rounded-xl text-[16px] font-[Pretendard] font-normal transition-all ${
          activeTab === 'ingredient'
            ? 'bg-[#EBEBEB] text-[#3B3B3B]'
            : 'bg-white text-[#3B3B3B]'
        }`}
      >
        재료
      </button>

      {/* 도구 탭 */}
      <button
        onClick={() => onChange('tool')}
        className={`w-full py-2 rounded-xl text-[16px] font-[Pretendard] font-normal transition-all ${
          activeTab === 'tool'
            ? 'bg-[#EBEBEB] text-[#3B3B3B]'
            : 'bg-white text-[#3B3B3B]'
        }`}
      >
        도구
      </button>
    </div>
  );
};

export default RefrigeratorTab;
