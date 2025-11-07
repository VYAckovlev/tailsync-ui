import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AuthForm from '../../components/AuthForm/AuthForm';
import Pitch from '../../components/Pitch/Pitch';
import Background from '../../shared/background/background';
import './Register.css';

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
      throw new Error('Passwords do not match');
    }

    const result = await register(data.name, data.email, data.password);
    if (!result.success) {
      throw new Error(result.error);
    }
  };

  return (
    <Background>
      <div className="auth-layout">
        <AuthForm
          fields={registerFields}
          onSubmit={onSubmit}
          submitButtonText={loading ? "Creating account..." : "Register"}
          switchLink={{
            text: "Already have an account?",
            linkText: "Sign in",
            to: "/login"
          }}
        />
        <Pitch />
      </div>
    </Background>
  );
};

export default Register;