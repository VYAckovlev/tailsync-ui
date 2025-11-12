import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import AuthForm from '../../components/AuthForm/AuthForm';
import toast from "react-hot-toast";
import './Login.css';

const loginFields = [
    {
        name: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'Enter your email'
    },
    {
        name: 'password',
        type: 'password',
        label: 'Password',
        placeholder: 'Enter your password'
    }
];

const Login = () => {
    const { login, loading } = useAuth();
    const onSubmit = async (data) => {
        try {
            const result = await login(data);
            if (!result.success) {
                throw new Error(result.error);
            }
            toast.success("Welcome back!");
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <AuthForm
            fields={loginFields}
            onSubmit={onSubmit}
            submitButtonText={loading ? "Logging in..." : "Login"}
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