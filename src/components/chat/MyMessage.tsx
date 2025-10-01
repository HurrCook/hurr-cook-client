import React from 'react';

export default function MyMessage({
  text,
  className = '',
}: {
  text: string;
  className?: string;
}) {
  return (
    <div className={`flex justify-end ${className}`}>
      <div className="bg-[#FF8800] text-white px-3 py-2 rounded-lg max-w-[70%] text-sm">
        {text}
      </div>
    </div>
  );
}
