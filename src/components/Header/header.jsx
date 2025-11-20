import { useAuth } from "../../hooks/useAuth.js";
import { useNavigate } from "react-router-dom";
import Logo from "../../shared/logo/logo.jsx";
import UserMenu from "../UserMenu/UserMenu.jsx";
import "./header.css";

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="header">
            <div className="header-left">
                <Logo size="medium" />
                <span className="header-brand">
                    TailSync
                </span>
            </div>

            <div className="header-center">
                <div className="search-container">
                    <input type="text" className="search-input" placeholder="Search events..." disabled />
                </div>
            </div>

            <div className="header-right">
                {!isAuthenticated ? (
                    <button onClick={() => navigate('/auth/login')} className="login-button">
                        Login
                    </button>
                ) : (
                    <UserMenu user={user} onLogout={logout} />
                )}
            </div>
        </header>
    );
};

export default Header