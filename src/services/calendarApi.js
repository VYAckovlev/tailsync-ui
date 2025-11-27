import { apiClient } from './api';

const CALENDAR_ENDPOINTS = {
    CREATE: '/calendar',
    LIST: '/calendar',
    UPDATE: '/calendar/:id',
    DELETE: '/calendar/:id'
};

export const calendarApi = {
    async createCalendar(calendarData) {
        const response = await apiClient.post(CALENDAR_ENDPOINTS.CREATE, {
            name: calendarData.name,
            color: calendarData.color
        });
        return response.data;
    },

    async listCalendars() {
        const response = await apiClient.get(CALENDAR_ENDPOINTS.LIST);
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
    }
};