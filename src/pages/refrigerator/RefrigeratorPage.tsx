import React, { useState } from 'react';
import IngredientCard from '@/components/common/IngredientCard';
import RefrigeratorTab from '@/components/common/RefrigeratorTab';
import ToolItem from '@/components/common/ToolItem';

export default function RefrigeratorPage() {
  const [activeTab, setActiveTab] = useState<'ingredient' | 'tool'>(
    'ingredient',
  );
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  const ingredients = [
    {
      name: '당근',
      image: 'https://placehold.co/245x163',
      date: '2025.11.30',
      quantity: '3개',
    },
    {
      name: '양파',
      image: 'https://placehold.co/245x163',
      date: '2025.08.02',
      quantity: '2개',
    },
    {
      name: '피망',
      image: 'https://placehold.co/245x163',
      date: '2025.10.15',
      quantity: '1개',
    },
    {
      name: '계란',
      image: 'https://placehold.co/245x163',
      date: '2025.12.25',
      quantity: '10개',
    },
    {
      name: '대파',
      image: 'https://placehold.co/245x163',
      date: '2025.11.28',
      quantity: '5개',
    },
    {
      name: '돼지고기',
      image: 'https://placehold.co/245x163',
      date: '2025.11.01',
      quantity: '500g',
    },
  ];

  const tools = [
    { name: '프라이팬' },
    { name: '도마' },
    { name: '칼' },
    { name: '냄비' },
    { name: '국자' },
    { name: '거품기' },
  ];

  const handleToolClick = (toolName: string) => {
    setSelectedTools((prev) =>
      prev.includes(toolName)
        ? prev.filter((t) => t !== toolName)
        : [...prev, toolName],
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-6 relative">
      <div className="fixed left-0 w-full z-29 justify-center">
        <div className="w-full mt-[-1.3vh] px-4 py-2 bg-white">
          <RefrigeratorTab activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </div>

      {/* 탭 높이만큼 여백 확보 */}
      <div className="h-[60px]" />

      <div className="mt-6 w-full max-w-[700px]">
        {activeTab === 'ingredient' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {ingredients.map((item, index) => (
              <IngredientCard
                key={index}
                name={item.name}
                image={item.image}
                date={item.date}
                quantity={item.quantity}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {tools.map((tool, index) => (
              <ToolItem
                key={index}
                name={tool.name}
                isSelected={selectedTools.includes(tool.name)}
                onClick={() => handleToolClick(tool.name)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
