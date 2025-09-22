import React from 'react';
import Header from './Header';

type Props = {
  children: React.ReactNode;
  onOpenDrawer?: () => void;
  onOpenSettings?: () => void;
  withHeader?: boolean;
};

export default function AppLayout({
  children,
  onOpenDrawer,
  onOpenSettings,
  withHeader = true,
}: Props) {
  return (
    <div className="flex flex-col min-h-screen bg-white text-textDark font-sans">
      {/* 상단 헤더 */}
      {withHeader && (
        <div className="shrink-0">
          <Header onLeftClick={onOpenDrawer} onRightClick={onOpenSettings} />
        </div>
      )}

      {/* 본문 컨텐츠 */}
      <main className="flex-1 w-full max-w-screen-sm mx-auto px-4 pb-[calc(16px+env(safe-area-inset-bottom))]">
        {children}
      </main>
    </div>
  );
}
