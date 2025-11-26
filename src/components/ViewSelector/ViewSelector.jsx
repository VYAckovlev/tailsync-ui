import {useLocation, useNavigate} from "react-router-dom";
import {useState} from "react";

const ViewSelector = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const currentView = location.pathname.split('/').pop();

    const viewOptions = [
        { label: 'Year', value: 'year'},
        { label: 'Month', value: 'month' },
        { label: 'Week', value: 'week' },
        { label: 'Day', value: 'day' }
    ]

    const handleViewChange = (view) => {
        navigate(`/tailsync/${view}`);
        setIsOpen(false);
    }

    const currentLabel = viewOptions.find(v => v.value === currentView)?.label

    return (
        <div className="view-selector">
            <button
                className="view-selector-btn"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{currentLabel}</span>
            </button>
            <div className={`view-dropdown ${isOpen ? 'open' : ''}`}>
                {viewOptions.map((option) => (
                    <button
                        key={option.value}
                        className={`view-option ${currentView === option.value ? 'active' : ''}`}
                        onClick={() => handleViewChange(option.value)}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default ViewSelector;