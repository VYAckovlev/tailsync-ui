import { Outlet } from 'react-router-dom';
import Background from '../shared/background/background';
import Logo from '../shared/logo/logo';
import Pitch from '../components/Pitch/Pitch';

const AuthLayout = () => {
    return (
        <Background>
            <div className="auth-layout">
                <div className="auth-content">
                    <div className="brand-block">
                        <Logo size="medium" />
                        <div>
                            <h1 className="brand-title">TailSync</h1>
                        </div>
                    </div>
                    <Outlet />
                </div>
                <Pitch />
            </div>
        </Background>
    );
};

export default AuthLayout;