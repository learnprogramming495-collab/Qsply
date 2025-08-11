import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Logo from './Logo'; // Import the new Logo component

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <Box sx={{ flexGrow: 1 }}>
                    <Logo />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {user ? (
                        <>
                            <Button color="inherit" component={RouterLink} to="/dashboard" startIcon={<DashboardIcon />}>
                                Dashboard
                            </Button>
                            <Button color="inherit" component={RouterLink} to="/cart" startIcon={<ShoppingCartIcon />}>
                                Cart
                            </Button>
                            <Button color="inherit" component={RouterLink} to="/orders" startIcon={<ListAltIcon />}>
                                Orders
                            </Button>
                            <Button variant="contained" color="secondary" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Button color="inherit" component={RouterLink} to="/">
                            Login / Register
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
