import React, { useState } from 'react';
import Hurr3Icon from '@/assets/Hurr3.svg';
import SidebarItem from './SidebarItem';

type SidebarProps = {
  onClose: () => void;
};

export default function Sidebar({ onClose }: SidebarProps) {
  const [selected, setSelected] = useState('후르랑 대화하기');

  return (
    <aside className="w-[270px] bg-white shadow-lg z-50 flex flex-col">
      {/* 상단 영역 (로고 + 메뉴) */}
      <div className="p-4 flex-1 flex flex-col">
        {/* 로고 */}
        <div className="flex items-center mb-6 relative">
          <img src={Hurr3Icon} alt="Hurr Cook Logo" className="w-10 h-10" />
          <h1 className="ml-3 text-[#FF8800] font-[Gretoon] text-lg">
            Hurr Cook
          </h1>
          <button
            onClick={onClose}
            className="absolute right-0 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* 메뉴 리스트 */}
        <nav className="flex flex-col space-y-2">
          <SidebarItem
            label="후르랑 대화하기"
            selected={selected === '후르랑 대화하기'}
            onClick={() => setSelected('후르랑 대화하기')}
          />
          <SidebarItem
            label="내 냉장고"
            selected={selected === '내 냉장고'}
            onClick={() => setSelected('내 냉장고')}
          />
          <SidebarItem
            label="저장된 레시피"
            selected={selected === '저장된 레시피'}
            onClick={() => setSelected('저장된 레시피')}
          />
        </nav>
      </div>

      {/* 하단 프로필: 사이드바 전체 폭 차지 */}
      <div className="w-full h-[70px] bg-[#F0F0F0] flex items-center px-5">
        <div className="w-[30px] h-[30px] bg-[#A7A7A7] rounded-md" />
        <span className="ml-4 text-[#212121] font-[Gretoon] text-[16px]">
          박건민
        </span>
        <div className="ml-auto w-[18px] h-[18px] border border-[#A7A7A7] rounded-sm" />
      </div>
    </aside>
  );
}
