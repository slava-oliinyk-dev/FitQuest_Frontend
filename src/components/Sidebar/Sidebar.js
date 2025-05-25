import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth'; // ← вот это
import { auth } from '../../firebaseConfig.tsx';
import { HashLink } from 'react-router-hash-link';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../AuthContext.tsx';
import { IoBarbellSharp } from 'react-icons/io5';
import { AiFillHome } from 'react-icons/ai';
import { IoIosLock } from 'react-icons/io';
import { AiFillQuestionCircle } from 'react-icons/ai';
import { IoPeopleCircleOutline } from 'react-icons/io5';
import { IoInformationCircle } from 'react-icons/io5';
import { TbLogout } from 'react-icons/tb';
import './Sidebar.sass';
import './SidebarMedia.sass';
import { logo } from '../../assets/icons';
import { apiRequest } from '../../api/apiRequest';

function Sidebar({ onSelectPrograms, selectedMenuItemId }) {
	const [isOpen, setIsOpen] = useState(false);
	const { user, setUser, loading } = useAuth();
	const navigate = useNavigate();

	const handleButtonClick = async () => {
		try {
			await signOut(auth);
			await apiRequest(`/users/logout`, 'POST', null, { withCredentials: true });
			setUser(null);
			window.location.replace('/login');
		} catch (error) {
			console.error('Error logout:', error);
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
			icon: <IoBarbellSharp style={{ width: '1.125rem', height: '1.5rem', color: 'white' }} />,
			activeIcon: <IoBarbellSharp style={{ width: '1.125rem', height: '1.5rem', color: '#FF6600' }} />,
			label: 'My Workout Programs',
		},
		{
			id: 2,
			icon: <IoIosLock style={{ width: '1.125rem', height: '1.5rem', color: 'white' }} />,
			activeIcon: <IoIosLock style={{ width: '1.125rem', height: '1.5rem', color: '#FF6600' }} />,
			label: 'Calendar',
		},
		{
			id: 3,
			icon: <IoIosLock style={{ width: '1.125rem', height: '1.5rem', color: 'white' }} />,
			activeIcon: <IoIosLock style={{ width: '1.125rem', height: '1.5rem', color: '#FF6600' }} />,
			label: 'Progress',
		},
		{
			id: 4,
			icon: <IoIosLock style={{ width: '1.125rem', height: '1.5rem', color: 'white' }} />,
			activeIcon: <IoIosLock style={{ width: '1.125rem', height: '1.5rem', color: '#FF6600' }} />,
			label: 'Program Inbox',
		},
	];

	const controlPanelMenuItems = [
		{
			id: 5,
			icon: <AiFillHome style={{ width: '1.125rem', height: '1.5rem', color: 'white' }} />,
			activeIcon: <AiFillHome style={{ width: '1.125rem', height: '1.5rem', color: '#FF6600' }} />,
			label: 'Home',
		},
		{
			id: 6,
			icon: <AiFillQuestionCircle style={{ width: '1.125rem', height: '1.5rem', color: 'white' }} />,
			activeIcon: <AiFillQuestionCircle style={{ width: '1.125rem', height: '1.5rem', color: '#FF6600' }} />,
			label: (
				<HashLink
					smooth
					to="/#about"
					scroll={(el) => {
						setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
					}}
				>
					About the App
				</HashLink>
			),
		},
		{
			id: 7,
			icon: <IoPeopleCircleOutline style={{ width: '1.125rem', height: '1.5rem', color: 'white' }} />,
			activeIcon: <IoPeopleCircleOutline style={{ width: '1.125rem', height: '1.5rem', color: '#FF6600' }} />,
			label: 'Contact & Social',
		},
		{
			id: 8,
			icon: <IoInformationCircle style={{ width: '1.125rem', height: '1.5rem', color: 'white' }} />,
			activeIcon: <IoInformationCircle style={{ width: '1.125rem', height: '1.5rem', color: '#FF6600' }} />,
			label: 'Privacy & Legal',
		},
		{
			id: 9,
			icon: <TbLogout style={{ width: '1.125rem', height: '1.5rem', color: 'white' }} />,
			activeIcon: <TbLogout style={{ width: '1.125rem', height: '1.5rem', color: '#FF6600' }} />,
			label: 'Log Out',
			onClick: handleButtonClick,
		},
	];

	const renderMenuItems = (items) =>
		items.map((item) => {
			const isActive = selectedMenuItemId === item.id;
			const IconComponent = isActive ? item.activeIcon : item.icon;

			return (
				<li key={item.id} className={`sidebar__menu-item ${isActive ? 'active' : ''}`} onClick={() => (item.onClick ? item.onClick() : handleMenuItemClick(item.id))}>
					<span className={`sidebar__icon ${item.iconClass || ''}`} style={item.iconStyle}>
						{IconComponent}
					</span>
					<span className="sidebar__text">{item.label}</span>
				</li>
			);
		});

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
