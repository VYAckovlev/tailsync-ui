import React from 'react';
import { useRegister } from "../../hooks/useAuth.js";
import AuthForm from '../../components/AuthForm/AuthForm';
import toast from "react-hot-toast";
import { registerConfig, formValidators } from '../../shared/constants/form';

const Register = () => {
  const { register, isLoading, error } = useRegister();

  const onSubmit = async (data) => {
      const validation = formValidators.validatePasswordMatch(data.password, data.confirm_password);
      if (!validation.isValid) {
          toast.error(validation.error);
          return;
      }
      try {
          const result = await register(data);
          if (!result.success) {
              throw new Error(result.error);
          }
          toast.success("Account created successfully!");
      } catch (err) {
          toast.error(err.message);
      }
  };

  return (
    <AuthForm
      fields={registerConfig.fields}
      onSubmit={onSubmit}
      submitButtonText={isLoading ? registerConfig.loadingText : registerConfig.submitButtonText}
      switchLink={{
        text: "Already have an account?",
        linkText: "Sign in",
        to: "/auth/login"
      }}
    />
  );
};

export default Register;