import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';

const RegisterForm = ({ onRegister, error }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!username || !email || !password) {
            return;
        }
        onRegister({ username, email, password });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Register
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
                label="Username"
                type="text"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                fullWidth
            />
            <TextField
                label="Email"
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
            />
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
            />
            <Button type="submit" variant="contained" color="secondary" size="large">
                Register
            </Button>
        </Box>
    );
};

export default RegisterForm;
