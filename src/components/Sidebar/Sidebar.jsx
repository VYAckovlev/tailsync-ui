import {useState, useRef} from 'react';
import "./Sidebar.css";
import "../../hooks/useClickOutside.js"
import CalendarGroup from "../CalendarGroup/CalendarGroup.jsx";
import {useClickOutside} from "../../hooks/useClickOutside.js";
import PlusIcon from "../../shared/icons/Plus.icon.jsx";
import CalendarPopover from "../CalendarPopover/CalendarPopover.jsx";
import { calendarApi } from "../../services/calendarApi.js";

const Sidebar = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isCalendarPopoverOpen, setIsCalendarPopoverOpen] = useState(false);
    const [popoverAnchorPosition, setPopoverAnchorPosition] = useState({ x: 0, y: 0 });
    const createRef = useRef(null);

    useClickOutside(createRef, () => setIsCreateOpen(false));

    const handleCreateClick = (type) =>{
        console.log(`Create: ${type}`);
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
            // TODO: Show error toast notification
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
                    <button className="create-item" onClick={() => handleCreateClick('arrangement')}>
                        Arrangement
                    </button>
                    <button className="create-item" onClick={() => handleCreateClick('reminder')}>
                        Reminder
                    </button>
                    <button className="create-item" onClick={() => handleCreateClick('task')}>
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
        </aside>
    );
}

export default Sidebar