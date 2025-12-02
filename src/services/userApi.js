import { apiClient } from './api';

const USER_ENDPOINTS = {
    NAME_CHANGE: '/users/name',
    PASSWORD_CHANGE: '/users/password',
    AVATAR_CHANGE: '/users/avatar'
};

export const userApi = {
    async updateName(name) {
        const response = await apiClient.patch(USER_ENDPOINTS.NAME_CHANGE, { name });
        return response.data;
    },

    async updatePassword(old_password, new_password) {
        const response = await apiClient.patch(USER_ENDPOINTS.PASSWORD_CHANGE, {
            old_password,
            new_password
        });
        return response.data;
    },

    async updateAvatar(formData) {
        const response = await apiClient.patch(USER_ENDPOINTS.AVATAR_CHANGE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    }
};