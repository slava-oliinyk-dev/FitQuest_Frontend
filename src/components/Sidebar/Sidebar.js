import React, { useState, useEffect } from 'react';
import { HashLink } from 'react-router-hash-link';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../AuthContext.tsx';
import './Sidebar.sass';
import './SidebarMedia.sass';
import {
	gymIcon,
	exitIcon,
	helpIcon,
	infoIcon,
	homeIcon,
	communityIcon,
	gymOrangeIcon,
	exitOrangeIcon,
	helpOrangeIcon,
	infoOrangeIcon,
	homeOrangeIcon,
	communityOrangeIcon,
	lockIcon,
	lockOrange,
	logo,
} from '../../assets/icons';
import { apiRequest } from '../../api/apiRequest';

function Sidebar({ onSelectPrograms, selectedMenuItemId }) {
	const [isOpen, setIsOpen] = useState(false);
	const { user, setUser, loading } = useAuth();
	const navigate = useNavigate();

	const handleButtonClick = async () => {
		try {
			await apiRequest(`/users/logout`, 'POST', null, { withCredentials: true });
			setUser(null);
			navigate('/');
		} catch (error) {
			console.error('Error logout:', error.message);
		}
	};

	const toggleSidebar = () => setIsOpen((prev) => !prev);

	const handleMenuItemClick = (id) => {
		if (id === 5) {
			navigate('/');
		}
		if (id === 8) {
			navigate('/privacy');
		}
		if (id === 6) {
			navigate('/#about');
		} else {
			onSelectPrograms(id);
		}
		setIsOpen(false);
	};

	useEffect(() => {
		const onResize = () => {
			if (window.innerWidth > 1080 && isOpen) setIsOpen(false);
		};
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, [isOpen]);

	const workspaceMenuItems = [
		{
			id: 1,
			icon: gymIcon,
			activeIcon: gymOrangeIcon,
			label: 'My Workout Programs',
			iconStyle: { width: '1.5625rem', height: '1.5625rem' },
			iconClass: 'sidebar__icon--large',
		},
		{
			id: 2,
			icon: lockIcon,
			activeIcon: lockOrange,
			label: 'Calendar',
		},
		{
			id: 3,
			icon: lockIcon,
			activeIcon: lockOrange,
			label: 'Progress',
			iconStyle: { width: '1.1875rem', height: '1.1875rem' },
		},
		{
			id: 4,
			icon: lockIcon,
			activeIcon: lockOrange,
			label: 'Program Inbox',
			iconStyle: { width: '1.1875rem', height: '1.1875rem' },
		},
	];

	const controlPanelMenuItems = [
		{
			id: 5,
			icon: homeIcon,
			activeIcon: homeOrangeIcon,
			label: 'Home',
		},
		{
			id: 6,
			icon: helpIcon,
			activeIcon: helpOrangeIcon,
			label: (
				<HashLink
					smooth
					to="/#about"
					scroll={(el) => {
						setTimeout(() => {
							el.scrollIntoView({ behavior: 'smooth', block: 'start' });
						}, 50);
					}}
				>
					About the App
				</HashLink>
			),
			iconClass: 'sidebar__icon--medium',
		},
		{
			id: 7,
			icon: communityIcon,
			activeIcon: communityOrangeIcon,
			label: 'Contact & Social',
			iconStyle: { width: '1.4375rem', height: '1.4375rem' },
			iconClass: 'sidebar__icon--large',
		},
		{
			id: 8,
			icon: infoIcon,
			activeIcon: infoOrangeIcon,
			label: 'Privacy & Legal',
		},
		{
			id: 9,
			icon: exitIcon,
			activeIcon: exitOrangeIcon,
			label: 'Log Out',
			iconStyle: { width: '1.25rem', height: '1.25rem' },
			iconClass: 'sidebar__icon--medium',
			onClick: handleButtonClick,
		},
	];

	const renderMenuItems = (items) =>
		items.map((item) => (
			<li
				key={item.id}
				className={`sidebar__menu-item 
          ${selectedMenuItemId === item.id ? 'active' : ''}`}
				onClick={() => {
					if (item.onClick) {
						item.onClick();
					} else {
						handleMenuItemClick(item.id);
					}
				}}
			>
				<span className={`sidebar__icon ${item.iconClass || ''}`} style={item.iconStyle}>
					<img src={selectedMenuItemId === item.id ? item.activeIcon : item.icon} alt={`${item.label} Icon`} />
				</span>
				<span className="sidebar__text">{item.label}</span>
			</li>
		));

	return (
		<>
			<div className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
				{!isOpen ? (
					<button className="sidebar__burger" onClick={toggleSidebar} aria-label="Open sidebar">
						<FaBars size={24} />
					</button>
				) : (
					<button className="sidebar__close" onClick={toggleSidebar} aria-label="Close sidebar">
						<FaTimes size={24} />
					</button>
				)}
				<div className="sidebar__app-name">
					<img src={logo} alt="" />
				</div>
				<div className="sidebar__section">
					<div className="sidebar__section-title">WORKSPACE</div>
					<ul className="sidebar__menu">{renderMenuItems(workspaceMenuItems)}</ul>

					<div className="sidebar__section-title">CONTROL PANEL</div>
					<ul className="sidebar__menu">{renderMenuItems(controlPanelMenuItems)}</ul>
				</div>
			</div>
			{isOpen && <div className="sidebar__overlay" onClick={toggleSidebar} />}
		</>
	);
}

export default Sidebar;
