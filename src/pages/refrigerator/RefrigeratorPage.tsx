import React, { useEffect, useState, useCallback } from 'react';
import IngredientCard from '@/components/common/IngredientCard';
import RefrigeratorTab from '@/components/common/RefrigeratorTab';
import ToolItem from '@/components/common/ToolItem';
import IngredientDetailModal from '@/components/common/IngredientDetailModal';
import api from '@/lib/axios';

interface Ingredient {
  userFoodId: string;
  name: string;
  amount: number;
  expireDate: string;
  unit: string;
  imageUrl?: string;
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
  const [loading, setLoading] = useState(false);
  const [toolLoading, setToolLoading] = useState(false);
  const [selectedIngredientId, setSelectedIngredientId] = useState<
    string | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      } catch (error) {
        console.error('[RefrigeratorPage] 재료 불러오기 실패:', error);
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
          .filter(([, value]) => value)
          .map(
            ([key]) =>
              Object.keys(toolMap).find((k) => toolMap[k] === key) || '',
          )
          .filter((v) => v !== '');
        setSelectedTools(activeTools);
      }
    } catch (error) {
      console.error('[RefrigeratorPage] 도구 불러오기 실패:', error);
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
    } catch (error) {
      console.error('[RefrigeratorPage] 도구 업데이트 실패:', error);
    }
  };

  const handleIngredientClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, id: string) => {
      e.stopPropagation();
      if (isModalOpen) return;
      setSelectedIngredientId(id);
      setIsModalOpen(true);
    },
    [isModalOpen],
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedIngredientId(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center px-6 relative">
      <div className="fixed left-0 w-full z-30 justify-center">
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
                  <div
                    key={item.userFoodId}
                    onClick={(e) => handleIngredientClick(e, item.userFoodId)}
                  >
                    <IngredientCard
                      name={item.name}
                      image={item.imageUrl || 'https://placehold.co/245x163'}
                      date={new Date(item.expireDate).toLocaleDateString(
                        'ko-KR',
                      )}
                      quantity={`${item.amount}${item.unit}`}
                    />
                  </div>
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
            {tools.map((toolName) => (
              <ToolItem
                key={toolName}
                name={toolName}
                isSelected={selectedTools.includes(toolName)}
                onClick={() => handleToolClick(toolName)}
              />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && selectedIngredientId && (
        <IngredientDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          ingredientId={selectedIngredientId}
        />
      )}
    </div>
  );
}
