import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import authService from '../services/authService';
import { Grid, Paper, Typography, Box, Divider } from '@mui/material';

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
        <Box sx={{ flexGrow: 1, mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                AgriTech Platform
            </Typography>
            <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
                Connecting Farmers and Buyers in Nepal
            </Typography>
            <Paper elevation={3} sx={{ maxWidth: 1000, mx: 'auto' }}>
                <Grid container>
                    <Grid item xs={12} md={6} sx={{ p: 4 }}>
                        <LoginForm onLogin={handleLogin} error={loginError} />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ p: 4, borderLeft: { md: (theme) => `1px solid ${theme.palette.divider}` } }}>
                        <RegisterForm onRegister={handleRegister} error={registerError} />
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default HomePage;
