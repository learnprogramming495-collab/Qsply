import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import authService from '../services/authService';

const HomePage = () => {
    const [loginError, setLoginError] = useState('');
    const [registerError, setRegisterError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (credentials) => {
        try {
            setLoginError('');
            const data = await authService.login(credentials);
            login(data.token);
            navigate('/dashboard');
        } catch (err) {
            setLoginError(err.response?.data?.msg || 'Login failed. Please try again.');
        }
    };

    const handleRegister = async (userData) => {
        try {
            setRegisterError('');
            const data = await authService.register(userData);
            login(data.token);
            navigate('/dashboard');
        } catch (err) {
            setRegisterError(err.response?.data?.msg || 'Registration failed. Please try again.');
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', maxWidth: '1000px', margin: '4rem auto', padding: '2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <LoginForm onLogin={handleLogin} error={loginError} />
            <RegisterForm onRegister={handleRegister} error={registerError} />
        </div>
    );
};

export default HomePage;
