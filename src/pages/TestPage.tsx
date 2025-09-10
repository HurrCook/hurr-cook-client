export default function TestPage() {
  return (
    <div className="min-h-screen bg-cardDark flex flex-col items-center justify-center gap-6 font-sans">
      {/* PNG 테스트 */}
      <img
        src="../../public/icons/ICON-192.png"
        alt="logo"
        width={80}
        height={80}
      />

      <h1 className="text-3xl text-main font-bold">Pretendard + Main Color</h1>
      <p className="text-base text-main">textDark 컬러 적용</p>
      <button className="px-4 py-2 rounded bg-logout text-white">
        로그아웃 버튼
      </button>
    </div>
  );
}
