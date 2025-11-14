import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import AuthForm from '../../components/AuthForm/AuthForm';
import toast from "react-hot-toast";

const registerFields = [
  {
    name: 'name',
    type: 'text',
    label: 'Name',
    placeholder: 'Enter your full name'
  },
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
  },
  {
    name: 'confirmPassword',
    type: 'password',
    label: 'Confirm Password',
    placeholder: 'Confirm your password'
  }
];

const Register = () => {
  const { register, loading } = useAuth();

  const onSubmit = async (data) => {
      if (data.password !== data.confirmPassword) {
          toast.error('Passwords do not match');
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
      fields={registerFields}
      onSubmit={onSubmit}
      submitButtonText={loading ? "Creating account..." : "Register"}
      switchLink={{
        text: "Already have an account?",
        linkText: "Sign in",
        to: "/auth/login"
      }}
    />
  );
};

export default Register;