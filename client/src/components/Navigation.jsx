import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="top-navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <NavLink to="/">Car Demo</NavLink>
        </div>

        {/* 햄버거 메뉴 버튼 */}
        <button
          className="hamburger-menu"
          onClick={toggleMobileMenu}
          aria-label="메뉴"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* 모바일 메뉴 래퍼 */}
        <div className={`mobile-menu-wrapper ${isMobileMenuOpen ? "mobile-open" : ""}`}>
          <div className="nav-menu">
          <NavLink
            to="/models"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={closeMobileMenu}
          >
            차량 선택
          </NavLink>
          <NavLink
            to="/brands"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={closeMobileMenu}
          >
            브랜드 소개
          </NavLink>
          <NavLink
            to="/showrooms"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={closeMobileMenu}
          >
            전시장 찾기
          </NavLink>
          <NavLink
            to="/faq"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={closeMobileMenu}
          >
            FAQ
          </NavLink>

          {/* 로그인 시에만 내 견적 표시 */}
          {isAuthenticated && (
            <NavLink
              to="/my-quotes"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={closeMobileMenu}
            >
              📋 내 견적
            </NavLink>
          )}
          </div>

          {/* 인증 메뉴 */}
          <div className="nav-auth">
          {isAuthenticated ? (
            // 로그인 상태
            <>
              {user?.isAdmin && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    isActive ? "admin-button active" : "admin-button"
                  }
                  onClick={closeMobileMenu}
                >
                  ⚙️ 관리자
                </NavLink>
              )}
              <NavLink
                to="/my-page"
                className={({ isActive }) =>
                  isActive ? "mypage-button active" : "mypage-button"
                }
                onClick={closeMobileMenu}
              >
                👤 마이페이지
              </NavLink>
              <button className="logout-button" onClick={handleLogout}>
                🚪 로그아웃
              </button>
            </>
          ) : (
            // 비로그인 상태
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive ? "auth-link active" : "auth-link"
                }
                onClick={closeMobileMenu}
              >
                🔑 로그인
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? "auth-link register active" : "auth-link register"
                }
                onClick={closeMobileMenu}
              >
                ✍️ 회원가입
              </NavLink>
            </>
          )}
          </div>
        </div>
      </div>
    </nav>
  );
}
