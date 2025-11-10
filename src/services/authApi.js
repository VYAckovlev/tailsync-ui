import { apiClient } from './api';

const AUTH_ENDPOINTS = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    PASSWORD_RESET: '/auth/password-reset'
};

export const authApi = {
    async login(credentials) {
        const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, {
            email: credentials.email,
            password: credentials.password
        });
        return response.data.data;
    },

    async register(userData) {
        const response = await apiClient.post(AUTH_ENDPOINTS.REGISTER, {
            name: userData.name,
            email: userData.email,
            password: userData.password
        });
        return response.data;
    },

    async logout() {
        try {
            await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
        } catch (error) {
            console.error('Server logout failed:', error);
        }
    },

    async refreshToken() {
        const response = await apiClient.post(AUTH_ENDPOINTS.REFRESH);
        return response.data.data;
    },

    async fetchCurrentUser() {
        const response = await apiClient.get(AUTH_ENDPOINTS.ME);
        return response.data.data;
    },

    async requestPasswordReset(email) {
        const response = await apiClient.post(AUTH_ENDPOINTS.PASSWORD_RESET, { email });
        return response.data;
    }
};