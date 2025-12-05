import { useEffect, useState } from 'react';
import useForm from '../../hooks/useForm.js';
import FormPopover from '../FormPopover/FormPopover.jsx';
import { EVENT_TYPES, EVENT_FORM_CONFIGS } from '../../shared/constants/eventForm.config.js';
import { calendarApi } from '../../services/calendarApi.js';
import { formatForInput } from "../../utils/DateUtils.js";
import './EventDetailsPopover.css';

const EventDetailsPopover = ({
    isOpen,
    onClose,
    onUpdate,
    onDelete,
    anchorPosition,
    eventData
}) => {
    const [calendars, setCalendars] = useState([]);
    const [isLoadingCalendars, setIsLoadingCalendars] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const eventType = eventData?.type || EVENT_TYPES.ARRANGEMENT;
    const config = EVENT_FORM_CONFIGS[eventType] || EVENT_FORM_CONFIGS[EVENT_TYPES.ARRANGEMENT];

    const { formData, setFormData, handleChange, handleSubmit, resetForm } = useForm(
        config.fields,
        async (data) => {
            setIsSubmitting(true);
            try {
                const updatedEventData = {
                    ...data,
                    type: eventType,
                    color: data.color || config.color
                };

                await onUpdate(eventData.id, updatedEventData);
            } catch (error) {
                console.error('Failed to update event:', error);
                throw error;
            } finally {
                setIsSubmitting(false);
            }
        }
    );

    const prefillEventData = (event) => {
        if (!event) return;

        const isAllDay = event.allDay || false;

        setFormData({
            title: event.title || '',
            color: event.color || event.backgroundColor || config.color,
            calendarId: event.calendarId || event.calendar_id || '',
            description: event.description || '',
            location: event.location || '',
            isAllDay: isAllDay,
            start: event.start ? formatForInput(event.start, isAllDay) : '',
            end: event.end ? formatForInput(event.end, isAllDay) : '',
            link: event.link || '',
            completed: event.completed || false,
            recurrence: event.recurrence || '',
        });
    };

    useEffect(() => {
        if (isOpen && eventData) {
            fetchCalendars();
            prefillEventData(eventData);
        }
    }, [isOpen, eventData]);

    const fetchCalendars = async () => {
        try {
            setIsLoadingCalendars(true);
            const response = await calendarApi.listCalendars();
            const calendarList = response.data || [];
            setCalendars(calendarList);
        } catch (error) {
            console.error('Failed to fetch calendars:', error);
            setCalendars([]);
        } finally {
            setIsLoadingCalendars(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this event?')) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onDelete(eventData.id);
        } catch (error) {
            console.error('Failed to delete event:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderField = (field) => {
        const commonProps = {
            id: `event-${field.name}`,
            name: field.name,
            required: field.required,
            onChange: handleChange,
            autoFocus: field.autoFocus
        };

        const isAllDay = formData.isAllDay || false;

        switch (field.type) {
            case 'text':
                return (
                    <input
                        type="text"
                        {...commonProps}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ''}
                        maxLength={100}
                    />
                );

            case 'datetime-local':
                const inputType = isAllDay ? 'date' : 'datetime-local';
                return (
                    <input
                        type={inputType}
                        {...commonProps}
                        value={formData[field.name] || ''}
                    />
                );

            case 'checkbox':
                return (
                    <div className="checkbox-wrapper">
                        <input
                            type="checkbox"
                            {...commonProps}
                            checked={formData[field.name] || false}
                        />
                        <label htmlFor={commonProps.id} className="checkbox-label">
                            {field.label}
                        </label>
                    </div>
                );

            case 'select':
                if (field.name === 'calendarId') {
                    return (
                        <select
                            {...commonProps}
                            value={formData[field.name] || ''}
                            disabled={isLoadingCalendars}
                        >
                            <option value="" disabled>
                                {isLoadingCalendars ? 'Loading calendars...' : field.placeholder}
                            </option>
                            {calendars.map(calendar => (
                                <option key={calendar.id} value={calendar.id}>
                                    {calendar.name}
                                </option>
                            ))}
                        </select>
                    );
                }

                // Generic select field (for recurrence and other selects)
                if (field.options) {
                    return (
                        <select
                            {...commonProps}
                            value={formData[field.name] || field.defaultValue || ''}
                        >
                            {field.options.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    );
                }

                return null;

            case 'textarea':
                return (
                    <textarea
                        {...commonProps}
                        placeholder={field.placeholder}
                        value={formData[field.name] || ''}
                        rows={3}
                        maxLength={500}
                    />
                );

            case 'color':
                const selectedColor = formData[field.name] || config.color;
                return (
                    <input
                        type="color"
                        className="custom-color-input"
                        value={selectedColor}
                        onChange={(e) => {
                            setFormData(prev => ({
                                ...prev,
                                [field.name]: e.target.value
                            }));
                        }}
                    />
                );

            default:
                return null;
        }
    };

    const groupFields = (fields) => {
        const grouped = {};
        const ungrouped = [];

        fields.forEach(field => {
            if (field.group) {
                if (!grouped[field.group]) {
                    grouped[field.group] = [];
                }
                grouped[field.group].push(field);
            } else {
                ungrouped.push(field);
            }
        });

        return { grouped, ungrouped };
    };

    if (!eventData) return null;

    const { grouped, ungrouped } = groupFields(config.fields);

    return (
        <FormPopover
            isOpen={isOpen}
            onClose={onClose}
            anchorPosition={anchorPosition}
            title={`Edit ${config.label}`}
            className="event-details-popover"
        >
            <form onSubmit={handleSubmit} className="event-form">
                {ungrouped.map(field => {
                    const isAllDay = formData.isAllDay || false;

                    if (field.name === 'end' && isAllDay) {
                        return null;
                    }

                    // Show 'completed' field only for task events
                    if (field.name === 'completed' && eventType !== 'task') {
                        return null;
                    }

                    if (field.type === 'checkbox') {
                        return (
                            <div key={field.name} className="form-field checkbox-field">
                                {renderField(field)}
                            </div>
                        );
                    }

                    return (
                        <div key={field.name} className="form-field">
                            <label htmlFor={`event-${field.name}`}>{field.label}</label>
                            {renderField(field)}
                        </div>
                    );
                })}

                {Object.entries(grouped).map(([groupName, fields]) => (
                    <div key={groupName} className={`form-row ${groupName}`}>
                        {fields.map(field => (
                            <div key={field.name} className="form-field">
                                <label htmlFor={`event-${field.name}`}>{field.label}</label>
                                {renderField(field)}
                            </div>
                        ))}
                    </div>
                ))}

                <div className="form-actions">
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="delete-button"
                        disabled={isSubmitting}
                    >
                        Delete Event
                    </button>
                    <button
                        type="submit"
                        className="primary-button"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Updating...' : 'Update Event'}
                    </button>
                </div>
            </form>
        </FormPopover>
    );
};

export default EventDetailsPopover;