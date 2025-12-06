import { useEffect, useState } from 'react';
import useForm from '../../hooks/useForm.js';
import FormPopover from '../FormPopover/FormPopover.jsx';
import { EVENT_TYPES, EVENT_FORM_CONFIGS } from '../../shared/constants/eventForm.config.js';
import { useCalendar } from '../../context/CalendarContext.jsx';
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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { calendars } = useCalendar();

    const eventType = eventData?.type || EVENT_TYPES.ARRANGEMENT;
    const config = EVENT_FORM_CONFIGS[eventType] || EVENT_FORM_CONFIGS[EVENT_TYPES.ARRANGEMENT];

    const { formData, setFormData, handleChange, handleSubmit } = useForm(
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
                onClose();
            } catch (error) {
                console.error('Failed to update event:', error);
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
            recurrence: event.recurrence || 'none',
        });
    };

    useEffect(() => {
        if (isOpen && eventData) {
            prefillEventData(eventData);
        }
    }, [isOpen, eventData]);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        setIsSubmitting(true);
        try {
            await onDelete(eventData.id);
            onClose();
        } catch (error) {
            console.error('Failed to delete event:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDateOrCheckboxChange = (e) => {
        const { name, checked, value } = e.target;

        if (name === 'isAllDay') {
            setFormData(prev => ({
                ...prev,
                isAllDay: checked,
                start: formatForInput(prev.start, checked),
                end: formatForInput(prev.end, checked)
            }));
            return;
        }

        if (name === 'start') {
            handleChange(e);
            if (formData.end && value > formData.end) {
                setFormData(prev => ({ ...prev, [name]: value, end: '' }));
            }
            return;
        }

        handleChange(e);
    };

    const renderField = (field) => {
        const commonProps = {
            id: `event-${field.name}`,
            name: field.name,
            required: field.required,
            onChange: handleChange,
            autoFocus: field.autoFocus,
            value: formData[field.name] || ''
        };

        const isAllDay = formData.isAllDay || false;

        switch (field.type) {
            case 'text':
                return <input type="text" {...commonProps} placeholder={field.placeholder} maxLength={100} />;

            case 'datetime':
            case 'datetime-local':
            case 'date':
                const inputType = isAllDay ? 'date' : 'datetime-local';
                let minProp = undefined;
                let maxProp = undefined;
                let isDisabled = false;

                if (field.name === 'end') {
                    if (!formData.start) {
                        isDisabled = true;
                    } else {
                        minProp = formData.start;
                        const startDatePart = formData.start.split('T')[0];
                        if (isAllDay) {
                            maxProp = startDatePart;
                        } else {
                            maxProp = `${startDatePart}T23:59`;
                        }
                    }
                }

                return (
                    <input
                        type={inputType}
                        {...commonProps}
                        onChange={handleDateOrCheckboxChange}
                        min={minProp}
                        max={maxProp}
                        disabled={isDisabled}
                    />
                );

            case 'checkbox':
                return (
                    <div className="checkbox-wrapper">
                        <input
                            type="checkbox"
                            {...commonProps}
                            onChange={handleDateOrCheckboxChange}
                            checked={formData[field.name] || false}
                            value={undefined}
                        />
                        <label htmlFor={commonProps.id} className="checkbox-label">
                            {field.label}
                        </label>
                    </div>
                );

            case 'select':
                if (field.name === 'calendarId') {
                    return (
                        <select {...commonProps} disabled={!calendars?.length}>
                            <option value="" disabled>{field.placeholder}</option>
                            {calendars?.filter(c => c.id !== 'holidays').map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    );
                }
                if (field.options) {
                    return (
                        <select {...commonProps}>
                            {field.options.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    );
                }
                return null;

            case 'textarea':
                return <textarea {...commonProps} placeholder={field.placeholder} rows={3} maxLength={500} />;

            case 'color':
                return (
                    <input
                        type="color"
                        id={`event-${field.name}`}
                        name={field.name}
                        className="custom-color-input"
                        value={formData[field.name] || config.color}
                        onChange={handleChange}
                    />
                );

            default:
                return null;
        }
    };

    if (!eventData) return null;

    return (
        <FormPopover
            isOpen={isOpen}
            onClose={onClose}
            anchorPosition={anchorPosition}
            title={`Edit ${config.label}`}
            className="event-details-popover"
        >
            <form onSubmit={handleSubmit} className="event-form">
                {config.fields.map((field, index) => {
                    const isAllDay = formData.isAllDay || false;

                    if (field.name === 'end' && (isAllDay || eventType === 'reminder' || eventType === 'task')) {
                        return null;
                    }
                    if (field.name === 'completed' && eventType !== 'task') return null;

                    if (field.group) {
                        const prevField = config.fields[index - 1];
                        if (prevField && prevField.group === field.group) return null;

                        const groupFields = config.fields.filter(f => f.group === field.group);

                        return (
                            <div key={field.group} className="form-row date-row">
                                {groupFields.map(gf => {
                                    if (gf.name === 'end' && (isAllDay || eventType === 'reminder' || eventType === 'task')) {
                                        return null;
                                    }
                                    return (
                                        <div key={gf.name} className="form-field">
                                            <label htmlFor={`event-${gf.name}`}>{gf.label}</label>
                                            {renderField(gf)}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    }

                    return (
                        <div key={field.name} className={`form-field ${field.type === 'checkbox' ? 'checkbox-field' : ''}`}>
                            {field.type !== 'checkbox' && <label htmlFor={`event-${field.name}`}>{field.label}</label>}
                            {renderField(field)}
                        </div>
                    );
                })}

                <div className="form-actions">
                    <button type="button" onClick={handleDelete} className="delete-button" disabled={isSubmitting}>
                        Delete
                    </button>
                    <button type="submit" className="primary-button" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </FormPopover>
    );
};

export default EventDetailsPopover;