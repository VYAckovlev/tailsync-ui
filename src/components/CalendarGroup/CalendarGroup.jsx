import { useState } from 'react';
import ChevronRightIcon from "../../shared/icons/ChevronRight.icon.jsx";

const CalendarGroup = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="calendar-group">
            <button className="group-header" onClick={() => setIsOpen(!isOpen)}>
                <span className="group-title">{title}</span>
                <ChevronRightIcon className={`group-chevron ${isOpen ? 'open' : ''}`} />
            </button>
            <div className={`group-content ${isOpen ? 'open' : ''}`}>
                {children}
            </div>
        </div>
    );
};

export default CalendarGroup;