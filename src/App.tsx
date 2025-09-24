import { Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './pages/splash/SplashScreen';
import LoginPage from './pages/login/LoginPage';
import ChatbotPage from './pages/chat/ChatbotPage';
import AppLayout from './components/layout/AppLayout';
import RefrigeratorPage from './pages/refrigerator/RefrigeratorPage';
import RecipePage from './pages/receipt/RecipePage';

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/refrigerator" element={<RefrigeratorPage />} />
        <Route path="/recipe" element={<RecipePage />} />
        <Route path="/chat" element={<ChatbotPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}
