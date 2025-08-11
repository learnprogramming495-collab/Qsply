import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const payload = JSON.parse(atob(storedToken.split('.')[1]));
                // Optional: Check if token is expired
                if (payload.exp * 1000 > Date.now()) {
                    setUser(payload.user);
                    setToken(storedToken);
                } else {
                    // Token is expired
                    localStorage.removeItem('token');
                }
            } catch (e) {
                console.error("Invalid token found", e);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = (newToken) => {
        try {
            const payload = JSON.parse(atob(newToken.split('.')[1]));
            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(payload.user);
        } catch (e) {
            console.error("Failed to decode token on login", e);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const authContextValue = { token, user, login, logout, loading };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
