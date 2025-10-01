import { Routes, Route } from 'react-router-dom';
import SplashScreen from './pages/splash/SplashScreen';
import LoginPage from './pages/login/LoginPage';
import ChatbotPage from './pages/chat/ChatbotPage';
import AppLayout from './components/layout/AppLayout';
import RefrigeratorPage from './pages/refrigerator/RefrigeratorPage';
import RecipePage from './pages/receipt/RecipePage';

export default function App() {
  return (
    <Routes>
      {/* 레이아웃 없이 보여줄 라우트 */}
      <Route path="/" element={<SplashScreen />} />
      <Route path="/login" element={<LoginPage />} />
      {/* 레이아웃 적용 라우트 (중첩) */}
      <Route element={<AppLayout />}>
        <Route path="/refrigerator" element={<RefrigeratorPage />} />
        <Route path="/recipe" element={<RecipePage />} />
        <Route path="/chat" element={<ChatbotPage />} />
      </Route>
    </Routes>
  );
}
