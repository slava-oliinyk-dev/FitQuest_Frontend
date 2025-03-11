import React, { useState } from 'react';
import "./Sidebar.sass";
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
  logo
} from '../../assets/icons';

function Sidebar({ onSelectPrograms, selectedMenuItemId }) {

  const handleProgramSelect = (id) => {
    onSelectPrograms(id);
  };


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
      label: 'About the App',
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
    },
  ];

  const renderMenuItems = (items) => (
    items.map(item => (
      <li
        key={item.id}
        className={
          `sidebar__menu-item 
          ${selectedMenuItemId === item.id ? 'active' : ''}`
        }
        onClick={() => onSelectPrograms(item.id)}
      >
        <span
          className={`sidebar__icon ${item.iconClass || ''}`}
          style={item.iconStyle}
        >
          <img
            src={selectedMenuItemId === item.id ? item.activeIcon : item.icon}
            alt={`${item.label} Icon`}
          />
        </span>
        <span className="sidebar__text">{item.label}</span>
      </li>
    ))
  );



  return (
    <div className='sidebar'>
      <div className='sidebar__app-name'><img src={logo} alt="" /></div>

      <div className='sidebar__section'>
        <div className="sidebar__section-title">WORKSPACE</div>
        <ul className="sidebar__menu">
          {renderMenuItems(workspaceMenuItems)}
        </ul>

        <div className="sidebar__section-title">CONTROL PANEL</div>
        <ul className="sidebar__menu">
          {renderMenuItems(controlPanelMenuItems)}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
