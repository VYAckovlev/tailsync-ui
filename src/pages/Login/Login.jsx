import React from 'react';
import { useAuth } from "../../context/AuthContext.jsx";
import AuthForm from '../../components/AuthForm/AuthForm';
import toast from "react-hot-toast";
import {useLocation, useNavigate} from "react-router-dom";
import { loginConfig } from '../../shared/constants/form';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const fromPage = location.state?.from?.pathname || '/tailsync';
    const { login, loading } = useAuth();
    const onSubmit = async (data) => {
        try {
            const result = await login(data);
            if (!result.success) {
                throw new Error(result.error);
            }
            navigate(fromPage, { replace: true });
            toast.success("Welcome back!");
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <AuthForm
            fields={loginConfig.fields}
            onSubmit={onSubmit}
            submitButtonText={loading ? loginConfig.loadingText : loginConfig.submitButtonText}
            showForgotPassword={true}
            switchLink={{
                text: "Don't have an account?",
                linkText: "Sign up",
                to: "/auth/register"
            }}
        />
    );
};

export default Login;