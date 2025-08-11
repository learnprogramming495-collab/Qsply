import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const navStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
};

const linkStyles = {
    textDecoration: 'none',
    color: '#007bff',
    fontWeight: 'bold',
};

const buttonStyles = {
    border: 'none',
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    borderRadius: '4px',
    cursor: 'pointer',
};

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header style={headerStyles}>
            <Link to="/" style={{ ...linkStyles, fontSize: '1.5rem' }}>AgriTech</Link>
            <nav style={navStyles}>
                {user ? (
                    <>
                        <Link to="/dashboard" style={linkStyles}>Dashboard</Link>
                        <Link to="/cart" style={linkStyles}>Cart</Link>
                        <Link to="/orders" style={linkStyles}>Orders</Link>
                        <button onClick={handleLogout} style={buttonStyles}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/" style={linkStyles}>Login / Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
