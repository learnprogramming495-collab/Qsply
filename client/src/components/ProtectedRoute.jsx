import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        // You can add a spinner or a loading component here
        return <div>Loading session...</div>;
    }

    return user ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
