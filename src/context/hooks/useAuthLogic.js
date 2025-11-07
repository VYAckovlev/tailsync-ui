import { useState, useEffect } from "react";
import { authService } from "../../utils/AuthService";
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;

export const useAuthLogic = () => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkAuth = () => {
            try {
                if (authService.isAuthenticated()) {
                    setIsAuthenticated(true);
                    // TODO: Fetch user data from API using token
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

    const login = async (data) => {
        setError(null);
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/login`, {
                email: data.email,
                password: data.password
            }, {
                withCredentials: true
            });

            const { access_token } = response.data.data;
            authService.setToken(access_token);

            setUser({ email: data.email });
            setIsAuthenticated(true);

            return { success: true };
        } catch (err) {
            const errorMessage = err.message;
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, email, password) => {
        setError(null);
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/register`, {
                name,
                email,
                password
            });

            // TODO after registration logic
        } catch (err) {
            const errorMessage = err.message;
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await axios.post(`${API_URL}/logout`, {}, {
                withCredentials: true
            });
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            authService.clearAuth();
            setUser(null);
            setIsAuthenticated(false);
            setError(null);
        }
    };

    const requestPasswordReset = async (email) => {
        setError(null);
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/password-reset`, {
                email
            });

            return {
                success: true,
                message: response.message
            };
        } catch (err) {
            const errorMessage = err.message;
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        requestPasswordReset,
        setError
    };
};