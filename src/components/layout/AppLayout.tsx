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
      {withHeader && (
        <Header
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenModal={() => setIsModalOpen(true)}
        />
      )}

      {/* ✅ 헤더 fixed → main에 padding-top 줌 */}
      <main className="flex-1 overflow-y-auto pt-16">
        <Outlet />
      </main>

      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.div
            className="absolute inset-0 z-40 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsSidebarOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
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

      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsModalOpen(false)}
          />
          <SettingsModal onClose={() => setIsModalOpen(false)} />
        </div>
      )}
    </div>
  );
}
