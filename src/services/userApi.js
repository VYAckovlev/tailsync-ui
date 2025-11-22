import { apiClient } from './api';

const USER_ENDPOINTS = {
    NAME_CHANGE: '/user/name-change',
    PASSWORD_CHANGE: '/user/password-change',
    AVATAR_CHANE: '/user/avatar-change'
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

    async updateAvatar(avatar) {
        const response = await apiClient.patch(USER_ENDPOINTS.AVATAR_CHANE, { avatar });
        return response.data;
    }
};