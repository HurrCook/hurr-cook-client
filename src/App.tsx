// src/App.tsx

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Routes, Route, Navigate } from 'react-router-dom';

import SplashScreen from './pages/splash/SplashScreen';
import LoginPage from './pages/login/LoginPage';
import LoginCallbackPage from './pages/login/LoginCallbackPage';

import ChatbotPage from './pages/chat/ChatbotPage';
import AppLayout from './components/layout/AppLayout';
import RefrigeratorPage from './pages/refrigerator/RefrigeratorPage';
import RecipePage from './pages/receipt/RecipePage';

import UserInfoPage1 from '@/pages/userinfo/UserInfoPage1';
import UserInfoPage1_2 from '@/pages/userinfo/UserInfoPage1_2';
import UserInfoPage2 from '@/pages/userinfo/UserInfoPage2';
import UserInfoPage3 from '@/pages/userinfo/UserInfoPage3';
import UserInfoPage4 from '@/pages/userinfo/UserInfoPage4';

import SettingLayout1 from './components/layout/SettingLayout1';
import SettingLayout1_2 from './components/layout/SettingLayout1_2';
import SettingLayout2 from './components/layout/SettingLayout2';
import SettingLayout3 from './components/layout/SettingLayout3';
import SettingLayout4 from './components/layout/SettingLayout4';

import LoadingPage from './pages/loading/LoadingPage';
import FailPage from './pages/fail/FailPage';
import IngredientPhotoAddPage from './pages/refrigerator/IngredientPhotoAddPage';
import IngredientAddPage from './pages/refrigerator/IngredientAddPage';

import RequireAuth from './routes/RequireAuth';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* 공개 페이지 */}
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/callback" element={<LoginCallbackPage />} />

        {/* 보호 라우트 시작 */}
        <Route element={<RequireAuth />}>
          {/* 온보딩 섹션 (각기 다른 레이아웃) */}
          <Route element={<SettingLayout1 />}>
            <Route path="userinfopage1" element={<UserInfoPage1 />} />
          </Route>
          <Route element={<SettingLayout1_2 />}>
            <Route path="userinfopage1_2" element={<UserInfoPage1_2 />} />
          </Route>
          <Route element={<SettingLayout2 />}>
            <Route path="userinfopage2" element={<UserInfoPage2 />} />
          </Route>
          <Route element={<SettingLayout3 />}>
            <Route path="userinfopage3" element={<UserInfoPage3 />} />
          </Route>
          <Route element={<SettingLayout4 />}>
            <Route path="userinfopage4" element={<UserInfoPage4 />} />
          </Route>

          {/* 앱 내부 섹션 (공용 AppLayout = 헤더/사이드바 포함) */}
          <Route element={<AppLayout />}>
            <Route path="refrigerator" element={<RefrigeratorPage />} />
            <Route path="recipe" element={<RecipePage />} />
            <Route path="chat" element={<ChatbotPage />} />
            <Route path="loading" element={<LoadingPage />} />
            <Route path="fail" element={<FailPage />} />
            <Route
              path="refrigerator/photo-add"
              element={<IngredientPhotoAddPage />}
            />
            <Route path="refrigerator/add" element={<IngredientAddPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </QueryClientProvider>
  );
}
