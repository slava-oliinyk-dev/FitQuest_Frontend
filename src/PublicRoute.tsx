import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext.tsx';

const PublicRoute = () => {
	const { user, loading } = useAuth();

	if (loading) {
		return <div>Loading...</div>;
	}

	return user ? <Navigate to="/app" /> : <Outlet />;
};

export default PublicRoute;
