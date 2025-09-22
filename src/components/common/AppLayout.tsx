// src/components/common/AppLayout.tsx
import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: Props) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-[430px] h-[932px] bg-white shadow-lg overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
