import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../AuthForm/AuthForm';

function Register() {
	const navigate = useNavigate();

	const goToLogin = () => {
		navigate('/login');
	};

	return <AuthForm mode="register" onSwitchMode={goToLogin} />;
}

export default Register;
