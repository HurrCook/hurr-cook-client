import { Routes, Route, Navigate } from 'react-router-dom';
import SplashScreen from './pages/splash/SplashScreen';
import LoginPage from './pages/login/LoginPage';
import ChatbotPage from './pages/chat/ChatbotPage';
import AppLayout from './components/header/AppLayout';
import Refrigerator from './pages/refrigerator/Refrigerator';
import Recipt from './pages/receipt/Receipt';

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/refrigerator" element={<Refrigerator />} />
        <Route path="/recipt" element={<Recipt />} />
        <Route path="/chat" element={<ChatbotPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}
