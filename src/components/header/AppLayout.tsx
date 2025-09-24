import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import SettingsModal from './SettingsModal';
import { AnimatePresence, motion } from 'framer-motion';

type Props = {
  children: React.ReactNode;
  withHeader?: boolean;
};

export default function AppLayout({ children, withHeader = true }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* 앱 프레임 */}
      <div className="relative w-[430px] h-[932px] bg-white shadow-lg flex flex-col overflow-hidden">
        {/* 헤더 */}
        {withHeader && (
          <Header
            onOpenSidebar={() => setIsSidebarOpen(true)}
            onOpenModal={() => setIsModalOpen(true)}
          />
        )}

        {/* 메인 컨텐츠 */}
        <main className="flex-1 overflow-y-auto">{children}</main>

        {/* 사이드바 (앱 프레임 안에서만 열림) */}
        <AnimatePresence initial={false}>
          {isSidebarOpen && (
            <motion.div
              className="absolute inset-0 z-40 flex"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* 반투명 배경 (페이드 인/아웃) */}
              <motion.div
                className="absolute inset-0 bg-black/40"
                onClick={() => setIsSidebarOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />

              {/* 사이드바 본체 (슬라이드 인/아웃) */}
              <motion.div
                className="relative z-50"
                initial={{ x: -270 }}
                animate={{ x: 0 }}
                exit={{ x: -270 }}
                transition={{ type: 'tween', duration: 0.25 }}
              >
                <Sidebar onClose={() => setIsSidebarOpen(false)} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 모달 (앱 프레임 안에서만 열림) */}
        {isModalOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center">
            {/* 반투명 배경 */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsModalOpen(false)}
            />
            <SettingsModal onClose={() => setIsModalOpen(false)} />
          </div>
        )}
      </div>
    </div>
  );
}
