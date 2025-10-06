import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FooterButton from '/src/components/common/FooterButton';
// 💡 ToolItem 임포트 (경로를 프로젝트에 맞게 수정해주세요)
import ToolItem from '@/components/common/ToolItem';

// 도구 목록 정의
const initialTools = [
  '냄비',
  '프라이팬',
  '압력솥',
  '찜기',
  '오븐',
  '전자레인지',
  '토스터',
  '에어프라이기',
  '칼',
  '휘핑기',
  '갈갈이',
  '뒤집개',
  '젓가락',
  '숟가락',
];

export default function UserInfoPage3() {
  const navigate = useNavigate();
  // 선택된 도구 상태 (Set<string> 사용)
  const [selectedTools, setSelectedTools] = useState<Set<string>>(new Set());

  const handleNextClick = () => {
    console.log('다음으로 클릭. 선택된 도구:', Array.from(selectedTools));
    navigate('/userinfopage4');
  };

  // 도구 클릭 핸들러 (선택/해제 토글)
  const handleToolClick = (toolName: string) => {
    setSelectedTools((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(toolName)) {
        newSet.delete(toolName);
      } else {
        newSet.add(toolName);
      }
      return newSet;
    });
  };

  return (
    <div className="w-full h-full relative flex flex-col">
      {/* 상단 타이틀/설명: Header(127px) 바로 아래부터 시작하도록 마진 조정 */}

      {/* 🚀 메인 스크롤 영역 (도구 목록 배치) */}
      <div
        className="flex-grow overflow-y-auto w-full flex justify-center"
        style={{ paddingBottom: '15.99%' }}
      >
        {/* 💡 도구 목록 컨테이너: Top 278px 위치 (127px + 151px) 및 너비 86.98% */}
        <div className="w-[86.98%] inline-flex flex-col justify-start items-start gap-3">
          {initialTools.map((tool) => (
            <ToolItem
              key={tool}
              name={tool}
              isSelected={selectedTools.has(tool)}
              onClick={() => handleToolClick(tool)}
            />
          ))}
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
