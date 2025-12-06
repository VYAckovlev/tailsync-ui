export const formatForInput = (value, isAllDay) => {
    if (!value) return '';

    const date = new Date(value);

    if (isNaN(date.getTime())) return '';

    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    const iso = localDate.toISOString();

    if (isAllDay) {
        return iso.slice(0, 10);
    }

    return iso.slice(0, 16);
};