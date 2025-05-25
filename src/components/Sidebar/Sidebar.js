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
			icon: <IoBarbellSharp className="sidebar-icons" />,
			activeIcon: <IoBarbellSharp className="sidebar-icons__active" />,
			label: 'My Workout Programs',
		},
		{
			id: 2,
			icon: <IoIosLock className="sidebar-icons" />,
			activeIcon: <IoIosLock className="sidebar-icons__active" />,
			label: 'Calendar',
		},
		{
			id: 3,
			icon: <IoIosLock className="sidebar-icons" />,
			activeIcon: <IoIosLock className="sidebar-icons__active" />,
			label: 'Progress',
		},
		{
			id: 4,
			icon: <IoIosLock className="sidebar-icons" />,
			activeIcon: <IoIosLock className="sidebar-icons__active" />,
			label: 'Program Inbox',
		},
	];

	const controlPanelMenuItems = [
		{
			id: 5,
			icon: <AiFillHome className="sidebar-icons" />,
			activeIcon: <AiFillHome className="sidebar-icons__active" />,
			label: 'Home',
		},
		{
			id: 6,
			icon: <AiFillQuestionCircle className="sidebar-icons" />,
			activeIcon: <AiFillQuestionCircle className="sidebar-icons__active" />,
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
			icon: <IoPeopleCircleOutline className="sidebar-icons" />,
			activeIcon: <IoPeopleCircleOutline className="sidebar-icons__active" />,
			label: 'Contact & Social',
		},
		{
			id: 8,
			icon: <IoInformationCircle className="sidebar-icons" />,
			activeIcon: <IoInformationCircle className="sidebar-icons__active" />,
			label: 'Privacy & Legal',
		},
		{
			id: 9,
			icon: <TbLogout className="sidebar-icons" />,
			activeIcon: <TbLogout className="sidebar-icons__active" />,
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
