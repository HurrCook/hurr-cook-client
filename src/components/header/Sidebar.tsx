import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Hurr3Icon from '@/assets/Hurr3.svg';
import SidebarItem from './SidebarItem';
import LogoutIcon from '@/assets/로그아웃.svg';

type SidebarProps = {
  onClose: () => void;
};

export default function Sidebar({ onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <aside className="w-[270px] h-full bg-white shadow-lg z-50 flex flex-col">
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center mb-6 relative">
          <img src={Hurr3Icon} alt="Hurr Cook Logo" className="w-10 h-10" />
          <h1 className="ml-4 text-[#FF8800] font-[Gretoon] text-l">
            Hurr Cook
          </h1>
        </div>

        <nav className="flex flex-col mt-2">
          <SidebarItem
            label="후르랑 대화하기"
            selected={location.pathname === '/chat'}
            onClick={() => handleNavigation('/chat')}
          />
          <SidebarItem
            label="내 냉장고"
            selected={location.pathname === '/refrigerator'}
            onClick={() => handleNavigation('/refrigerator')}
          />
          <SidebarItem
            label="저장된 레시피"
            selected={location.pathname === '/recipe'}
            onClick={() => handleNavigation('/recipe')}
          />
        </nav>
      </div>

      {/* 하단 프로필 */}
      <div className="w-full h-[70px] bg-[#F0F0F0] flex items-center px-5">
        <div className="w-[30px] h-[30px] bg-[#A7A7A7] rounded-md" />
        <span className="ml-2 mt-1 text-[#212121] font-[Gretoon] text-[16px]">
          박건민
        </span>
        <img
          src={LogoutIcon}
          alt="로그아웃"
          className="ml-auto w-6 h-6 cursor-pointer"
        />
      </div>
    </aside>
  );
}
