import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AuthForm from '../../components/AuthForm/AuthForm';
import Pitch from '../../components/Pitch/Pitch';
import Background from '../../shared/background/background';
import './PasswordReset.css';
import toast from "react-hot-toast";

const passwordResetFields = [
    {
        name: 'password',
        type: 'password',
        label: 'New Password',
        placeholder: 'Enter your new password'
    },
    {
        name: 'confirmPassword',
        type: 'password',
        label: 'Confirm Password',
        placeholder: 'Confirm your new password'
    }
];

const PasswordResetConfirm = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { confirmPasswordReset, loading } = useAuth();

    const onSubmit = async (data) => {
        try {
            if (data.password !== data.confirmPassword) {
                toast.error("Passwords do not match");
                return;
            }

            if (!token) {
                toast.error("Invalid reset link");
                return;
            }

            const result = await confirmPasswordReset(token, data.password);
            if (!result.success) {
                throw new Error(result.error);
            }

            toast.success("Password changed successfully");

            setTimeout(() => {
                navigate('/auth/login');
            }, 1500);
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
                    submitButtonText={loading ? "Sending..." : "Change Password"}
                />
                <Pitch />
            </div>
        </Background>
    );
};

export default PasswordResetConfirm;