import React, { useEffect, useState } from 'react';
import IngredientCard from '@/components/common/IngredientCard';
import RefrigeratorTab from '@/components/common/RefrigeratorTab';
import ToolItem from '@/components/common/ToolItem';
import api from '@/lib/axios';

interface Ingredient {
  userFoodId: string;
  name: string;
  amount: number;
  expireDate: string;
  unit: string;
}

interface CookwareResponse {
  hasPot: boolean;
  hasPan: boolean;
  hasCooker: boolean;
  hasSteamer: boolean;
  hasOven: boolean;
  hasMicro: boolean;
  hasToaster: boolean;
  hasAirFryer: boolean;
}

export default function RefrigeratorPage() {
  const [activeTab, setActiveTab] = useState<'ingredient' | 'tool'>(
    'ingredient',
  );
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [toolLoading, setToolLoading] = useState<boolean>(false);

  const toolMap: Record<string, keyof CookwareResponse> = {
    냄비: 'hasPot',
    프라이팬: 'hasPan',
    쿠커: 'hasCooker',
    찜기: 'hasSteamer',
    오븐: 'hasOven',
    전자레인지: 'hasMicro',
    토스터: 'hasToaster',
    에어프라이어: 'hasAirFryer',
  };

  const tools = Object.keys(toolMap);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        setLoading(true);
        const res = await api.get('/ingredients');
        if (res.data.success && Array.isArray(res.data.data)) {
          setIngredients(res.data.data);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchIngredients();
  }, []);

  const fetchTools = async () => {
    try {
      setToolLoading(true);
      const res = await api.get('/cookwares');
      if (res.data.success && res.data.data) {
        const activeTools = Object.entries(res.data.data)
          .filter(([_, value]) => value === true)
          .map(
            ([key]) =>
              Object.keys(toolMap).find((k) => toolMap[k] === key) || '',
          )
          .filter((v) => v !== '');
        setSelectedTools(activeTools);
      }
    } catch {
    } finally {
      setToolLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleToolClick = async (toolName: string) => {
    const updatedTools = selectedTools.includes(toolName)
      ? selectedTools.filter((t) => t !== toolName)
      : [...selectedTools, toolName];

    setSelectedTools(updatedTools);

    const payload: CookwareResponse = {
      hasPot: updatedTools.includes('냄비'),
      hasPan: updatedTools.includes('프라이팬'),
      hasCooker: updatedTools.includes('쿠커'),
      hasSteamer: updatedTools.includes('찜기'),
      hasOven: updatedTools.includes('오븐'),
      hasMicro: updatedTools.includes('전자레인지'),
      hasToaster: updatedTools.includes('토스터'),
      hasAirFryer: updatedTools.includes('에어프라이어'),
    };

    try {
      await api.post('/cookwares', payload);
      await api.get('/cookwares');
    } catch {}
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-6 relative">
      <div className="fixed left-0 w-full z-29 justify-center">
        <div className="w-full mt-[-1.3vh] px-4 py-2 bg-white">
          <RefrigeratorTab activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </div>

      <div className="h-[60px]" />

      <div className="w-full max-w-[700px]">
        {activeTab === 'ingredient' ? (
          loading ? (
            <p className="text-center text-gray-500 mt-10">불러오는 중...</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {ingredients.length > 0 ? (
                ingredients.map((item) => (
                  <IngredientCard
                    key={item.userFoodId}
                    name={item.name}
                    image="https://placehold.co/245x163"
                    date={new Date(item.expireDate).toLocaleDateString('ko-KR')}
                    quantity={`${item.amount}${item.unit}`}
                  />
                ))
              ) : (
                <p className="col-span-2 text-center text-gray-500">
                  냉장고에 등록된 재료가 없습니다.
                </p>
              )}
            </div>
          )
        ) : toolLoading ? (
          <p className="text-center text-gray-500 mt-10">불러오는 중...</p>
        ) : (
          <div className="flex flex-col gap-3">
            {tools.map((toolName, index) => (
              <ToolItem
                key={index}
                name={toolName}
                isSelected={selectedTools.includes(toolName)}
                onClick={() => handleToolClick(toolName)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
