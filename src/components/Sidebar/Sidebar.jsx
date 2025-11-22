import {useState, useRef} from 'react';
import "./Sidebar.css";
import "../../hooks/useClickOutside.js"
import CalendarGroup from "../CalendarGroup/CalendarGroup.jsx";
import {useClickOutside} from "../../hooks/useClickOutside.js";
import PlusIcon from "../../shared/icons/Plus.icon.jsx";

const Sidebar = () => {
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const createRef = useRef(null);

    useClickOutside(createRef, () => setIsCreateOpen(false));

    const handleCreateClick = (type) =>{
        console.log(`Create: ${type}`);
        setIsCreateOpen(false);
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
                <CalendarGroup title="My Calendars">
                    {/* // TODO: calendars created by our user */}
                </CalendarGroup>

                <CalendarGroup title="Other Calendars">
                    {/* // TODO: calendars created by another user */}
                </CalendarGroup>
            </div>
        </aside>
    );
}

export default Sidebar