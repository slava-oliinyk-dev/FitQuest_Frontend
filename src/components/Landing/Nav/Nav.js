import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { apiRequest } from '../../../api/apiRequest.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../AuthContext.tsx';
import './Nav.sass';
import './NavMedia.sass';
import { logo } from '../../../assets/icons';
import { FaBars, FaTimes } from 'react-icons/fa';

function Nav() {
	const navigate = useNavigate();
	const location = useLocation();
	const { user, setUser, loading } = useAuth();
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => setIsOpen((prev) => !prev);

	useEffect(() => {
		const overflow = isOpen ? 'hidden' : '';
		document.body.style.overflow = overflow;
		document.documentElement.style.overflow = overflow;
		return () => {
			document.body.style.overflow = '';
			document.documentElement.style.overflow = '';
		};
	}, [isOpen]);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth > 768 && isOpen) {
				setIsOpen(false);
			}
		};
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, [isOpen]);

	useEffect(() => {
		setIsOpen(false);
	}, [location]);

	const handleButtonClick = async () => {
		if (user) {
			try {
				await apiRequest(`/users/logout`, 'POST', null, { withCredentials: true });
				setUser(null);
				navigate('/');
			} catch (error) {
				console.error('Error logout:', error.message);
			}
		} else {
			navigate('/register');
		}
		setIsOpen(false);
	};

	return (
		<nav className="nav">
			<div className="nav__wrapper">
				<a href="#">
					<HashLink smooth to="/#main-screen">
						<img className="nav__logo" src={logo} alt="logo" />
					</HashLink>
				</a>
				{!isOpen && (
					<button className="nav__burger" onClick={toggleMenu} aria-label="Open menu">
						<FaBars size={24} color="#FFFFFF" />
					</button>
				)}
				{isOpen && (
					<button className="nav__close" onClick={toggleMenu} aria-label="Close menu">
						<FaTimes size={24} color="#000" />
					</button>
				)}
				<ul className={`nav__list ${isOpen ? 'nav__list--open' : ''}`}>
					<li>
						<HashLink smooth to="/#main-screen">
							Home page
						</HashLink>
					</li>
					<li>
						<HashLink smooth to="/#about">
							About the App
						</HashLink>
					</li>
					<li>
						<HashLink smooth to="/#price">
							Pricing
						</HashLink>
					</li>
					<li>
						<HashLink smooth to="/#contact">
							Contact Us
						</HashLink>
					</li>
					<li>
						<HashLink smooth to="/#faq">
							FAQ
						</HashLink>
					</li>
					<li
						onClick={() => {
							navigate('/app');
							toggleMenu();
						}}
					>
						Go to App
					</li>
					<li onClick={toggleMenu}>
						<button className="nav__button--mobile" onClick={handleButtonClick}>
							{loading ? '' : user ? 'Exit' : 'Register'}
						</button>
					</li>
				</ul>
				<button className="nav__button" onClick={handleButtonClick}>
					{loading ? '' : user ? 'Exit' : 'Register'}
				</button>
			</div>
			{isOpen && <div className="nav__overlay" onClick={toggleMenu} />}
		</nav>
	);
}

export default Nav;
