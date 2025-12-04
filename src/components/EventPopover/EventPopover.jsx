import { useEffect, useState } from 'react';
import useForm from '../../hooks/useForm.js';
import FormPopover from '../FormPopover/FormPopover.jsx';
import { EVENT_TYPES, EVENT_FORM_CONFIGS } from '../../shared/constants/eventForm.config.js';
import { formatForInput } from "../../utils/DateUtils.js";
import { useCalendar } from '../../context/CalendarContext.jsx';
import './EventPopover.css';

const EventPopover = ({ isOpen, onClose, onSubmit, anchorPosition, eventType, initialDate }) => {
    const [currentEventType, setCurrentEventType] = useState(eventType);
    const { calendars, isLoading: isLoadingCalendars } = useCalendar();

    const config = EVENT_FORM_CONFIGS[currentEventType] || EVENT_FORM_CONFIGS[EVENT_TYPES.ARRANGEMENT];

    const { formData, setFormData, handleChange, handleSubmit, resetForm } = useForm(
        config.fields,
        async (data) => {
            const eventData = {
                ...data,
                type: currentEventType,
                color: data.color || config.color
            };

            await onSubmit(eventData);
            resetForm();
            onClose();
        }
    );

    const prefillDateFields = (dateInfo) => {
        const { dateStr, date, allDay } = dateInfo;
        const isAllDayEvent = allDay !== undefined ? allDay : true;

        let startValue;
        if (isAllDayEvent) {
            startValue = dateStr.split('T')[0];
        } else {
            startValue = formatForInput(date, false);
        }

        let endValue;
        if (!isAllDayEvent) {
            const endDate = new Date(date);
            endDate.setHours(endDate.getHours() + 1);
            endValue = formatForInput(endDate, false);
        }

        setFormData(prev => ({
            ...prev,
            start: startValue,
            end: endValue || '',
            isAllDay: isAllDayEvent
        }));
    };

    useEffect(() => {
        if (isOpen) {
            setCurrentEventType(eventType);
            resetForm();

            if (!formData.color) {
                setFormData(prev => ({
                    ...prev,
                    color: config.color
                }));
            }

            if (initialDate) {
                prefillDateFields(initialDate);
            }
        }
    }, [isOpen, eventType, initialDate]);

    useEffect(() => {
        if (calendars.length > 0 && !formData.calendarId) {
            setFormData(prev => ({
                ...prev,
                calendarId: calendars[0].id
            }));
        }
    }, [calendars, formData.calendarId]);

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

    const handleEventTypeChange = (newType) => {
        setCurrentEventType(newType);
        resetForm();
    };

    const { grouped, ungrouped } = groupFields(config.fields);

    return (
        <FormPopover
            isOpen={isOpen}
            onClose={onClose}
            anchorPosition={anchorPosition}
            title={`Create ${config.label}`}
            className="event-popover"
        >
            <div className="event-type-switcher">
                {Object.entries(EVENT_TYPES).map(([key, type]) => (
                    <button
                        key={type}
                        type="button"
                        className={`event-type-button ${currentEventType === type ? 'active' : ''}`}
                        onClick={() => handleEventTypeChange(type)}
                        style={{
                            '--event-color': EVENT_FORM_CONFIGS[type].color
                        }}
                    >
                        {EVENT_FORM_CONFIGS[type].label}
                    </button>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="event-form">
                {ungrouped.map(field => {
                    const isAllDay = formData.isAllDay || false;
                    if (field.name === 'end' && isAllDay) {
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
                    <button type="submit" className="primary-button">
                        Create
                    </button>
                </div>
            </form>
        </FormPopover>
    );
};

export default EventPopover;