import { useEvents } from '../../context/EventsContext';
import EventPopover from '../../components/EventPopover/EventPopover';
import EventDetailsPopover from '../../components/EventDetailsPopover/EventDetailsPopover';

export const CalendarOverlays = () => {
    const {
        isEventPopoverOpen,
        popoverAnchorPosition,
        selectedDate,
        eventType,
        handleEventSubmit,
        closeEventPopover,

        isEventDetailsPopoverOpen,
        selectedEvent,
        eventDetailsPosition,
        handleEventUpdate,
        handleEventDelete,
        closeEventDetailsPopover,
    } = useEvents();

    return (
        <>
            <EventPopover
                isOpen={isEventPopoverOpen}
                onClose={closeEventPopover}
                onSubmit={handleEventSubmit}
                anchorPosition={popoverAnchorPosition}
                eventType={eventType}
                initialDate={selectedDate}
            />

            <EventDetailsPopover
                isOpen={isEventDetailsPopoverOpen}
                onClose={closeEventDetailsPopover}
                onUpdate={handleEventUpdate}
                onDelete={handleEventDelete}
                anchorPosition={eventDetailsPosition}
                eventData={selectedEvent}
            />
        </>
    );
};