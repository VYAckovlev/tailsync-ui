import { Outlet } from 'react-router-dom';
import Background from '../../shared/background/background.jsx';
import Header from '../../components/Header/header.jsx';
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import EventPopover from '../../components/EventPopover/EventPopover.jsx';
import { CalendarProvider } from '../../context/CalendarContext.jsx';
import { useEventCreation } from '../../hooks/useEventCreation.js';
import './MainLayout.css';

const MainLayout = () => {
    const {
        isEventPopoverOpen,
        popoverAnchorPosition,
        selectedDate,
        eventType,
        events,
        handleDateClick,
        handleEventClick,
        handleEventSubmit,
        closeEventPopover,
    } = useEventCreation();

    return (
        <CalendarProvider>
            <Header />
            <Sidebar />
            <Background centered={false}>
                <div className="main-content">
                    <Outlet context={{
                        events,
                        handleDateClick,
                        handleEventClick
                    }} />
                </div>
            </Background>

            <EventPopover
                isOpen={isEventPopoverOpen}
                onClose={closeEventPopover}
                onSubmit={handleEventSubmit}
                anchorPosition={popoverAnchorPosition}
                eventType={eventType}
                initialDate={selectedDate}
            />
        </CalendarProvider>
    );
};

export default MainLayout;