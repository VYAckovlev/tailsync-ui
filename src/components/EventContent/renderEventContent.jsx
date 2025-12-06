import React from 'react';
import EventContent from './EventContent.jsx';

export const createEventContentRenderer = (calculatePosition, openDetails) => {
    return (eventInfo) => {
        const handleEditClick = (eventInfo, e) => {
            const position = calculatePosition(e);
            openDetails(eventInfo, position);
        };

        return (
            <EventContent
                eventInfo={eventInfo}
                onEditClick={handleEditClick}
            />
        );
    };
};