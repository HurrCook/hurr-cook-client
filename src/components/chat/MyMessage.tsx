import React from 'react';

interface MyMessageProps {
  text: string;
}

export default function MyMessage({ text }: MyMessageProps) {
  return (
    <div className="flex justify-end mb-2">
      <div className="bg-[#FF8800] text-white rounded-xl px-3 py-2 max-w-[70%] text-sm">
        {text}
      </div>
    </div>
  );
}
