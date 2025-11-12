// src/pages/user/UserInfoPage3.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FooterButton from '@/components/common/FooterButton';
import ToolItem from '@/components/common/ToolItem';
import axiosInstance from '@/apis/axiosInstance';

const DISPLAY_TOOLS = [
  '냄비',
  '프라이팬',
  '쿠커',
  '찜기',
  '오븐',
  '전자레인지',
  '토스터',
  '에어프라이어',
] as const;

type DisplayTool = (typeof DISPLAY_TOOLS)[number];

type CookwaresPayload = {
  hasPot: boolean; // 냄비
  hasPan: boolean; // 프라이팬
  hasCooker: boolean; // 쿠커 (압력솥 대신)
  hasSteamer: boolean; // 찜기
  hasOven: boolean; // 오븐
  hasMicro: boolean; // 전자레인지
  hasToaster: boolean; // 토스터
  hasAirFryer: boolean; // 에어프라이어
};

// ✅ Swagger에 맞춘 key 매핑
const TOOL_TO_KEY: Record<DisplayTool, keyof CookwaresPayload> = {
  냄비: 'hasPot',
  프라이팬: 'hasPan',
  쿠커: 'hasCooker',
  찜기: 'hasSteamer',
  오븐: 'hasOven',
  전자레인지: 'hasMicro',
  토스터: 'hasToaster',
  에어프라이어: 'hasAirFryer',
};

export default function UserInfoPage3() {
  const navigate = useNavigate();
  const [selectedTools, setSelectedTools] = useState<Set<DisplayTool>>(
    new Set(),
  );
  const [loading, setLoading] = useState(false);

  // ✅ 선택된 도구 상태 기반으로 payload 자동 생성
  const cookwaresPayload: CookwaresPayload = useMemo(() => {
    const payload: CookwaresPayload = {
      hasPot: false,
      hasPan: false,
      hasCooker: false,
      hasSteamer: false,
      hasOven: false,
      hasMicro: false,
      hasToaster: false,
      hasAirFryer: false,
    };
    selectedTools.forEach((tool) => {
      const key = TOOL_TO_KEY[tool];
      if (key) payload[key] = true;
    });
    return payload;
  }, [selectedTools]);

  // ✅ 서버에서 도구 목록 GET
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get('/cookwares');
        if (data?.success && data?.data) {
          const server: CookwaresPayload = data.data;
          const next = new Set<DisplayTool>();
          (Object.keys(TOOL_TO_KEY) as DisplayTool[]).forEach((displayName) => {
            const key = TOOL_TO_KEY[displayName];
            if (server[key]) next.add(displayName);
          });
          setSelectedTools(next);
        }
      } catch (error) {
        console.error('❌ GET /cookwares 실패:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ✅ 도구 선택 토글
  const handleToolClick = (toolName: DisplayTool) => {
    setSelectedTools((prev) => {
      const next = new Set(prev);
      if (next.has(toolName)) next.delete(toolName);
      else next.add(toolName);
      return next;
    });
  };

  // ✅ 다음 버튼 클릭 시 POST
  const handleNextClick = async () => {
    try {
      const { data } = await axiosInstance.post(
        '/cookwares',
        cookwaresPayload,
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
      if (data?.success) {
        navigate('/userinfopage4');
      } else {
        console.warn('⚠️ /cookwares 응답 실패:', data);
      }
    } catch (error) {
      console.error('❌ POST /cookwares 실패:', error);
    }
  };

  return (
    <div className="w-full h-full relative flex flex-col mt-[0.5px]">
      <div
        className="flex-grow overflow-y-auto w-full flex justify-center"
        style={{ paddingBottom: '15.99%' }}
      >
        <div className="w-[86.98%] inline-flex flex-col justify-start items-start gap-3">
          {DISPLAY_TOOLS.map((tool) => (
            <ToolItem
              key={tool}
              name={tool}
              isSelected={selectedTools.has(tool)}
              onClick={() => handleToolClick(tool)}
            />
          ))}
          {loading && (
            <p className="text-sm text-neutral-500 mt-2">불러오는 중...</p>
          )}
        </div>
      </div>

      <div className="w-full bg-gradient-to-b from-white/0 to-white backdrop-blur-[2px] flex flex-col items-center h-[15.99%] fixed bottom-0 inset-x-0">
        <div className="h-[26.17%] w-full" />
        <FooterButton
          className="w-[82.79%] h-[32.21%]"
          onClick={handleNextClick}
        >
          다음으로
        </FooterButton>
        <div className="flex-grow w-full" />
      </div>
    </div>
  );
}
