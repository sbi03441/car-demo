import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navigation() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="top-navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <NavLink to="/">Car Demo</NavLink>
        </div>
        <div className="nav-menu">
          <NavLink
            to="/models"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            차량 선택
          </NavLink>
          <NavLink
            to="/brands"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            브랜드 소개
          </NavLink>
          <NavLink
            to="/showrooms"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            전시장 찾기
          </NavLink>
          <NavLink
            to="/faq"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
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
              <NavLink
                to="/my-page"
                className={({ isActive }) =>
                  isActive ? "mypage-button active" : "mypage-button"
                }
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
              >
                🔑 로그인
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? "auth-link register active" : "auth-link register"
                }
              >
                ✍️ 회원가입
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
