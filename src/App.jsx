import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import PasswordReset from './pages/PasswordReset/PasswordReset';
import PasswordResetConfirm from './pages/PasswordReset/PasswordResetConfirm';
import { Toaster } from 'react-hot-toast';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
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
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App
