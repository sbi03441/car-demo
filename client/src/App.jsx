// src/App.jsx (라우트만 담당하도록 정리)
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { QuoteProvider } from "./state/QuoteContext";
import Navigation from "./components/Navigation";
import ProtectedRoute from "./components/ProtectedRoute";
import ModelPage from "./pages/ModelPage";
import ConfigPage from "./pages/ConfigPage";
import SummaryPage from "./pages/SummaryPage";
import VehicleDetailPage from "./pages/VehicleDetailPage";
import BrandsPage from "./pages/BrandsPage";
import ShowroomPage from "./pages/ShowroomPage";
import FAQPage from "./pages/FAQPage";
import MyQuotesPage from "./pages/MyQuotesPage";
import MyPage from "./pages/MyPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import "./App.css";

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <QuoteProvider>
      <div className="App">
        <Navigation />

          {/* <header className="app-header">
            <h1>견적 내기</h1>
            <p>지금 견적내기를 통해 예상 견적가를 확인해 보세요!</p>
          </header> */}

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/models" replace />} />
              <Route path="/models" element={<ModelPage />} />
              <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
              <Route path="/brands" element={<BrandsPage />} />
              <Route path="/showrooms" element={<ShowroomPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/config" element={<ConfigPage />} />
              <Route path="/summary" element={<SummaryPage />} />

              {/* 인증 페이지 */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* 보호된 페이지 */}
              <Route
                path="/my-quotes"
                element={
                  <ProtectedRoute>
                    <MyQuotesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-page"
                element={
                  <ProtectedRoute>
                    <MyPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          <footer className="app-footer">
            <p>© Demo</p>
          </footer>
        </div>
    </QuoteProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
