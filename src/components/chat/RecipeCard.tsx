// src/components/chat/RecipeCard.tsx
import React, { useState } from 'react';
import LikeOff from '@/assets/좋아요1.svg';
import LikeOn from '@/assets/좋아요2.svg';
import DefaultFoodImage from '@/assets/FoodImage.svg';
import RecipeModal from '@/components/common/RecipeModal';
import api from '@/lib/axios';
import { AxiosError } from 'axios';

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  userFoodId?: string;
}

interface RecipePayload {
  title: string;
  image: string;
  ingredients: Ingredient[];
  steps: string[];
  time: string;
}

interface RecipeCardProps {
  title: string;
  ingredients: string;
  steps: string;
  onSaved?: () => void;
}

export default function RecipeCard({
  title,
  ingredients,
  steps,
  onSaved,
}: RecipeCardProps) {
  const [liked, setLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const parseIngredientItem = (item: string): Ingredient => {
    const trimmed = item.trim();
    if (!trimmed) return { name: '', amount: 1, unit: 'EA' };

    const parts = trimmed.split(/\s+/);
    const last = parts[parts.length - 1];
    const name = parts.slice(0, -1).join(' ') || parts[0];

    const amountMatch = last.match(/[\d.]+/);
    const amount = amountMatch ? Number(amountMatch[0]) : 1;
    const unitRaw = last.replace(/[\d.]/g, '').trim();
    const unit = unitRaw && unitRaw.length > 0 ? unitRaw : 'EA';

    return { name, amount, unit, userFoodId: `${name}_${Date.now()}` };
  };

  const handleLikeClick = async (): Promise<void> => {
    const newLiked = !liked;
    setLiked(newLiked);
    if (!newLiked) return;

    setSaving(true);
    try {
      const ingArray: Ingredient[] = ingredients
        .split(',')
        .map((it) => it.trim())
        .filter(Boolean)
        .map(parseIngredientItem);

      const payload: RecipePayload = {
        title,
        image: DefaultFoodImage, // ✅ 무조건 기본 이미지
        ingredients: ingArray,
        steps: steps
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        time: '15분',
      };

      await api.post('/recipes', payload);
      onSaved?.();
    } catch (error: unknown) {
      const err = error as AxiosError;
      console.error('[RecipeCard] API 오류:', err.message);
      if (err.response)
        console.error('[RecipeCard] 응답 본문:', err.response.data);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div
        style={{
          width: '95%',
          background: 'white',
          borderRadius: 12,
          padding: 22,
          paddingBottom: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
          boxShadow: '0 1px 6px rgba(0,0,0,0.12)',
          maxHeight: 600,
          overflow: 'hidden',
        }}
      >
        {/* 이미지 + 제목 + 좋아요 */}
        <div style={{ display: 'flex', gap: 12 }}>
          <div
            style={{
              width: 110,
              height: 110,
              borderRadius: 12,
              border: '1px solid #BEBEBE',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <img
              src={DefaultFoodImage} // ✅ 기본 이미지로 고정
              alt={title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              gap: 18,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontFamily: 'Pretendard',
                  fontWeight: 600,
                  color: '#212121',
                  maxWidth: '100px',
                  wordBreak: 'break-word',
                  lineHeight: '1.3',
                }}
              >
                {title}
              </div>

              <img
                src={liked ? LikeOn : LikeOff}
                alt="좋아요"
                onClick={saving ? undefined : handleLikeClick}
                style={{
                  width: 23,
                  height: 20,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  userSelect: 'none',
                  transition: 'transform 0.15s ease-in-out',
                  transform: liked ? 'scale(1.1)' : 'scale(1)',
                  opacity: saving ? 0.6 : 1,
                }}
              />
            </div>

            <div
              style={{
                fontSize: 11,
                fontFamily: 'Pretendard',
                color: '#595959',
                lineHeight: '1.4',
              }}
            >
              <strong style={{ color: '#212121' }}>필요한 재료:</strong>{' '}
              {ingredients}
            </div>
          </div>
        </div>

        {/* 만드는 순서 */}
        <div
          style={{
            position: 'relative',
            fontSize: 11,
            fontFamily: 'Pretendard',
            color: '#595959',
            lineHeight: '1.6',
            whiteSpace: 'pre-line',
            overflow: 'hidden',
            maxHeight: 340,
            maskImage:
              'linear-gradient(180deg, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage:
              'linear-gradient(180deg, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)',
          }}
        >
          <strong style={{ color: '#212121' }}>만드는 순서</strong>
          <br />
          {steps}
        </div>

        {/* 요리하기 버튼 */}
        <button
          onClick={handleOpenModal}
          style={{
            alignSelf: 'flex-end',
            background: '#FF8800',
            color: 'white',
            fontFamily: 'Pretendard',
            fontSize: 12,
            borderRadius: 8,
            padding: '4px 10px',
            border: 'none',
            cursor: 'pointer',
            marginTop: 8,
          }}
        >
          요리하기
        </button>
      </div>

      {/* 레시피 모달 */}
      {isModalOpen && (
        <RecipeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          recipe={{
            id: Date.now(),
            name: title,
            image: DefaultFoodImage, // ✅ 모달에서도 기본 이미지로 고정
            ingredients: ingredients.split(',').map((item) => {
              const parsed = parseIngredientItem(item);
              return {
                name: parsed.name,
                quantity: parsed.amount.toString(),
                userFoodId: parsed.userFoodId,
              };
            }),
            instructions: steps
              .split('\n')
              .map((s) => s.trim())
              .filter(Boolean),
          }}
        />
      )}
    </>
  );
}
