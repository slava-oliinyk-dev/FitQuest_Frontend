import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../AuthContext.tsx';
import './AuthForm.sass';
import './AuthFormMedia.sass';
import { apiRequest } from '../../../api/apiRequest';
import Nav from '../../../components/Landing/Nav/Nav';
import Footer from '../../../components/Landing/Footer/Footer';
import { google, facebook } from '../../../assets/icons';
import { useGoogleLogin } from '@react-oauth/google';
import Modal from '../../../components/Modal/Modal.js';

const AuthForm = ({ mode, onSwitchMode }) => {
	const { setUser } = useAuth();
	const navigate = useNavigate();
	const [registerData, setRegisterData] = useState({
		email: '',
		password: '',
		name: '',
		uniqueLogin: '',
	});
	const [loginError, setLoginError] = useState(null);
	const [isChecked, setIsChecked] = useState(false);
	const [checkboxError, setCheckboxError] = useState('');
	const [currentParametersValueReceive, setCurrentParametersValueReceive] = useState('');
	const [errors, setErrors] = useState({});
	const [errorsReceive, setErrorsReceive] = useState('');
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [timer, setTimer] = useState(0);

	const openModal = () => setIsModalVisible(true);
	const closeModal = () => {
		setIsModalVisible(false);
		setCurrentParametersValueReceive('');
		setErrorsReceive('');
	};

	const isRegister = mode === 'register';
	const isLogin = mode === 'login';

	const handleBlur = (e) => {
		const { name, value } = e.target;
		const updatedData = { ...registerData, [name]: value };
		const newErrors = validateRegisterData(updatedData);
		Object.keys(updatedData).forEach((key) => {
			if (!updatedData[key].trim()) {
				newErrors[key] = '';
			}
		});
		setErrors(newErrors);
	};

	const validateEmailReceive = (value) => {
		if (!value.trim()) {
			return 'Enter your email';
		} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
			return 'Invalid email address';
		}
		return '';
	};

	const handleReceiveBlur = () => {
		const errorMessage = validateEmailReceive(currentParametersValueReceive);
		setErrorsReceive(errorMessage);
	};

	const validateRegisterData = (data) => {
		const errors = {};

		if (!data.email) {
			errors.email = 'Enter your email';
		} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)) {
			errors.email = 'Invalid email address';
		}

		if (!data.password) {
			errors.password = 'Enter your password';
		} else if (data.password.length < 8) {
			errors.password = 'Password must be at least 8 characters';
		}

		if (!data.name) {
			errors.name = 'Enter your name';
		} else if (data.name.length < 2) {
			errors.name = 'Name must be at least 2 characters';
		}

		if (!data.uniqueLogin) {
			errors.uniqueLogin = 'Enter your unique username';
		} else if (!/^[a-zA-Z0-9_]+$/.test(data.uniqueLogin)) {
			errors.uniqueLogin = 'Login should contain only letters, numbers, and underscore';
		} else if (data.uniqueLogin.length < 3) {
			errors.uniqueLogin = 'Login must be at least 3 characters';
		}

		return errors;
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setRegisterData((prev) => ({ ...prev, [name]: value }));

		if (value.trim()) {
			setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
		}
		if (loginError) setLoginError(null);
	};

	const handleChangeBox = (event) => {
		setIsChecked(event.target.checked);
	};

	const handleParametersReceive = (e) => {
		setCurrentParametersValueReceive(e.target.value);
		if (errorsReceive) {
			setErrorsReceive('');
		}
	};

	const handleSubmitRegister = async (e) => {
		e.preventDefault();

		const newErrors = validateRegisterData(registerData);
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}
		if (!isChecked) {
			setCheckboxError('Please check the checkbox!');
			return;
		}

		const body = {
			email: registerData.email,
			password: registerData.password,
			name: registerData.name,
			uniqueLogin: registerData.uniqueLogin,
		};
		try {
			const sendLoginData = await apiRequest(`/users/register`, 'POST', body, { withCredentials: true });
			setLoginError(null);
			openModal();
			setRegisterData({
				email: '',
				password: '',
				name: '',
				uniqueLogin: '',
			});
		} catch (error) {
			setLoginError('Invalid login or password');
			setRegisterData({
				email: '',
				password: '',
				name: '',
				uniqueLogin: '',
			});
		}
	};

	const handleSubmitLogin = async (e) => {
		e.preventDefault();

		let newErrors = {};

		if (!registerData.email) {
			newErrors.email = 'Enter your email';
		}
		if (!registerData.password) {
			newErrors.password = 'Enter your password';
		}
		if (Object.keys(newErrors).length > 0) {
			setLoginError(null);
			setErrors(newErrors);
			return;
		}

		const body = {
			email: registerData.email,
			password: registerData.password,
		};
		try {
			const sendLoginData = await apiRequest(`/users/login`, 'POST', body, { withCredentials: true });
			const userResponse = await apiRequest(`/users/me`, 'GET', null, { withCredentials: true });
			if (userResponse && userResponse.user) {
				setLoginError(null);
				setUser(userResponse.user);
				navigate('/app');
			}
		} catch (error) {
			const serverMessage = error?.response?.data?.err || error?.response?.data?.message || error.message || 'An error occurred';

			setLoginError(serverMessage);
			setRegisterData({
				email: '',
				password: '',
				name: '',
				uniqueLogin: '',
			});
		}
	};

	const login = useGoogleLogin({
		onSuccess: async (credentialResponse) => {
			try {
				await apiRequest(`/users/google`, 'POST', credentialResponse, { withCredentials: true });
				const userResponse = await apiRequest(`/users/me`, 'GET', null, { withCredentials: true });

				if (userResponse && userResponse.user) {
					setUser(userResponse.user);
					navigate('/app');
				}
			} catch (error) {
				setLoginError('Google Authorization Error');
			}
		},
		onError: () => {
			setLoginError('Google Authorization Error');
		},
	});

	const handleFormSubmit = async (e) => {
		e.preventDefault();
		if (isRegister) {
			await handleSubmitRegister(e);
		} else {
			try {
				await handleSubmitLogin(e);
			} catch (error) {
				console.error('Error while logging in:', error.message);
			}
		}
	};

	const resendEmail = async () => {
		const errorMessage = validateEmailReceive(currentParametersValueReceive);
		if (errorMessage) {
			setErrorsReceive(errorMessage);
			return;
		}

		setTimer(59);
		const emailParam = { email: currentParametersValueReceive };
		try {
			await apiRequest(`/users/re-email`, 'POST', emailParam, { withCredentials: true });
			setCurrentParametersValueReceive('');
			setErrorsReceive('');
		} catch (error) {
			const serverMessage = error?.response?.data?.err || error?.response?.data?.message || error.message || 'An error occurred';

			setErrorsReceive(serverMessage);
		}
	};

	useEffect(() => {
		let intervalId = null;
		if (timer > 0) {
			intervalId = setInterval(() => {
				setTimer((prevTimer) => prevTimer - 1);
			}, 1000);
		}
		return () => {
			if (intervalId) clearInterval(intervalId);
		};
	}, [timer]);

	return (
		<div className="auth-form">
			<Nav />
			<div className="auth-form__content">
				<div className="auth-form__wrapper">
					<form className="auth-form__signup" onSubmit={handleFormSubmit} noValidate>
						<h3 className="auth-form__signup-title">{isRegister ? 'Sign Up' : 'Sign In'}</h3>
						<div className="auth-form__signup-icons">
							<img src={google} className="auth-form__register__icon" alt="Google Icon" onClick={login} />
						</div>
						<span className="auth-form__signup-subtitle">or use your account</span>

						<div className="auth-form__inputs">
							<input
								className={`auth-form__input ${errors.email ? 'error-class' : ''}`}
								type="email"
								placeholder="Enter your email"
								name="email"
								value={registerData.email}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
							{errors.email && <span className="error-message">{errors.email}</span>}
							<input
								className={`auth-form__input ${errors.password ? 'error-class' : ''}`}
								type="password"
								placeholder="Enter your password"
								name="password"
								value={registerData.password}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
							{errors.password && <span className="error-message">{errors.password}</span>}
							{isRegister && (
								<div className="auth-form__input-register">
									<input
										className={`auth-form__input ${errors.name ? 'error-class' : ''}`}
										type="text"
										placeholder="Enter your name"
										name="name"
										value={registerData.name}
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									{errors.name && <span className="error-message">{errors.name}</span>}
									<input
										className={`auth-form__input ${errors.uniqueLogin ? 'error-class' : ''}`}
										type="text"
										placeholder="Enter your unique username"
										name="uniqueLogin"
										value={registerData.uniqueLogin}
										onChange={handleChange}
										onBlur={handleBlur}
									/>
									{errors.uniqueLogin && <span className="error-message">{errors.uniqueLogin}</span>}
								</div>
							)}
						</div>
						{loginError && <div className="auth-form__invalid-data">{loginError}</div>}
						{isRegister && (
							<div>
								<div className="auth-form__policy">
									<input className="auth-form__checkbox" type="checkbox" id="policy" checked={isChecked} onChange={handleChangeBox} />
									<label htmlFor="policy" className="auth-form__checkmark">
										I agree to the Terms of Service and Privacy Policy
									</label>
								</div>
								{checkboxError && <span className="auth-form__checkmark-error">{checkboxError}</span>}
							</div>
						)}
						<button type="submit" className="auth-form__btn">
							{isRegister ? 'Register' : 'Login'}
						</button>
					</form>

					<div className="auth-form__signin">
						<h2 className="auth-form__signin-title">{isRegister ? 'Already have an account?' : "Don't have an account?"}</h2>
						<span className="auth-form__signin-subtitle">{isRegister ? 'Sign in to continue your fitness journey with us.' : 'Sign up and start your fitness journey today.'}</span>

						<Modal className="modal__register" isVisible={isModalVisible} onClose={closeModal}>
							<div className="modal__register-content">
								<h2 className="modal__register-title">Thank You for Signing Up!</h2>
								<p className="modal__register-subtitle">We've sent a confirmation email to your inbox. Please check your email and click on the verification link to complete your registration.</p>
								<h2 className="modal__register-title-receive">Didn't receive the letter?</h2>
								<form className="modal__register-form" onSubmit={resendFormSubmit} noValidate>
									<input
										className="modal__register-input"
										type="email"
										value={currentParametersValueReceive}
										placeholder="Enter your email"
										onChange={handleParametersReceive}
										onBlur={handleReceiveBlur}
									/>
									{errorsReceive && <div className="modal__register-error">{errorsReceive}</div>}
									<button type="submit" className={timer > 0 ? `modal__register-button-disable` : `modal__register-button`} disabled={timer > 0}>
										{timer > 0 ? `Resend the letter (${timer})` : 'Resend the letter'}
									</button>
								</form>
							</div>
						</Modal>
						<button className="auth-form__signin-btn" onClick={onSwitchMode}>
							{isRegister ? 'Sign In' : 'Register'}
						</button>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default AuthForm;
