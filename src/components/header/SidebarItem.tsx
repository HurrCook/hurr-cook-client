import React from 'react';

type SidebarItemProps = {
  label: string;
  selected?: boolean;
  onClick?: () => void;
};

export default function SidebarItem({
  label,
  selected = false,
  onClick,
}: SidebarItemProps) {
  return (
    <div
      onClick={onClick}
      className={`w-full h-20 rounded-lg flex items-center px-4 cursor-pointer transition-colors ${
        selected ? 'bg-[#F0F0F0]' : 'bg-white hover:bg-gray-100'
      }`}
    >
      <span className="text-[#313131] text-[18px] font-pretendard">
        {label}
      </span>
      <div className="ml-auto w-6 h-6" />
    </div>
  );
}
//깃허브