import { useState } from 'react';
import Chevron from "../../shared/icons/Chevron.icon.jsx";
import PlusIcon from "../../shared/icons/Plus.icon.jsx";

const CalendarGroup = ({ title, children, onPlusClick }) => {
    const [isOpen, setIsOpen] = useState(true);

    const handlePlusClick = (e) => {
        e.stopPropagation();
        onPlusClick?.(e);
    }

    return (
        <div className="calendar-group">
            <div className="group-header-wrapper">
                <button className="group-header" onClick={() => setIsOpen(!isOpen)}>
                    <span className="group-title">{title}</span>
                    <Chevron.ChevronRight className={`group-chevron ${isOpen ? 'open' : ''}`} />
                </button>
                {onPlusClick && (
                    <button className="group-plus-btn" onClick={handlePlusClick} title="Add calendar">
                        <PlusIcon />
                    </button>
                )}
            </div>

            <div className={`group-content ${isOpen ? 'open' : ''}`}>
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CalendarGroup;