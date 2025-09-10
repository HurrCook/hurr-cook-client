import { Routes, Route } from 'react-router-dom';
import TestPage from '@/pages/TestPage';

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<h1 className="text-main font-bold">홈 화면</h1>}
      />
      <Route path="/test" element={<TestPage />} />
    </Routes>
  );
}
