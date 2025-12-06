import { Outlet } from 'react-router-dom';
import Background from '../../shared/background/background.jsx';
import Header from '../../components/Header/header.jsx';
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import { CalendarProvider } from '../../context/CalendarContext.jsx';
import './MainLayout.css';
import {EventsProvider} from "../../context/EventsContext.jsx";
import {CalendarOverlays} from "../../components/CalendarOverlays/CalendarOverlays.jsx";

const MainLayout = () => {
    return (
        <CalendarProvider>
            <EventsProvider>

                <Header />
                <Sidebar />

                <Background centered={false}>
                    <div className="main-content">
                        <Outlet />
                    </div>
                </Background>

                <CalendarOverlays />

            </EventsProvider>
        </CalendarProvider>
    );
};

export default MainLayout;