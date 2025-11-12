// src/components/header/Header.tsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TabIcon from '@/assets/탭.svg';
import SettingIcon from '@/assets/세팅.svg';
import CameraIcon from '@/assets/카메라.svg';
import PencilIcon from '@/assets/연필.svg';
import ArrowIcon from '@/assets/arrow.svg';
import HeaderImageOptionsModal from '@/components/modal/HeaderImageOptionsModal';
import CameraModal from '@/components/header/CameraModal';

interface HeaderProps {
  onOpenSidebar: () => void;
  onOpenModal: () => void;
}

export default function Header({ onOpenSidebar, onOpenModal }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const [isImageOptionOpen, setIsImageOptionOpen] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // 뒤로가기 또는 냉장고 복귀 버튼
  if (
    location.pathname.startsWith('/loading') ||
    location.pathname.startsWith('/refrigerator/photo-add') ||
    location.pathname.startsWith('/refrigerator/add') ||
    location.pathname.startsWith('/fail')
  ) {
    return (
      <header className="fixed left-0 right-0 h-13 bg-white flex items-center px-4 z-30">
        <button
          onClick={() => {
            if (location.pathname.startsWith('/fail')) {
              navigate('/refrigerator');
            } else {
              navigate(-1);
            }
          }}
        >
          <img
            src={ArrowIcon}
            alt="뒤로가기"
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

  // 페이지별 오른쪽 버튼 렌더링
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
          <button
            onClick={() => setIsImageOptionOpen(true)}
            aria-label="카메라 열기"
          >
            <img src={CameraIcon} alt="카메라 아이콘" className="w-7 h-7" />
          </button>
          <button
            onClick={() => navigate('/refrigerator/add')}
            aria-label="재료 추가"
          >
            <img
              src={PencilIcon}
              alt="연필 아이콘"
              className="w-8 h-8 ml-1 mt-2"
            />
          </button>
        </div>
      );
    }

    return (
      <button onClick={onOpenModal} aria-label="설정 열기">
        <img src={SettingIcon} alt="세팅 아이콘" className="w-7 h-7" />
      </button>
    );
  };

  return (
    <>
      <header className="fixed left-0 right-0 h-13 bg-white flex items-center px-4 z-30">
        <button onClick={onOpenSidebar} aria-label="사이드바 열기">
          <img src={TabIcon} alt="탭 아이콘" className="w-6 h-6" />
        </button>

        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-[#FF8800] font-[Gretoon] text-xl font-normal">
          Hurr Cook
        </h1>

        <div className="ml-auto">{renderRightButtons()}</div>
      </header>

      {/* 이미지 선택 모달 */}
      <HeaderImageOptionsModal
        isVisible={isImageOptionOpen}
        onClose={() => setIsImageOptionOpen(false)}
        onLaunchCamera={() => {
          setIsImageOptionOpen(false);
          setTimeout(() => setIsCameraOpen(true), 100);
        }}
      />

      {/* 카메라 모달 */}
      {isCameraOpen && (
        <CameraModal
          onClose={() => setIsCameraOpen(false)}
          onCapture={(dataUrl: string) => {
            setIsCameraOpen(false);
            if (dataUrl) {
              const pureBase64 = dataUrl.startsWith('data:')
                ? dataUrl.split(',')[1]
                : dataUrl;
              navigate('/loading', { state: { base64_images: [pureBase64] } });
            } else {
              navigate('/fail');
            }
          }}
        />
      )}
    </>
  );
}
