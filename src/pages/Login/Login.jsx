import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import AuthForm from '../../components/AuthForm/AuthForm';
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import { loginConfig } from '../../shared/constants/form';

const Login = () => {
    const navigate = useNavigate();
    const { login, loading } = useAuth();
    const onSubmit = async (data) => {
        try {
            const result = await login(data);
            if (!result.success) {
                throw new Error(result.error);
            }
            navigate('/tailsync');
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