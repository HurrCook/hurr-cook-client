import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FooterButton from '/src/components/common/FooterButton';
// ❌ CameraModal, ImageOptionsModal은 현재 코드에서 제거됨 (필요시 임포트)
import IngredientEditList, {
  IngredientEditData,
} from '@/components/common/IngredientEditList'; // 💡 새 컴포넌트 임포트

export default function UserInfoPage2() {
  const navigate = useNavigate();
  // 💡 사용되지 않는 상태는 주석 처리하거나 제거 (여기서는 제거)

  // 💡 데이터 정의 (수정된 타입 사용 및 단위 추가)
  const [ingredients] = useState<IngredientEditData[]>([
    {
      id: 1,
      name: '피망',
      image: 'https://placehold.co/100x91',
      date: '2025.08.30',
      quantity: '3',
      unit: 'EA',
    },
    {
      id: 2,
      name: '피망',
      image: 'https://placehold.co/100x91',
      date: '2025.08.30',
      quantity: '3',
      unit: 'EA',
    },
    {
      id: 3,
      name: '피망',
      image: 'https://placehold.co/100x91',
      date: '2025.08.30',
      quantity: '3',
      unit: 'EA',
    },
    {
      id: 4,
      name: '피망',
      image: 'https://placehold.co/100x91',
      date: '2025.08.30',
      quantity: '3',
      unit: 'EA',
    },
    {
      id: 5,
      name: '감자',
      image: 'https://placehold.co/100x91',
      date: '2025.08.30',
      quantity: '5',
      unit: 'KG',
    },
    {
      id: 6,
      name: '배추',
      image: 'https://placehold.co/100x91',
      date: '2025.08.30',
      quantity: '1',
      unit: '포기',
    },
    {
      id: 7,
      name: '고기',
      image: 'https://placehold.co/100x91',
      date: '2025.08.30',
      quantity: '500',
      unit: 'g',
    },
  ]);

  // 💡 핸들러 함수들
  const handleNextClick = () => {
    navigate('/userinfopage3');
  }; // userinfopage3으로 이동하도록 수정

  return (
    // SettingLayout의 Outlet에 렌더링되므로, 이중 컨테이너 구조를 유지
    <div className="w-full h-full relative flex flex-col">
      {/* 0. CameraModal 렌더링 영역은 제거됨 */}
      {/* 1. ImageOptionsModal 렌더링 영역은 제거됨 */}

      {/* 상단 타이틀/설명: Header(127px) 바로 아래부터 시작하도록 마진 조정 */}

      {/* 🚀 메인 스크롤 영역: 재료 목록 배치 */}
      <div
        className="flex-grow overflow-y-auto w-full flex justify-center"
        style={{ paddingBottom: '15.99%' }}
      >
        {/* 💡 재료 목록 영역: 타이틀 아래에 바로 시작 */}
        <div className="w-full flex justify-center ">
          {' '}
          {/* 타이틀 아래 간격 추가 */}
          {/* 💡 너비 86.98% 컨테이너 (양옆 28px 간격 확보) */}
          <div className="w-[86.98%]">
            <IngredientEditList ingredients={ingredients} />
          </div>
        </div>
      </div>

      {/* 푸터 영역 (fixed) */}
      <div className="w-full bg-gradient-to-b from-white/0 to-white backdrop-blur-[2px] flex flex-col items-center h-[15.99%] fixed bottom-0 inset-x-0">
        <div className="h-[26.17%] w-full"></div>
        <FooterButton
          className="w-[82.79%] h-[32.21%]"
          onClick={handleNextClick}
        >
          다음으로
        </FooterButton>
        <div className="flex-grow w-full"></div>
      </div>
    </div>
  );
}
