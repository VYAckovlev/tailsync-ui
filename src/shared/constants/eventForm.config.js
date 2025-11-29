export const EVENT_TYPES = {
    ARRANGEMENT: 'arrangement',
    REMINDER: 'reminder',
    TASK: 'task'
};

const baseFields = [
    {
        name: "title",
        label: "Title",
        type: "text",
        placeholder: "Add title",
        required: true,
        autoFocus: true
    },
    {
        name: "color",
        label: "Color",
        type: "color",
        required: false
    },
    {
        name: "calendarId",
        label: "Calendar",
        type: "select",
        required: true,
        placeholder: "Select calendar",
    },
    {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Add description"
    }
];

export const EVENT_FORM_CONFIGS = {
    [EVENT_TYPES.ARRANGEMENT]: {
        label: "Arrangement",
        color: "#2563eb",
        fields: [
            ...baseFields.slice(0, 2),

            {
                name: "isAllDay",
                label: "All day",
                type: "checkbox",
                defaultValue: false
            },

            {
                name: "start",
                label: "Starts",
                type: "datetime-local",
                required: true
            },
            {
                name: "end",
                label: "Ends",
                type: "datetime-local",
                required: true
            },
            {
                name: "location",
                label: "Link to meet",
                type: "text",
                placeholder: "Add link to meet"
            },
            ...baseFields.slice(2)
        ]
    },
    [EVENT_TYPES.REMINDER]: {
        label: "Reminder",
        color: "#9333ea",
        fields: [
            ...baseFields.slice(0, 2),
            { name: "start", label: "Remind me at", type: "datetime-local", required: true },
            ...baseFields.slice(2)
        ]
    },
    [EVENT_TYPES.TASK]: {
        label: "Task",
        color: "#16a34a",
        fields: [
            ...baseFields.slice(0, 2),
            { name: "start", label: "Due Date", type: "datetime-local", required: true },
            ...baseFields.slice(2)
        ]
    }
};