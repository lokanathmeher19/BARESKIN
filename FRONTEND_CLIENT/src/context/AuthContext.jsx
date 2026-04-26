import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [token, setToken] = useState(localStorage.getItem('token') || sessionStorage.getItem('token') || '');

    useEffect(() => {
        if (token && user) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (user) setUser(null);
            if (token) setToken('');
        }
        window.dispatchEvent(new Event('authChange'));
    }, [token, user]);

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            if (res.data.token) {
                setToken(res.data.token);
                // Spread res.data to include all user fields (points, address, phone, etc.)
                const { token, ...userData } = res.data;
                setUser(userData);
                return res.data;
            }
        } catch (error) {
            console.error('Login error', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Login failed');
        }
        return false;
    };

    const register = async (name, email, password) => {
        try {
            const res = await api.post('/auth/register', { name, email, password });
            if (res.data.token) {
                setToken(res.data.token);
                // Spread res.data to include all user fields
                const { token, ...userData } = res.data;
                setUser(userData);
                return res.data;
            }
        } catch (error) {
            console.error('Registration error', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
        return false;
    };

    const logout = () => {
        setToken('');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
