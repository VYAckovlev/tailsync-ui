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

        let endValue = '';
        if (!isAllDayEvent) {
            const endDate = new Date(date);
            endDate.setHours(endDate.getHours() + 1);
            endValue = formatForInput(endDate, false);
        }

        setFormData(prev => ({
            ...prev,
            start: startValue,
            end: endValue,
            isAllDay: isAllDayEvent
        }));
    };

    useEffect(() => {
        if (isOpen) {
            setCurrentEventType(eventType);
            resetForm();

            setFormData(prev => ({ ...prev, color: config.color }));

            if (initialDate) {
                prefillDateFields(initialDate);
            }
        }
    }, [isOpen, eventType, initialDate]);

    useEffect(() => {
        if (calendars.length > 0 && !formData.calendarId) {
            setFormData(prev => ({ ...prev, calendarId: calendars[0].id }));
        }
    }, [calendars, formData.calendarId, isOpen]);

    const handleAllDayChange = (e) => {
        const { checked } = e.target;
        setFormData(prev => ({
            ...prev,
            isAllDay: checked,
            start: formatForInput(prev.start, checked),
            end: formatForInput(prev.end, checked)
        }));
    };

    const handleEventTypeChange = (newType) => {
        setCurrentEventType(newType);
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
                        maxProp = isAllDay ? startDatePart : `${startDatePart}T23:59`;
                    }
                }

                return (
                    <input
                        type={inputType}
                        {...commonProps}
                        min={minProp}
                        max={maxProp}
                        disabled={isDisabled}
                    />
                );

            case 'checkbox':
                const isAllDayField = field.name === 'isAllDay';
                return (
                    <div className="checkbox-wrapper">
                        <input
                            type="checkbox"
                            {...commonProps}
                            onChange={isAllDayField ? handleAllDayChange : handleChange}
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
                        <select {...commonProps} disabled={isLoadingCalendars}>
                            <option value="" disabled>{isLoadingCalendars ? 'Loading...' : field.placeholder}</option>
                            {calendars.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    );
                }
                if (field.options) {
                    return (
                        <select {...commonProps}>
                            {field.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    );
                }
                return null;

            case 'textarea':
                return <textarea {...commonProps} placeholder={field.placeholder} rows={3} maxLength={500} />;

            case 'color':
                return <input type="color" {...commonProps} className="custom-color-input" />;

            default:
                return null;
        }
    };

    const groupFields = (fields) => {
        const grouped = {};
        const ungrouped = [];
        fields.forEach(field => {
            if (field.group) {
                if (!grouped[field.group]) grouped[field.group] = [];
                grouped[field.group].push(field);
            } else {
                ungrouped.push(field);
            }
        });
        return { grouped, ungrouped };
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
                {Object.entries(EVENT_TYPES)
                    .filter(([_, type]) => type !== 'holiday')
                    .map(([_, type]) => (
                        <button
                            key={type}
                            type="button"
                            className={`event-type-button ${currentEventType === type ? 'active' : ''}`}
                            onClick={() => handleEventTypeChange(type)}
                            style={{ '--event-color': EVENT_FORM_CONFIGS[type].color }}
                        >
                            {EVENT_FORM_CONFIGS[type].label}
                        </button>
                    ))}
            </div>

            <form onSubmit={handleSubmit} className="event-form">
                {ungrouped.map(field => {
                    const isAllDay = formData.isAllDay || false;

                    if (field.editOnly) return null;

                    if (field.name === 'end' && (isAllDay || currentEventType === 'reminder' || currentEventType === 'task')) {
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
                        {fields.map(field => {
                            const isAllDay = formData.isAllDay || false;
                            if (field.name === 'end' && (isAllDay || currentEventType === 'reminder' || currentEventType === 'task')) {
                                return null;
                            }
                            return (
                                <div key={field.name} className="form-field">
                                    <label htmlFor={`event-${field.name}`}>{field.label}</label>
                                    {renderField(field)}
                                </div>
                            );
                        })}
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