import { createContext, useState, useEffect } from "react";
import { authService } from "../utils/AuthService";
import { authApi } from "../services/authApi";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuth = () => {
            try {
                if (authService.isAuthenticated()) {
                    setIsAuthenticated(true);
                }
            } catch (err) {
                console.error("Auth check failed:", err);
                authService.clearAuth();
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        setError(null);
        setLoading(true);

        try {
            const { access_token } = await authApi.login(credentials);
            authService.setToken(access_token);

            setUser({ email: credentials.email });
            setIsAuthenticated(true);

            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setError(null);
        setLoading(true);

        try {
            const response = await authApi.register(userData);
            return { success: true, message: response.message };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            authService.clearAuth();
            setUser(null);
            setIsAuthenticated(false);
            setError(null);
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        setError
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};