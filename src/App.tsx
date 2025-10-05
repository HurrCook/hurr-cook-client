import { Routes, Route } from 'react-router-dom';
import SplashScreen from './pages/splash/SplashScreen';
import LoginPage from './pages/login/LoginPage';
import ChatbotPage from './pages/chat/ChatbotPage';
import AppLayout from './components/layout/AppLayout';
import RefrigeratorPage from './pages/refrigerator/RefrigeratorPage';
import RecipePage from './pages/receipt/RecipePage';
import UserInfoPage1 from '@/pages/userinfo/UserInfoPage1';
import UserInfoPage2 from '@/pages/userinfo/UserInfoPage2';
import SettingLayout from './components/layout/SettingLayout';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/login" element={<LoginPage />} />

      {/* SettingLayout이 UserInfoPage1을 감싸 헤더를 제공합니다. */}
      <Route element={<SettingLayout />}>
        <Route path="userinfopage1" element={<UserInfoPage1 />} />
        <Route path="userinfopage2" element={<UserInfoPage2 />} />
      </Route>

      <Route element={<AppLayout />}>
        <Route path="refrigerator" element={<RefrigeratorPage />} />
        <Route path="recipe" element={<RecipePage />} />
        <Route path="chat" element={<ChatbotPage />} />
      </Route>
    </Routes>
  );
}
