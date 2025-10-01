import React, { useState } from 'react';
import Header from '../header/Header';
import Sidebar from '../header/Sidebar';
import SettingsModal from '../header/SettingsModal';
import { AnimatePresence, motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';

type Props = {
  withHeader?: boolean;
};

export default function AppLayout({ withHeader = true }: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex min-h-dvh w-full flex-col relative">
      {/* 상단 헤더 */}
      {withHeader && (
        <Header
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenModal={() => setIsModalOpen(true)}
        />
      )}

      {/* 메인 컨텐츠 */}
      <main className="flex-1 overflow-y-auto pt-16">
        <Outlet />
      </main>

      {/* 사이드바 */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* 배경 오버레이 */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setIsSidebarOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            {/* 사이드바 패널 */}
            <motion.div
              className="fixed top-0 left-0 z-50 h-screen"
              initial={{ x: -270 }}
              animate={{ x: 0 }}
              exit={{ x: -270 }}
              transition={{ type: 'tween', duration: 0.25 }}
            >
              <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 세팅 모달 */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40"
              onClick={() => setIsModalOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SettingsModal onClose={() => setIsModalOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
