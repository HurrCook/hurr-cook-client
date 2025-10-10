import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TabIcon from '@/assets/탭.svg';
import SettingIcon from '@/assets/세팅.svg';
import CameraIcon from '@/assets/카메라.svg';
import PencilIcon from '@/assets/연필.svg';
import ArrowIcon from '@/assets/arrow.svg';
import CameraModal from './CameraModal';

type HeaderProps = {
  onOpenSidebar: () => void;
  onOpenModal: () => void;
};

export default function Header({ onOpenSidebar, onOpenModal }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [cameraOn, setCameraOn] = useState(false);

  if (
    location.pathname.startsWith('/loading') ||
    location.pathname.startsWith('/refrigerator/photo-add') ||
    location.pathname.startsWith('/refrigerator/add')
  ) {
    return (
      <header className="fixed left-0 right-0 h-13 bg-white flex items-center px-4 z-30">
        <button onClick={() => navigate(-1)} className="z-10">
          <img
            src={ArrowIcon}
            alt="뒤로가기 아이콘"
            className="w-6 h-6 transform rotate-180"
          />
        </button>

        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-[#FF8800] font-[Gretoon] text-xl font-normal">
          Hurr Cook
        </h1>

        <div className="w-6 h-6" />
      </header>
    );
  }

  const renderRightButtons = () => {
    if (location.pathname.startsWith('/chat')) {
      return (
        <button onClick={onOpenModal}>
          <img src={SettingIcon} alt="세팅 아이콘" className="w-7 h-7" />
        </button>
      );
    }

    if (location.pathname.startsWith('/refrigerator')) {
      return (
        <div className="flex items-center space-x-3">
          <button onClick={() => setCameraOn(true)}>
            <img src={CameraIcon} alt="카메라 아이콘" className="w-7 h-7" />
          </button>
          <button onClick={() => navigate('/refrigerator/add')}>
            <img
              src={PencilIcon}
              alt="연필 아이콘"
              className="w-8 h-8 ml-1 mt-2"
            />
          </button>
        </div>
      );
    }

    if (location.pathname.startsWith('/receipt')) {
      return <div className="w-8 h-8 invisible pointer-events-none" />;
    }

    return (
      <button onClick={onOpenModal}>
        <img src={SettingIcon} alt="세팅 아이콘" />
      </button>
    );
  };

  return (
    <header className="fixed left-0 right-0 h-13 bg-white flex items-center px-4 z-30">
      <button onClick={onOpenSidebar} className="z-10">
        <img src={TabIcon} alt="탭 아이콘" className="w-6 h-6" />
      </button>

      <h1 className="absolute left-1/2 transform -translate-x-1/2 text-[#FF8800] font-[Gretoon] text-xl font-normal">
        Hurr Cook
      </h1>

      <div className="ml-auto z-10">{renderRightButtons()}</div>

      {cameraOn && <CameraModal onClose={() => setCameraOn(false)} />}
    </header>
  );
}
