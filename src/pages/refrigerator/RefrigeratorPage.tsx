// src/pages/refrigerator/RefrigeratorPage.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import IngredientCard from '@/components/common/IngredientCard';
import RefrigeratorTab from '@/components/common/RefrigeratorTab';
import ToolItem from '@/components/common/ToolItem';
import IngredientDetailModal from '@/components/common/IngredientDetailModal';
import api from '@/lib/axios';
import { AxiosError } from 'axios';
import DefaultGoodUrl from '@/assets/default_good.svg?url';
import DefaultBadUrl from '@/assets/default_bad.svg?url';

function IngredientSkeletonCard() {
  return <div className="w-44 h-52 bg-gray-200 rounded-xl animate-pulse" />;
}

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

interface LocationState {
  refresh?: boolean;
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

  const location = useLocation() as { state?: LocationState };

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

  const fetchIngredients = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/ingredients');
      if (res.data.success && Array.isArray(res.data.data)) {
        setIngredients(res.data.data);
      } else {
        setIngredients([]);
      }
    } catch (error: unknown) {
      const err = error as AxiosError;
      if (err.response)
        console.error('[GET /ingredients 오류]', err.response.data);
      setIngredients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIngredients();
  }, [fetchIngredients]);

  useEffect(() => {
    if (location?.state?.refresh) {
      fetchIngredients();
      window.history.replaceState({}, document.title);
    }
  }, [location?.state?.refresh, fetchIngredients]);

  const fetchTools = useCallback(async () => {
    setToolLoading(true);
    try {
      const res = await api.get('/api/cookwares');
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
    } catch (error: unknown) {
      const err = error as AxiosError;
      if (err.response)
        console.error('[GET /cookwares 오류]', err.response.data);
      setSelectedTools([]);
    } finally {
      setToolLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTools();
  }, [fetchTools]);

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
      await api.post('/api/cookwares', payload);
    } catch (error: unknown) {
      const err = error as AxiosError;
      if (err.response)
        console.error('[POST /cookwares 오류]', err.response.data);
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

  // ✅ 날짜 비교를 위한 헬퍼 함수: 시간을 00:00:00으로 정규화 (안전 복사 적용)
  const normalizeDate = (date: Date) => {
    const safeDate = new Date(date); // 원본 객체 복사
    safeDate.setHours(0, 0, 0, 0);
    return safeDate;
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center px-6 relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="fixed left-0 w-full z-30 justify-center">
        <div className="w-full mt-[-1.3vh] px-4 ">
          <RefrigeratorTab activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </div>

      <div className="h-[60px]" />

      <div className="w-full max-w-[700px]">
        {activeTab === 'ingredient' ? (
          loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-4">
              {Array.from({ length: 6 }).map((_, idx) => (
                <IngredientSkeletonCard key={idx} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {ingredients.length > 0 ? (
                ingredients.map((item, index) => {
                  // 🚨 수정된 만료 로직 적용 🚨
                  const today = normalizeDate(new Date());
                  const expiryDate = normalizeDate(new Date(item.expireDate));

                  // 만료일 다음 날부터 만료 (expiryDate < today)
                  const isExpired = expiryDate < today; // ✅ 핵심 수정: <= 를 < 로 변경

                  let imageSrc = isExpired ? DefaultBadUrl : DefaultGoodUrl; // ✅ 기본 이미지 조건 분기

                  if (item.imageUrl) {
                    if (item.imageUrl.startsWith('data:image')) {
                      imageSrc = item.imageUrl;
                    } else if (item.imageUrl.startsWith('http')) {
                      imageSrc = item.imageUrl;
                    } else if (/^[A-Za-z0-9+/=]+$/.test(item.imageUrl)) {
                      imageSrc = `data:image/png;base64,${item.imageUrl}`;
                    }
                  }

                  return (
                    <motion.div
                      key={item.userFoodId}
                      onClick={(e) => handleIngredientClick(e, item.userFoodId)}
                      className="cursor-pointer"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: index * 0.05 }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <IngredientCard
                        name={item.name}
                        // 💡 toLocaleDateString('ko-KR')는 YYYY. M. D. 형태로 출력
                        date={new Date(item.expireDate).toLocaleDateString(
                          'ko-KR',
                        )}
                        image={imageSrc}
                        quantity={`${item.amount}${item.unit}`}
                        expired={isExpired} // 🔥 수정된 만료 여부 전달
                      />
                    </motion.div>
                  );
                })
              ) : (
                <p className="col-span-2 text-center text-gray-500 mt-10">
                  냉장고에 등록된 재료가 없습니다.
                </p>
              )}
            </div>
          )
        ) : toolLoading ? (
          <p className="text-center text-gray-500 mt-10">불러오는 중...</p>
        ) : (
          <div className="flex flex-col gap-3 mt-4">
            {tools.map((toolName, index) => (
              <motion.div
                key={toolName}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <ToolItem
                  name={toolName}
                  isSelected={selectedTools.includes(toolName)}
                  onClick={() => handleToolClick(toolName)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && selectedIngredientId && (
        <IngredientDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          ingredientId={selectedIngredientId}
          onUpdated={fetchIngredients}
        />
      )}
    </motion.div>
  );
}
