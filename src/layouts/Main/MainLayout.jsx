import { Outlet } from 'react-router-dom';
import Background from '../../shared/background/background.jsx';
import Header from '../../components/Header/header.jsx';
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import { CalendarProvider } from '../../context/CalendarContext.jsx';
import './MainLayout.css';

const MainLayout = () => {
    return (
        <CalendarProvider>
            <Header />
            <Sidebar/>
            <Background centered={false}>
                <div className="main-content">
                    <Outlet />
                </div>
            </Background>
        </CalendarProvider>
    );
};

export default MainLayout;