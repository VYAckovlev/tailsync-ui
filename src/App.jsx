import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import AuthLayout from './layouts/Auth/AuthLayout.jsx';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import PasswordReset from './pages/PasswordReset/PasswordReset';
import PasswordResetConfirm from './pages/PasswordReset/PasswordResetConfirm';
import { Toaster } from 'react-hot-toast';
import MainLayout from "./layouts/Main/MainLayout.jsx";
import CalendarMonth from "./pages/Calendar/Month/CalendarMonth.jsx";
import CalendarYear from "./pages/Calendar/Year/CalendarYear.jsx";
import CalendarWeek from "./pages/Calendar/Week/CalendarWeek.jsx";
import CalendarDay from "./pages/Calendar/Day/CalendarDay.jsx";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <UserProvider>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 2500,
                        style: {
                            background: '#1a2244',
                            color: '#fff',
                            borderRadius: '8px',
                            fontSize: '14px',
                            border: '1px solid rgba(255,255,255,0.1)',
                        },
                    }}
                />
                <Routes>
                    <Route path="/" element={<Navigate to="/auth/login" replace />} />
                    <Route path="/auth" element={<AuthLayout />}>
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                        <Route path="password-reset" element={<PasswordReset />} />
                        <Route path="password-reset/:token" element={<PasswordResetConfirm />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/auth/login" replace />} />
                    <Route path="/tailsync" element={<MainLayout/>}>
                        <Route index element={<Navigate to="month" replace />} />
                        <Route path="year" element={<CalendarYear />}/>
                        <Route path="month" element={<CalendarMonth />} />
                        <Route path="week" element={<CalendarWeek />} />
                        <Route path="day" element={<CalendarDay />} />
                    </Route>
                </Routes>
                </UserProvider>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
