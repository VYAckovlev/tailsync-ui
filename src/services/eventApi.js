import { apiClient } from "./api.js";

const EVENT_ENDPOINTS = {
    CREATE: '/events',
    GET_ALL: '/events',
    UPDATE: '/events/:id',
    DELETE: '/events/:id'
}

export const eventApi = {
    async createEvent(eventData) {
        const payload = {
            title: eventData.title,
            type: eventData.type,
            color: eventData.color,
            calendar: eventData.calendarId,
            description: eventData.description,
        };

        if (eventData.start) {
            payload.start = eventData.start;
        }

        if (eventData.end) {
            payload.end = eventData.end;
        }

        if (eventData.location) {
            payload.location = eventData.location;
        }

        // Add recurrence (only if not empty)
        if (eventData.recurrence && eventData.recurrence !== '') {
            payload.recurrence = eventData.recurrence;
        }

        const response = await apiClient.post(EVENT_ENDPOINTS.CREATE, payload);
        return response.data;
    },

    async getAllEvents() {
        const response = await apiClient.get(EVENT_ENDPOINTS.GET_ALL);
        return response.data;
    },

    async updateEvent(id, eventData) {
        const response = await apiClient.patch(
            EVENT_ENDPOINTS.UPDATE.replace(':id', id), eventData);
        return response.data;
    },

    async deleteEvent(id) {
        const response = await apiClient.delete(
            EVENT_ENDPOINTS.DELETE.replace(':id', id));
        return response.data;
    }
}