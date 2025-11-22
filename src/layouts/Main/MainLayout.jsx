import { Outlet } from 'react-router-dom';
import Background from '../../shared/background/background.jsx';
import Header from '../../components/Header/header.jsx';
import Sidebar from '../../components/Sidebar/Sidebar.jsx';
import './MainLayout.css';

const MainLayout = () => {
    return (
        <>
            <Header />
            <Sidebar/>
            <Background>
                <div className="main-content">
                    <Outlet />
                </div>
            </Background>
        </>
    );
};

export default MainLayout;