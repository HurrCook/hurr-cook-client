// /src/pages/userinfo/UserInfoPage3.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FooterButton from '/src/components/common/FooterButton';
import ToolItem from '@/components/common/ToolItem';
import axiosInstance from '@/apis/axiosInstance';

// 🧰 화면에 보일 도구 목록 (표시용 이름)
const DISPLAY_TOOLS = [
  '냄비',
  '프라이팬',
  '압력솥', // => hasCooker
  '찜기',
  '오븐',
  '전자레인지',
  '토스터',
  '에어프라이어', // ← 표준 표기로 통일 (에어프라이기 X)
  // 아래 추가 도구들은 현재 백엔드 스키마엔 없음(옵션): 선택/표시는 되지만 저장엔 반영 X
  '칼',
  '휘핑기',
  '갈갈이',
  '뒤집개',
  '젓가락',
  '숟가락',
] as const;
type DisplayTool = (typeof DISPLAY_TOOLS)[number];

// 🧭 표시명 ↔️ 백엔드 필드 매핑
const TOOL_TO_KEY: Record<string, keyof CookwaresPayload> = {
  냄비: 'hasPot',
  프라이팬: 'hasPan',
  압력솥: 'hasCooker',
  찜기: 'hasSteamer',
  오븐: 'hasOven',
  전자레인지: 'hasMicro',
  토스터: 'hasToaster',
  에어프라이어: 'hasAirFryer',
};

type CookwaresPayload = {
  hasPot: boolean;
  hasPan: boolean;
  hasCooker: boolean;
  hasSteamer: boolean;
  hasOven: boolean;
  hasMicro: boolean;
  hasToaster: boolean;
  hasAirFryer: boolean;
};

export default function UserInfoPage3() {
  const navigate = useNavigate();
  const [selectedTools, setSelectedTools] = useState<Set<DisplayTool>>(
    new Set(),
  );
  const [loading, setLoading] = useState(false);

  // ✅ 백엔드 스키마에 존재하는 도구만 추려서 payload 생성
  const cookwaresPayload: CookwaresPayload = useMemo(() => {
    const base: CookwaresPayload = {
      hasPot: false,
      hasPan: false,
      hasCooker: false,
      hasSteamer: false,
      hasOven: false,
      hasMicro: false,
      hasToaster: false,
      hasAirFryer: false,
    };
    selectedTools.forEach((toolName) => {
      const key = TOOL_TO_KEY[toolName];
      if (key) base[key] = true;
    });
    return base;
  }, [selectedTools]);

  // ✅ 최초 진입 시 DB 값 불러와서 선택 상태 복원
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get('/cookwares');
        // 기대 응답: { success: true, message: string | null, data: { ...CookwaresPayload } }
        console.log('🔎 /cookwares GET 응답:', data);

        if (data?.success && data?.data) {
          const server: CookwaresPayload = data.data;

          // 서버 true인 항목들을 표시명으로 역매핑
          const next = new Set<DisplayTool>();
          (Object.keys(TOOL_TO_KEY) as DisplayTool[]).forEach((displayName) => {
            const key = TOOL_TO_KEY[displayName];
            if (server[key]) next.add(displayName);
          });

          setSelectedTools(next);
        }
      } catch (err) {
        console.error('❌ 조리도구 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ✅ 토글 클릭
  const handleToolClick = (toolName: DisplayTool) => {
    setSelectedTools((prev) => {
      const next = new Set(prev);
      if (next.has(toolName)) next.delete(toolName);
      else next.add(toolName);
      return next;
    });
  };

  // ✅ 저장(다음) 버튼 → POST /cookwares
  const handleNextClick = async () => {
    console.log('🧾 저장할 payload:', cookwaresPayload);
    try {
      const { data } = await axiosInstance.post(
        '/cookwares',
        cookwaresPayload,
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      // 기대 응답: { success: true, message: "string", data: "string" }
      console.log('✅ /cookwares POST 응답 전체:', data);
      console.log('📩 success:', data?.success);
      console.log('📝 message:', data?.message);
      console.log('📦 data:', data?.data);

      if (!data?.success) {
        alert(data?.message ?? '저장에 실패했습니다.');
        return;
      }

      alert('✅ 조리도구 설정이 저장되었습니다!');
      navigate('/userinfopage4');
    } catch (err) {
      console.error('❌ 조리도구 저장 실패:', err);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="w-full h-full relative flex flex-col mt-[0.5px]">
      {/* 스크롤 영역 */}
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

      {/* 푸터 (고정) */}
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
