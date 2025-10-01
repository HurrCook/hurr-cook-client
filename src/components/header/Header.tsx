import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import TabIcon from '@/assets/탭.svg';
import SettingIcon from '@/assets/세팅.svg';
import CameraIcon from '@/assets/카메라.svg';
import PencilIcon from '@/assets/연필.svg';
import CameraModal from './CameraModal';

//아 거지같은 깃허브
type HeaderProps = {
  onOpenSidebar: () => void;
  onOpenModal: () => void;
};

export default function Header({ onOpenSidebar, onOpenModal }: HeaderProps) {
  const location = useLocation();
  const [cameraOn, setCameraOn] = useState(false);

  const renderRightButtons = () => {
    if (location.pathname.startsWith('/chat')) {
      return (
        <button onClick={onOpenModal}>
          <img src={SettingIcon} alt="세팅 아이콘" className="w-8 h-8" />
        </button>
      );
    }

    if (location.pathname.startsWith('/refrigerator')) {
      return (
        <div className="flex items-center space-x-3">
          <button onClick={() => setCameraOn(true)}>
            <img src={CameraIcon} alt="카메라 아이콘" className="w-10 h-10" />
          </button>
          <button>
            <img
              src={PencilIcon}
              alt="연필 아이콘"
              className="w-10 h-10 ml-4 mt-2"
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
        <img src={SettingIcon} alt="세팅 아이콘" className="w-8 h-8" />
      </button>
    );
  };

  return (
    <header className="relative w-full h-13 bg-white flex items-center px-4 mt-3">
      <button onClick={onOpenSidebar} className="z-10">
        <img src={TabIcon} alt="탭 아이콘" className="w-8 h-8" />
      </button>

      <h1 className="absolute left-1/2 transform -translate-x-1/2 text-[#FF8800] font-[Gretoon] text-2xl font-normal">
        Hurr Cook
      </h1>

      <div className="ml-auto z-10">{renderRightButtons()}</div>

      {cameraOn && <CameraModal onClose={() => setCameraOn(false)} />}
    </header>
  );
}
