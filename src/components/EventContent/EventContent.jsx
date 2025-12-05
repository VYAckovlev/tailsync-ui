import React from 'react';
import ThreeDotsIcon from '../../shared/icons/ThreeDots.icon.jsx';
import ArrangementIcon from '../../shared/icons/Arrangement.icon.jsx';
import ReminderIcon from '../../shared/icons/Reminder.icon.jsx';
import TaskIcon from '../../shared/icons/Task.icon.jsx';
import HolidayIcon from '../../shared/icons/Holiday.icon.jsx';
import './EventContent.css';

const EventContent = ({ eventInfo, onEditClick }) => {
    const eventType = eventInfo.event.extendedProps?.type || 'arrangement';
    const isCompleted = eventInfo.event.extendedProps?.completed || false;
    const isStartDay = eventInfo.isStart;
    const isDayGridView = eventInfo.view.type.includes('dayGrid');

    const handleEditClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        onEditClick(eventInfo, e);
    };

    const getEventTypeIcon = () => {
        switch (eventType) {
            case 'arrangement':
                return <ArrangementIcon className="event-type-icon" />;
            case 'reminder':
                return <ReminderIcon className="event-type-icon" />;
            case 'task':
                return <TaskIcon className="event-type-icon" />;
            case 'holiday':
                return <HolidayIcon className="event-type-icon" />;
            default:
                return <ArrangementIcon className="event-type-icon" />;
        }
    };

    if (!isStartDay && isDayGridView) {
        return (
            <div
                className="event-badge"
                title={`${eventInfo.event.title} (click to edit)`}
                onClick={handleEditClick}
                style={{ cursor: 'pointer', width: '100%', height: '100%' }}
            >
                <div className="badge-indicator" />
                <span className="badge-title">{eventInfo.event.title}</span>
            </div>
        );
    }

    return (
        <div className={`custom-event-content ${eventType === 'task' && isCompleted ? 'completed' : ''}`}>
            <div className="event-time">
                {eventInfo.timeText}
            </div>
            <div className="event-title-row">
                {getEventTypeIcon()}
                <div className="event-title">
                    {eventInfo.event.title}
                </div>
            </div>
            <button
                className="event-edit-button"
                onClick={handleEditClick}
                title="Edit event"
            >
                <ThreeDotsIcon />
            </button>
        </div>
    );
};

export default EventContent;