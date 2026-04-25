import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = () => {
    const { user, token } = useContext(AuthContext);

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Optional: if the user is an admin, you might want them to go to /admin instead
    // But since you banned admins from logging in via /login, this is fine.

    return <Outlet />;
};

export default PrivateRoute;
