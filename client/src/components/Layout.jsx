import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { Container, Box } from '@mui/material';

const Layout = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
                <Outlet />
            </Container>
        </Box>
    );
};

export default Layout;
