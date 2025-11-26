import { useAuth } from "../../hooks/useAuth.js";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../../shared/logo/logo.jsx";
import UserMenu from "../UserMenu/UserMenu.jsx";
import { useCalendar } from "../../hooks/useCalendar.js";
import Chevron from "../../shared/icons/Chevron.icon.jsx";
import "./header.css";
import ViewSelector from "../ViewSelector/ViewSelector.jsx";

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { currentDate, goToNext, goToPrev, goToToday } = useCalendar();

    const currentView = location.pathname.split('/').pop();

    const formatDateDisplay = () => {
        if (!currentDate) return '';

        const month = currentDate.toLocaleString('en-US', { month: 'long' });
        const year = currentDate.getFullYear();

        if (currentView === 'month') {
            return `${month} ${year}`;
        } else if (currentView === 'day') {
            return currentDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
        }
        return `${month} ${year}`;
    };

    return (
        <header className="header">
            <div className="header-left">
                <div className="brand-container">
                    <Logo size="large" />
                    <span className="header-brand">TailSync</span>
                </div>


                <div className="calendar-controls">
                    <button className="today-btn" onClick={goToToday}>
                        Today
                    </button>
                    <div className="nav-arrows">
                        <button className="nav-btn" onClick={goToPrev} title="Previous">
                            <Chevron.ChevronLeft className="nav-icon" />
                        </button>
                        <button className="nav-btn" onClick={goToNext} title="Next">
                            <Chevron.ChevronRight className="nav-icon" />
                        </button>
                    </div>
                    <div className="current-date-display">
                        {formatDateDisplay()}
                    </div>
                </div>
            </div>

            <div className="header-center">
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search events..."
                        disabled
                    />
                </div>
            </div>

            <div className="header-right">
                <ViewSelector />
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

export default Header;