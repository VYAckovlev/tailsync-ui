import {createContext, useState, useEffect, useContext, useCallback, useMemo} from "react";
import { authService } from "../utils/AuthService";
import { authApi } from "../services/authApi";
import { getAvatarUrl } from "../utils/UserUtils";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                if (authService.isAuthenticated()) {
                    const userData = await authApi.fetchCurrentUser();
                    setUser({
                        ...userData.me,
                        avatar: getAvatarUrl(userData.me.avatar)
                    });
                }
            } catch (err) {
                console.error("Auth check failed:", err);
                authService.clearAuth();
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = useCallback(async (data) => {
        try {
            const { access_token } = await authApi.login(data);
            authService.setToken(access_token);

            const UserData = await authApi.fetchCurrentUser();
            setUser({
                ...UserData.me,
                avatar: getAvatarUrl(UserData.me.avatar)
            });
            return { success: true };
        } catch (err) {
            console.error("Login failed:", err);
            return { success: false, error: err.message };
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await authApi.logout();
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            authService.clearAuth();
            setUser(null);
        }
    }, []);

    const updateUser = useCallback((userData) => {
        setUser(prevUser => ({ ...prevUser, ...userData }));
    }, []);

    useEffect(() => {
        const handleForceLogout = () => {
            setUser(null);
            authService.clearAuth();
        };

        window.addEventListener('auth:logout', handleForceLogout);
        return () => window.removeEventListener('auth:logout', handleForceLogout);
    }, []);


    const value = useMemo(() => ({
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        updateUser
    }), [user, loading, login, logout, updateUser]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}