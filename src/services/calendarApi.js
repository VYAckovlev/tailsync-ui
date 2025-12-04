import { apiClient } from './api';

const CALENDAR_ENDPOINTS = {
    CREATE: '/calendar',
    GET: '/calendars',
    UPDATE: '/calendar/:id',
    DELETE: '/calendar/:id',
    SHARE: '/calendar/:id/share',
    LEAVE: '/calendar/:id/leave'
};

export const calendarApi = {
    async createCalendar(calendarData) {
        const response = await apiClient.post(CALENDAR_ENDPOINTS.CREATE, {
            title: calendarData.name,
            color: calendarData.color
        });
        return response.data;
    },

    async getCalendars() {
        const response = await apiClient.get(CALENDAR_ENDPOINTS.GET);
        return response.data;
    },

    async updateCalendar(id, calendarData) {
        const response = await apiClient.patch(
            CALENDAR_ENDPOINTS.UPDATE.replace(':id', id),
            calendarData
        );
        return response.data;
    },

    async deleteCalendar(id) {
        const response = await apiClient.delete(
            CALENDAR_ENDPOINTS.DELETE.replace(':id', id)
        );
        return response.data;
    },

    async shareCalendar(calendarId, shareData) {
        try {
            const response = await apiClient.post(
                CALENDAR_ENDPOINTS.SHARE.replace(':id', calendarId),
                shareData
            );
            return response.data;
        } catch (error) {
            console.error('Error sharing calendar:', error);
            throw error;
        }
    },

    async leaveCalendar(id) {
        const response = await apiClient.delete(
            CALENDAR_ENDPOINTS.LEAVE.replace(':id', id)
        );
        return response.data;
    }
};