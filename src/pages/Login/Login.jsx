import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import AuthForm from '../../components/AuthForm/AuthForm';
import Pitch from '../../components/Pitch/Pitch';
import Background from '../../shared/background/background';
import './Login.css';
import toast from "react-hot-toast";

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
        <Background>
            <div className="auth-layout">
                <AuthForm
                    fields={loginFields}
                    onSubmit={onSubmit}
                    submitButtonText={loading ? "Logging in..." : "Login"}
                    showForgotPassword={true}
                    switchLink={{
                        text: "Don't have an account?",
                        linkText: "Sign up",
                        to: "/register"
                    }}
                />
                <Pitch />
          </div>
        </Background>
    );
};

export default Login;