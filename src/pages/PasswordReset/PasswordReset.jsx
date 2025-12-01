import React from 'react';
import { usePasswordReset } from "../../hooks/useAuth.js";
import AuthForm from '../../components/AuthForm/AuthForm';
import toast from "react-hot-toast";
import { passwordResetConfig } from '../../shared/constants/form';

const PasswordReset = () => {
    const { requestPasswordReset, isLoading, error } = usePasswordReset();

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
        <AuthForm
            fields={passwordResetConfig.fields}
            onSubmit={onSubmit}
            submitButtonText={isLoading ? passwordResetConfig.loadingText : passwordResetConfig.submitButtonText}
        />
    );
};

export default PasswordReset;