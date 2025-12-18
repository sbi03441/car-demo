import { Link } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h1>관리자 대시보드</h1>
      <p>관리 기능을 선택하세요</p>

      <div className="dashboard-grid">
        <Link to="/admin/faqs" className="dashboard-card">
          <div className="card-icon">❓</div>
          <h2>FAQ 관리</h2>
          <p>FAQ 추가, 수정, 삭제</p>
        </Link>

        <Link to="/admin/cars" className="dashboard-card">
          <div className="card-icon">🚗</div>
          <h2>차량 관리</h2>
          <p>차량 추가, 수정, 삭제</p>
        </Link>

        <Link to="/admin/showrooms" className="dashboard-card">
          <div className="card-icon">🏢</div>
          <h2>전시장 관리</h2>
          <p>전시장 추가, 수정, 삭제</p>
        </Link>

        <Link to="/admin/colors-options" className="dashboard-card">
          <div className="card-icon">🎨</div>
          <h2>색상 / 옵션 관리</h2>
          <p>색상 및 옵션 추가, 수정, 삭제</p>
        </Link>

        <div className="dashboard-card disabled">
          <div className="card-icon">🏷️</div>
          <h2>브랜드 관리</h2>
          <p>준비 중</p>
        </div>

        <Link to="/admin/users" className="dashboard-card">
          <div className="card-icon">👥</div>
          <h2>사용자 관리</h2>
          <p>사용자 추가, 수정, 삭제 및 권한 관리</p>
        </Link>

        <div className="dashboard-card disabled">
          <div className="card-icon">📊</div>
          <h2>견적 관리</h2>
          <p>준비 중</p>
        </div>
      </div>
    </div>
  );
}
