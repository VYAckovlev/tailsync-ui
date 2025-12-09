import { apiClient } from "./api.js";

const EVENT_ENDPOINTS = {
    CREATE: '/events',
    GET_ALL: '/events',
    GET_BY_CALENDAR: '/calendars/:calendarId/events/:type/:year',
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

        if (eventData.isAllDay) {
            eventData.start += "T00:00";
        }

        if (eventData.start) {
            payload.start = new Date(eventData.start).toISOString();
        }

        if (eventData.end && (eventData.type === 'arrangement')) {
            payload.end = new Date(eventData.end).toISOString();
        }

        if (eventData.location && eventData.type === 'arrangement') {
            payload.location = eventData.location;
        }

        if (eventData.recurrence && eventData.recurrence !== '') {
            payload.rrule = eventData.recurrence;
        }

        const response = await apiClient.post(EVENT_ENDPOINTS.CREATE, payload);
        return response.data;
    },

    async getAllEvents() {
        const response = await apiClient.get(EVENT_ENDPOINTS.GET_ALL);
        return response.data;
    },

    async getEventsByCalendar(calendarId, type, year) {
        let endpoint = EVENT_ENDPOINTS.GET_BY_CALENDAR
            .replace(':calendarId', calendarId)
            .replace(':type', type)
            .replace(':year', year);

        const response = await apiClient.get(endpoint);
        return response.data;
    },

    async updateEvent(id, eventData) {
        const payload = {
            title: eventData.title,
            type: eventData.type,
            color: eventData.color,
            calendar: eventData.calendarId,
            description: eventData.description,
        };

        if (eventData.start) {
            payload.start = new Date(eventData.start).toISOString();
        }

        if (eventData.end && (eventData.type === 'arrangement' || eventData.type === 'holiday')) {
            payload.end = new Date(eventData.end).toISOString();
        }

        if (eventData.location && eventData.type === 'arrangement') {
            payload.location = eventData.location;
        }

        if (eventData.type === 'task' && eventData.completed !== undefined) {
            payload.completed = eventData.completed;
        }

        if (eventData.recurrence !== undefined) {
            payload.rrule = eventData.recurrence || null;
        }

        const response = await apiClient.patch(
            EVENT_ENDPOINTS.UPDATE.replace(':id', id), payload);
        return response.data;
    },

    async deleteEvent(id) {
        const response = await apiClient.delete(
            EVENT_ENDPOINTS.DELETE.replace(':id', id));
        return response.data;
    }
}