import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AuthForm from '../../components/AuthForm/AuthForm';
import toast from "react-hot-toast";
import { passwordResetConfirmConfig, formValidators } from '../../shared/constants/form';

const PasswordResetConfirm = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { confirmPasswordReset, loading } = useAuth();

    const onSubmit = async (data) => {
        try {
            const validation = formValidators.validatePasswordMatch(data.password, data.confirm_password);
            if (!validation.isValid) {
                toast.error(validation.error);
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
        <AuthForm
            fields={passwordResetConfirmConfig.fields}
            onSubmit={onSubmit}
            submitButtonText={loading ? passwordResetConfirmConfig.loadingText : passwordResetConfirmConfig.submitButtonText}
        />
    );
};

export default PasswordResetConfirm;