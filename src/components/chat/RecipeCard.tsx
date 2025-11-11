import React, { useState } from 'react';
import LikeOff from '@/assets/좋아요1.svg';
import LikeOn from '@/assets/좋아요2.svg';
import RecipeModal from '@/components/common/RecipeModal';
import api from '@/lib/axios';

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

interface RecipePayload {
  title: string;
  ingredients: Ingredient[];
  steps: string[];
  time: string;
  image: string;
}

export default function RecipeCard({
  imageUrl,
  title,
  ingredients,
  steps,
}: {
  imageUrl: string;
  title: string;
  ingredients: string;
  steps: string;
}) {
  const [liked, setLiked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleLikeClick = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    if (!newLiked) return;

    setSaving(true);
    try {
      const payload: RecipePayload = {
        title,
        ingredients: ingredients.split(',').map((item) => {
          const [name, amountUnit] = item.trim().split(' ');
          const [amount, unit] = amountUnit
            ? [
                amountUnit.replace(/[^0-9]/g, ''),
                amountUnit.replace(/[0-9]/g, ''),
              ]
            : [1, ''];
          return { name, amount: Number(amount) || 1, unit: unit || '' };
        }),
        steps: steps
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean),
        time: '15분',
        image: imageUrl,
      };

      const res = await api.post('/recipes', payload, {
        headers: { Authorization: undefined }, // 인증 필요 없음
      });

      const { success, message } = res.data;
      if (success) {
        alert('레시피가 저장되었습니다.');
      } else {
        alert(message || '응답 형식이 올바르지 않습니다.');
      }
    } catch (err) {
      console.error('API Error:', err);
      alert('서버 오류가 발생했습니다.');
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
          justifyContent: 'flex-start',
          gap: 22,
          boxShadow: '0 1px 6px rgba(0,0,0,0.12)',
          maxHeight: 600,
          overflow: 'hidden',
        }}
      >
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
              src={imageUrl}
              alt={title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
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

      {isModalOpen && (
        <RecipeModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onNext={() => {
            alert('재료 차감 완료!');
            handleCloseModal();
          }}
          recipe={{
            name: title,
            image: imageUrl,
            ingredients: ingredients.split(',').map((item) => {
              const [name, quantity] = item.trim().split(' ');
              return { name, quantity: quantity ?? '' };
            }),
            instructions: steps.split('\n'),
          }}
        />
      )}
    </>
  );
}
