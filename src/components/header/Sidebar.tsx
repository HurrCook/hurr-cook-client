import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ 추가
import Hurr3Icon from '@/assets/Hurr3.svg';
import SidebarItem from './SidebarItem';
import LogoutIcon from '@/assets/로그아웃.svg';

type SidebarProps = {
  onClose: () => void;
};

export default function Sidebar({ onClose }: SidebarProps) {
  const [selected, setSelected] = useState('후르랑 대화하기');
  const navigate = useNavigate(); // ✅ 추가

  const handleNavigation = (label: string, path: string) => {
    setSelected(label);
    navigate(path); // ✅ 페이지 이동
    onClose(); // 사이드바 닫기
  };

  return (
    <aside className="w-[270px] h-full bg-white shadow-lg z-50 flex flex-col">
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center mb-6 relative">
          <img src={Hurr3Icon} alt="Hurr Cook Logo" className="w-14 h-14" />
          <h1 className="ml-4 text-[#FF8800] font-[Gretoon] text-2xl">
            Hurr Cook
          </h1>
          <button
            onClick={onClose}
            className="absolute right-0 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col space-y-2 mt-4">
          <SidebarItem
            label="후르랑 대화하기"
            selected={selected === '후르랑 대화하기'}
            onClick={() => handleNavigation('후르랑 대화하기', '/chat')}
          />
          <SidebarItem
            label="내 냉장고"
            selected={selected === '내 냉장고'}
            onClick={() => handleNavigation('내 냉장고', '/refrigerator')}
          />
          <SidebarItem
            label="저장된 레시피"
            selected={selected === '저장된 레시피'}
            onClick={() => handleNavigation('저장된 레시피', '/recipt')}
          />
        </nav>
      </div>

      {/* 하단 프로필 */}
      <div className="w-full h-[70px] bg-[#F0F0F0] flex items-center px-5">
        <div className="w-[30px] h-[30px] bg-[#A7A7A7] rounded-md" />
        <span className="ml-4 text-[#212121] font-[Gretoon] text-[16px]">
          박건민
        </span>
        <img
          src={LogoutIcon}
          alt="로그아웃"
          className="ml-auto w-8 h-8 cursor-pointer"
        />
      </div>
    </aside>
  );
}
