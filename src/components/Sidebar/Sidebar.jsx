import {useState, useRef} from 'react';
import toast from "react-hot-toast";
import "./Sidebar.css";
import "../../hooks/useClickOutside.js"
import CalendarGroup from "../CalendarGroup/CalendarGroup.jsx";
import {useClickOutside} from "../../hooks/useClickOutside.js";
import PlusIcon from "../../shared/icons/Plus.icon.jsx";
import CalendarPopover from "../CalendarPopover/CalendarPopover.jsx";
import EventPopover from "../EventPopover/EventPopover.jsx";
import { calendarApi } from "../../services/calendarApi.js";
import { eventApi } from "../../services/eventApi.js";

const Sidebar = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isCalendarPopoverOpen, setIsCalendarPopoverOpen] = useState(false);
    const [isEventPopoverOpen, setIsEventPopoverOpen] = useState(false);
    const [eventPopoverType, setEventPopoverType] = useState('arrangement');
    const [popoverAnchorPosition, setPopoverAnchorPosition] = useState({ x: 0, y: 0 });
    const createRef = useRef(null);

    useClickOutside(createRef, () => setIsCreateOpen(false));

    const handleCreateClick = (type, e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPopoverAnchorPosition({
            x: rect.right + 10,
            y: rect.top
        });
        setEventPopoverType(type);
        setIsEventPopoverOpen(true);
        setIsCreateOpen(false);
    };

    const handleCreateCalendar = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPopoverAnchorPosition({
            x: rect.right + 10,
            y: rect.top
        });
        setIsCalendarPopoverOpen(true);
    };

    const handleCalendarSubmit = async (calendarData) => {
        try {
            await calendarApi.createCalendar(calendarData);
            console.log('Calendar created:', calendarData);
            setIsCalendarPopoverOpen(false);
            // TODO: Refresh calendar list when state management is implemented
        } catch (error) {
            console.error('Failed to create calendar:', error);
            toast.error('Failed to create calendar');
        }
    };

    const handleEventSubmit = async (eventData) => {
        try {
            await eventApi.createEvent(eventData);
            console.log('Event created:', eventData);
            setIsEventPopoverOpen(false);
            // TODO: Refresh event list when state management is implemented
        } catch (error) {
            console.error('Failed to create event:', error);
            toast.error('Failed to create event', error);
        }
    };

    return (
        <aside className="sidebar">
            <div className="create-section" ref={createRef}>
                <button
                    className={`create-btn ${isCreateOpen ? 'active' : ''}`}
                    onClick={() => setIsCreateOpen(true)}>
                    <div className="create-icon-wrapper"><PlusIcon /></div>
                    <span className="create-label">Create</span>
                </button>
                <div className={`create-dropdown ${isCreateOpen ? 'open' : ''}`}>
                    <button className="create-item" onClick={(e) => handleCreateClick('arrangement', e)}>
                        Arrangement
                    </button>
                    <button className="create-item" onClick={(e) => handleCreateClick('reminder', e)}>
                        Reminder
                    </button>
                    <button className="create-item" onClick={(e) => handleCreateClick('task', e)}>
                        Task
                    </button>
                </div>
            </div>
            <div className="calendars-container">
                <CalendarGroup title="My Calendars" onPlusClick={handleCreateCalendar}>
                    {/* // TODO: calendars created by our user */}
                </CalendarGroup>

                <CalendarGroup title="Other Calendars">
                    {/* // TODO: calendars created by another user */}
                </CalendarGroup>
            </div>

            <CalendarPopover
                isOpen={isCalendarPopoverOpen}
                onClose={() => setIsCalendarPopoverOpen(false)}
                onSubmit={handleCalendarSubmit}
                anchorPosition={popoverAnchorPosition}
            />

            <EventPopover
                isOpen={isEventPopoverOpen}
                onClose={() => setIsEventPopoverOpen(false)}
                onSubmit={handleEventSubmit}
                anchorPosition={popoverAnchorPosition}
                eventType={eventPopoverType}
            />
        </aside>
    );
}

export default Sidebar