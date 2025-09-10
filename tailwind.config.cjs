/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        main: '#FF8800', // 메인 컬러
        cardBorderLight: '#DDDDDD', // 밝은 카드 테두리
        textLight: '#484848', // 밝은 텍스트
        cardDark: '#F0F0F0', // 어두운 카드 배경
        textDark: '#212121', // 어두운 텍스트
        logout: '#FF3300', // 로그아웃 버튼
      },
      fontFamily: {
        sans: ['Pretendard'], // Pretendard만 전역 기본 폰트로 강제
      },
      fontSize: {
        xs: ['1.2rem', { lineHeight: '1.8rem' }], // 12px
        sm: ['1.4rem', { lineHeight: '2.0rem' }], // 14px
        base: ['1.6rem', { lineHeight: '2.4rem' }], // 16px
        lg: ['1.8rem', { lineHeight: '2.6rem' }], // 18px
        xl: ['2.0rem', { lineHeight: '2.8rem' }], // 20px
        '2xl': ['2.4rem', { lineHeight: '3.2rem' }], // 24px
        '3xl': ['3.0rem', { lineHeight: '3.6rem' }], // 30px
        '4xl': ['3.6rem', { lineHeight: '4.2rem' }], // 36px
        '5xl': ['4.8rem', { lineHeight: '1' }], // 48px
        '6xl': ['6.0rem', { lineHeight: '1' }], // 60px
      },
    },
  },
  plugins: [],
};
