// src/components/header/Sidebar.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Hurr3Icon from '@/assets/Hurr3.svg';
import SidebarItem from './SidebarItem';
import LogoutIcon from '@/assets/로그아웃.svg';
import ProfileIcon from '@/assets/profile.svg'; // ✅ 추가
import Button from '../common/Button';

type SidebarProps = {
  onClose: () => void;
};

export default function Sidebar({ onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [userName, setUserName] = useState('사용자');

  /** ✅ 로그인 이름 불러오기 */
  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) setUserName(storedName);
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  /** ✅ 로그아웃 처리 로직 */
  const handleLogoutConfirm = () => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userName');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('❌ 로그아웃 에러:', error);
    } finally {
      setIsLogoutModalOpen(false);
    }
  };

  const handleLogoutCancel = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      <aside className="w-[270px] h-screen bg-white shadow-lg flex flex-col justify-between overflow-hidden">
        {/* 상단: 로고 + 메뉴 */}
        <div className="p-4 flex flex-col">
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

        {/* ✅ 하단 프로필 */}
        <div className="w-full h-[70px] bg-[#F0F0F0] flex items-center px-5">
          <div className="w-[30px] h-[30px] bg-[#A7A7A7] rounded-md overflow-hidden">
            <img
              src={ProfileIcon}
              alt="프로필 아이콘"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="ml-2 mt-1 text-[#212121] font-[Gretoon] text-[16px]">
            {userName}
          </span>
          <img
            src={LogoutIcon}
            alt="로그아웃"
            className="ml-auto w-6 h-6 cursor-pointer"
            onClick={() => setIsLogoutModalOpen(true)}
          />
        </div>
      </aside>

      {/* ✅ 로그아웃 모달 */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[9999]">
          <div className="bg-white rounded-[9.6px] inline-flex p-6 w-72 flex-col items-center gap-7 shadow-lg">
            <p className="text-neutral-700 text-sm font-medium text-center">
              로그아웃 하시겠습니까?
            </p>
            <div className="flex gap-4 w-full justify-center">
              <Button color="cancel" onClick={handleLogoutCancel}>
                취소
              </Button>
              <Button color="default" onClick={handleLogoutConfirm}>
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
