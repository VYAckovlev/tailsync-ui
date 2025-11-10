import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import AuthForm from '../../components/AuthForm/AuthForm';
import Pitch from '../../components/Pitch/Pitch';
import Background from '../../shared/background/background';
import './PasswordReset.css';
import toast from "react-hot-toast";

const passwordResetFields = [
    {
        name: 'email',
        type: 'email',
        label: 'Email',
        placeholder: 'Enter your email address'
    }
];

const PasswordReset = () => {
    const { requestPasswordReset, loading } = useAuth();

    const onSubmit = async (data) => {
        try {
            const result = await requestPasswordReset(data.email);
            if (!result.success) {
                throw new Error(result.error);
            }
            toast.success("Check your email for reset instructions");
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <Background>
            <div className="auth-layout">
                <AuthForm
                    fields={passwordResetFields}
                    onSubmit={onSubmit}
                    submitButtonText={loading ? "Sending..." : "Reset Password"}
                />
                <Pitch />
            </div>
        </Background>
    );
};

export default PasswordReset;