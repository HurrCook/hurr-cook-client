import React from 'react';
import TabIcon from '@/assets/탭.svg';
import SettingIcon from '@/assets/세팅.svg';

type HeaderProps = {
  onOpenSidebar: () => void;
  onOpenModal: () => void;
};

export default function Header({ onOpenSidebar, onOpenModal }: HeaderProps) {
  return (
    <header className="w-full h-[52px] bg-white border-b border-gray-200 flex items-center justify-between px-4">
      {/* 왼쪽: 탭 아이콘 */}
      <button onClick={onOpenSidebar}>
        <img src={TabIcon} alt="탭 아이콘" className="w-8 h-8" />
      </button>

      {/* 가운데: 로고 텍스트 */}
      <h1 className="text-[#FF8800] font-[Gretoon] text-2xl font-normal">
        Hurr Cook
      </h1>

      {/* 오른쪽: 세팅 아이콘 */}
      <button onClick={onOpenModal}>
        <img src={SettingIcon} alt="세팅 아이콘" className="w-8 h-8" />
      </button>
    </header>
  );
}
