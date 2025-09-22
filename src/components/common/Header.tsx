import React from 'react';
import TabIcon from '@/assets/탭.svg';
import Logo from '@/assets/HurrCook-Color.svg';
import SettingIcon from '@/assets/세팅.svg';

type HeaderProps = {
  onLeftClick?: () => void;
  onRightClick?: () => void;
  className?: string;
};

const Header: React.FC<HeaderProps> = ({
  onLeftClick,
  onRightClick,
  className,
}) => {
  return (
    <header
      className={[
        'sticky top-0 z-50 bg-white border-b border-cardBorderLight',
        'h-20 md:h-24', // 모바일 80px, 데스크탑 96px
        className ?? '',
      ].join(' ')}
    >
      <div className="mx-auto w-full h-full flex items-center justify-between px-4">
        {/* 왼쪽 버튼 */}
        <button
          type="button"
          onClick={onLeftClick}
          className="flex items-center justify-center w-14 h-14 active:scale-95"
          aria-label="메뉴 열기"
        >
          <img src={TabIcon} alt="메뉴" className="w-8 h-8" />
        </button>

        {/* 중앙 로고 */}
        <img
          src={Logo}
          alt="Hurr Cook"
          className="h-10 md:h-12 object-contain max-w-[220px]"
        />

        {/* 오른쪽 버튼 */}
        <button
          type="button"
          onClick={onRightClick}
          className="flex items-center justify-center w-14 h-14 active:scale-95"
          aria-label="설정 열기"
        >
          <img src={SettingIcon} alt="설정" className="w-8 h-8" />
        </button>
      </div>
    </header>
  );
};

export default Header;
