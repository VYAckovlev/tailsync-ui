import {useState} from "react";
import {authApi} from "../services/authApi.js";

export const useRegister = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const register = async (userData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authApi.register(userData);
            return { success: true, data: response };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    };

    return {register, isLoading, error};
}

export const usePasswordReset = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const requestPasswordReset = async (email) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authApi.requestPasswordReset(email);
            return { success: true, data: response };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    };

    return { requestPasswordReset, isLoading, error };
};

export const usePasswordResetConfirm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const confirmPasswordReset = async (token, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authApi.confirmPasswordReset(token, password);
            return { success: true, data: response };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    };

    return { confirmPasswordReset, isLoading, error };
};

