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
import AdminDashboard from "./pages/AdminDashboard";
import AdminFAQPage from "./pages/AdminFAQPage";
import AdminShowroomPage from "./pages/AdminShowroomPage";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import "./App.css";

// QuoteProvider가 필요한 페이지만 감싸는 래퍼 컴포넌트
function QuoteRoutes({ children }) {
  return <QuoteProvider>{children}</QuoteProvider>;
}

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
    <div className="App">
      <Navigation />

      {/* <header className="app-header">
        <h1>견적 내기</h1>
        <p>지금 견적내기를 통해 예상 견적가를 확인해 보세요!</p>
      </header> */}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/models" replace />} />

          {/* QuoteProvider가 필요한 페이지들 */}
          <Route path="/models" element={<QuoteRoutes><ModelPage /></QuoteRoutes>} />
          <Route path="/vehicles/:id" element={<QuoteRoutes><VehicleDetailPage /></QuoteRoutes>} />
          <Route path="/config" element={<QuoteRoutes><ConfigPage /></QuoteRoutes>} />
          <Route path="/summary" element={<QuoteRoutes><SummaryPage /></QuoteRoutes>} />
          <Route
            path="/my-quotes"
            element={
              <ProtectedRoute>
                <QuoteRoutes><MyQuotesPage /></QuoteRoutes>
              </ProtectedRoute>
            }
          />

          {/* QuoteProvider가 필요 없는 페이지들 */}
          <Route path="/brands" element={<QuoteRoutes><BrandsPage /></QuoteRoutes>} />
          <Route path="/showrooms" element={<QuoteRoutes><ShowroomPage /></QuoteRoutes>} />
          <Route path="/faq" element={<QuoteRoutes><FAQPage /></QuoteRoutes>} />

          {/* 인증 페이지 */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 보호된 페이지 */}
          <Route
            path="/my-page"
            element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            }
          />

          {/* 관리자 페이지 */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/faqs"
            element={
              <ProtectedAdminRoute>
                <AdminFAQPage />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/showrooms"
            element={
              <ProtectedAdminRoute>
                <AdminShowroomPage />
              </ProtectedAdminRoute>
            }
          />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>© Demo</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
