import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('accessToken');

    if (token) {
      localStorage.setItem('accessToken', token);
      console.log('✅ 카카오 로그인 성공, 토큰 저장 완료');
      navigate('/recipe'); // 로그인 성공 후 이동할 페이지
    } else {
      console.error('❌ 토큰이 존재하지 않습니다.');
      navigate('/login');
    }
  }, [navigate]);

  return <div className="text-center mt-10"> 로그인 처리 중...</div>;
}
