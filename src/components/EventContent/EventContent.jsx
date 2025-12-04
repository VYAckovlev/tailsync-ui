import React from 'react';
import ThreeDotsIcon from '../../shared/icons/ThreeDots.icon.jsx';
import './EventContent.css';

const EventContent = ({ eventInfo, onEditClick }) => {
    const handleEditClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        onEditClick(eventInfo, e);
    };

    return (
        <div className="custom-event-content">
            <div className="event-time">
                {eventInfo.timeText}
            </div>
            <div className="event-title">
                {eventInfo.event.title}
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