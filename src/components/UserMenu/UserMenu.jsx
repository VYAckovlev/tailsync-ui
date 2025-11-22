import {useRef, useState, useCallback} from "react";
import {useClickOutside} from "../../hooks/useClickOutside.js";
import {useNavigate} from "react-router-dom";
import {getUserInitials} from "../../utils/UserUtils.js";
import LogoutIcon from "../../shared/icons/Logout.icon.jsx";
import EditIcon from "../../shared/icons/Edit.icon.jsx";
import LockIcon from "../../shared/icons/Lock.icon.jsx";
import ChangeNameModal from "./ChangeNameModal.jsx";
import ChangePasswordModal from "./ChangePasswordModal.jsx";
import ChangeAvatarModal from "./ChangeAvatarModal.jsx";

const UserMenu = ({user, onLogout}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [avatarError, setAvatarError] = useState(false);
    const [isNameModalOpen, setIsNameModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    const handleClose = useCallback(() => setIsOpen(false), []);
    useClickOutside(menuRef, handleClose);

    const handleLogout = async () => {
        await onLogout();
        setIsOpen(false);
        navigate('/auth/login')
    }

    const handleOpenNameModal = () => {
        setIsOpen(false);
        setIsNameModalOpen(true);
    };

    const handleOpenPasswordModal = () => {
        setIsOpen(false);
        setIsPasswordModalOpen(true);
    };

    const handleOpenAvatarModal = () => {
        setIsOpen(false);
        setIsAvatarModalOpen(true);
    };

    const handleAvatarError = () => {
        setAvatarError(true);
    };

    const hasAvatar = !avatarError && user.avatar && user.avatar.trim();

    return (
        <div className="user-menu" ref={menuRef}>
            <div className="avatar-button" onClick={() => setIsOpen(!isOpen)}>
                {hasAvatar ? (
                    <img
                        src={user.avatar}
                        alt="User avatar"
                        className="avatar-image"
                        onError={handleAvatarError}
                    />
                ) : (
                    <span className="avatar-icon">{getUserInitials(user)}</span>
                )}
            </div>

            <div className={`dropdown-menu ${isOpen ? 'open' : ''}`}>
                <div className="dropdown-user-info">
                    <div className="dropdown-avatar" onClick={handleOpenAvatarModal} style={{ cursor: 'pointer' }}>
                        {hasAvatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="dropdown-avatar-image"
                                onError={handleAvatarError}
                            />
                        ) : (
                            <span className="dropdown-avatar-text">{getUserInitials(user)}</span>
                        )}
                    </div>
                    <div className="dropdown-user-details">
                        <div className="dropdown-user-name">{user.name}</div>
                        <div className="dropdown-user-email">{user.email}</div>
                    </div>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={handleOpenPasswordModal}>
                    <span className="dropdown-item-icon"></span>
                    <LockIcon/>
                    Change password
                </button>
                <button className="dropdown-item" onClick={handleOpenNameModal}>
                    <span className="dropdown-item-icon"></span>
                    <EditIcon/>
                    Change name
                </button>
                <button className="dropdown-item" onClick={handleLogout}>
                    <span className="dropdown-item-icon"></span>
                    <LogoutIcon />
                    Sign out
                </button>
            </div>

            <ChangeNameModal
                isOpen={isNameModalOpen}
                onClose={() => setIsNameModalOpen(false)}
            />
            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
            />
            <ChangeAvatarModal
                isOpen={isAvatarModalOpen}
                onClose={() => setIsAvatarModalOpen(false)}
            />
        </div>
    );
}

export default UserMenu