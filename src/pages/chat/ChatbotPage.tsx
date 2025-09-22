import React from 'react';
import TabIcon from '@/assets/탭.svg';
import SettingIcon from '@/assets/세팅.svg';

export default function ChatbotPage() {
  return (
    <div className="relative w-full min-h-screen bg-white overflow-hidden">
      {/* 헤더 */}
      <div className="absolute top-[50px] left-0 w-[430px] h-[52px] bg-white flex items-center justify-between px-4">
        {/* 좌측 탭 */}
        <img src={TabIcon} alt="탭" className="w-6 h-6" />
        {/* 중앙 로고 텍스트 */}
        <span className="font-gretoon text-main text-[16px]">Hurr Cook</span>
        {/* 우측 세팅 */}
        <img src={SettingIcon} alt="세팅" className="w-6 h-6" />
      </div>

      {/* 입력창 */}
      <div className="absolute top-[832px] left-0 w-[430px] h-[100px] overflow-hidden">
        <div className="absolute top-[10px] left-[15px] w-[400px] h-[44px] rounded-[10px] outline outline-1 outline-[#BEBEBE] -outline-offset-1">
          <div className="absolute left-[359px] top-[12.1px] w-[20px] h-[19.8px] outline outline-2 outline-[#383838] -outline-offset-1" />
          <div className="absolute left-[14px] top-[13px] text-[#595959] text-[16px] font-pretendard font-normal">
            메시지
          </div>
        </div>
      </div>

      {/* 추천 문구 카드 */}
      <div className="absolute top-[756px] left-[15px] inline-flex gap-3 items-center">
        {/* 카드1 */}
        <div className="relative w-[134px] h-[67px] bg-[#F0F0F0] rounded-[12px] shadow-[1.2px_1.2px_4.8px_#EAEAEA] overflow-hidden">
          <div className="absolute left-[11.8px] top-[7.6px] w-[110.4px] text-[#3B3B3B] text-[14.4px] font-pretendard">
            계란과 양파로 만들
          </div>
          <div className="absolute left-[11.8px] top-[30px] w-[110.4px] text-[#595959] text-[12px] font-pretendard">
            수 있는 간단한 요리 알려줘!
          </div>
        </div>
        {/* 카드2 */}
        <div className="relative w-[184px] h-[66px] bg-[#F0F0F0] rounded-[12px] shadow-[1.2px_1.2px_4.8px_#EAEAEA] overflow-hidden">
          <div className="absolute left-[12.8px] top-[6.6px] w-[158.4px] text-[#3B3B3B] text-[14.4px] font-pretendard">
            프라이팬 하나로 만들 수 있고,
          </div>
          <div className="absolute left-[12.8px] top-[30px] w-[158.4px] text-[#595959] text-[12px] font-pretendard">
            설거지도 적게 나오는 요리 좀 추천해줘!
          </div>
        </div>
        {/* 카드3 */}
        <div className="relative w-[106px] h-[66px] bg-[#F0F0F0] rounded-[12px] shadow-[1.2px_1.2px_4.8px_#EAEAEA] overflow-hidden">
          <div className="absolute left-[4.8px] top-[9.6px] w-[86.4px] text-[#3B3B3B] text-[14.4px] font-pretendard">
            다 먹기 직전인
          </div>
          <div className="absolute left-[4.8px] top-[33px] w-[86.4px] text-[#595959] text-[12px] font-pretendard">
            재료로 요리 추천해줘!
          </div>
        </div>
        {/* 카드4 */}
        <div className="relative w-[168px] h-[72px] bg-[#F0F0F0] rounded-[12px] shadow-[1.2px_1.2px_4.8px_#EAEAEA] overflow-hidden">
          <div className="absolute left-[4.8px] top-[8.4px] w-[158.4px] text-[#3B3B3B] text-[14.4px] font-pretendard">
            지금 집에 있는 재료들로 만들
          </div>
          <div className="absolute left-[4.8px] top-[32px] w-[158.4px] text-[#595959] text-[12px] font-pretendard">
            수 있는 저녁 메뉴 중에서 칼로리 낮은 거 추천해줘!
          </div>
        </div>
      </div>

      {/* 후르 아이콘 */}
      <div className="absolute left-[135px] top-[316px] w-[160px] h-[180px] bg-white rounded-[14px]" />
      <div className="absolute left-[164px] top-[445px] text-center text-[#3B3B3B] text-[14px] font-pretendard">
        후르에게 레시피
        <br />
        추천을 받아볼까요?
      </div>
      <div className="absolute left-[167px] top-[339.66px] w-[95.98px] h-[95.31px] opacity-80">
        <img
          src="https://placehold.co/96x95"
          alt="후르"
          className="absolute left-0 top-0 w-[95.98px] h-[95.31px]"
        />
        <img
          src="https://placehold.co/42x43"
          alt="face"
          className="absolute left-[21.98px] top-[26.28px] w-[42.24px] h-[43.16px]"
        />
        <img
          src="https://placehold.co/6x6"
          alt="eye"
          className="absolute left-[50.89px] top-[48.06px] w-[6.44px] h-[5.73px]"
        />
        <img
          src="https://placehold.co/6x6"
          alt="eye"
          className="absolute left-[27.39px] top-[48.06px] w-[6.44px] h-[5.73px]"
        />
        <img
          src="https://placehold.co/9x6"
          alt="mouth"
          className="absolute left-[37.78px] top-[46.48px] w-[9.06px] h-[5.9px]"
        />
        <img
          src="https://placehold.co/8x8"
          alt="eyebrow"
          className="absolute left-[30.43px] top-[41.33px] w-[7.59px] h-[8.18px]"
        />
        <img
          src="https://placehold.co/8x8"
          alt="eyebrow"
          className="absolute left-[47.06px] top-[41.19px] w-[7.59px] h-[8.18px]"
        />
      </div>
    </div>
  );
}
