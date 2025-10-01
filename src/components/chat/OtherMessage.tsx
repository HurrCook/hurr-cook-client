import React from 'react';

type OtherMessageProps = {
  text: string;
  profile: string;
};

export default function OtherMessage({ text, profile }: OtherMessageProps) {
  return (
    <div className="flex items-start gap-2">
      {/* 프로필 아이콘 */}
      <img src={profile} alt="상대 프로필" className="w-8 h-8 rounded-full" />

      {/* 말풍선 */}
      <div className="bg-gray-100 px-3 py-2 rounded-xl text-sm text-gray-800 max-w-[70%]">
        {text}
      </div>
    </div>
  );
}
