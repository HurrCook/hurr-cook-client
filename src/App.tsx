import { Routes, Route } from 'react-router-dom';
import SplashScreen from './pages/splash/SplashScreen';
import LoginPage from './pages/login/LoginPage';
import ChatbotPage from './pages/chat/ChatbotPage';
import AppLayout from './components/layout/AppLayout';
import RefrigeratorPage from './pages/refrigerator/RefrigeratorPage';
import RecipePage from './pages/receipt/RecipePage';
import UserInfoPage1 from '@/pages/userinfo/UserInfoPage1';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="userinfopage1" element={<UserInfoPage1 />} />
      <Route element={<AppLayout />}>
        <Route path="refrigerator" element={<RefrigeratorPage />} />
        <Route path="recipe" element={<RecipePage />} />
        <Route path="chat" element={<ChatbotPage />} />
      </Route>
    </Routes>
  );
}
