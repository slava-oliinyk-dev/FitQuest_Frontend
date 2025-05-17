import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../AuthForm/AuthForm';

function Login() {
	const navigate = useNavigate();

	const goToRegister = () => {
		navigate('/register');
	};

	return <AuthForm mode="login" onSwitchMode={goToRegister} />;
}

export default Login;
