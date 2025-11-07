import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AuthForm from '../../components/AuthForm/AuthForm';
import Pitch from '../../components/Pitch/Pitch';
import Background from '../../shared/background/background';
import './PasswordReset.css';

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
        const result = await requestPasswordReset(data.email);
        if (!result.success) {
            throw new Error(result.error);
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