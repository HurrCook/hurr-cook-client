import React from 'react';

type Props = {
  text: string;
  profile: string;
  className?: string;
};

export default function OtherMessage({ text, profile, className = '' }: Props) {
  return (
    <div className={`flex items-start gap-2 ${className}`}>
      <img src={profile} alt="상대 프로필" className="w-8 h-8 rounded-full" />
      <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg max-w-[70%] text-sm">
        {text}
      </div>
    </div>
  );
}
