import { useState } from 'react';
import Chevron from "../../shared/icons/Chevron.icon.jsx";

const CalendarGroup = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="calendar-group">
            <button className="group-header" onClick={() => setIsOpen(!isOpen)}>
                <span className="group-title">{title}</span>
                <Chevron.ChevronRight className={`group-chevron ${isOpen ? 'open' : ''}`} />
            </button>
            <div className={`group-content ${isOpen ? 'open' : ''}`}>
                {children}
            </div>
        </div>
    );
};

export default CalendarGroup;