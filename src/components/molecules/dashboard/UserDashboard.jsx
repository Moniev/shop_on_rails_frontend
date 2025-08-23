import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../../store/UserStore';
import Hamburger from '../navbar/Hamburger';
import './_Dashboard.scss'; 
import { FaUserCircle, FaBoxOpen, FaCog, FaSignOutAlt } from 'react-icons/fa';
import NavItem from '../../atoms/navItem/NavItem';

const UserDashboard = () => {
  const position = 'right'; 
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const currentUser = useUserStore((state) => state.currentUser);
  const logout = useUserStore((state) => state.logout);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    navigate('/');
  };

  const toggleClasses = `dashboard-sidebar-toggle dashboard-sidebar-toggle--${position}`;
  const sidebarClasses = `dashboard-sidebar dashboard-sidebar--${position} ${isOpen ? 'dashboard-sidebar--open' : ''}`;

  return (
    <>
      <div className={toggleClasses}>
        <Hamburger isDropdownOpen={isOpen} setDropdownOpen={setIsOpen} />
      </div>

      <div className={`dashboard-overlay ${isOpen ? 'dashboard-overlay--open' : ''}`} onClick={() => setIsOpen(false)}></div>

      <nav className={sidebarClasses}>
        <div className="dashboard-sidebar__content">
          <div className="dashboard-sidebar__logo">
            <Hamburger isDropdownOpen={isOpen} setDropdownOpen={setIsOpen} />
          </div>
          {currentUser && (
            <div className="dashboard-sidebar__user-info">
              <span className="truncate">Welcome, {currentUser.user_detail?.first_name || currentUser.mail}!</span>
            </div>
          )}
          <ul className="dashboard-sidebar__nav-list">
            <NavItem to="/user" icon={<FaUserCircle />}>Profile</NavItem>
            <NavItem to="/user/orders" icon={<FaBoxOpen />}>My orders</NavItem>
            <NavItem to="/user/orders" icon={<FaBoxOpen />}>Payments</NavItem>
            <NavItem to="/user/settings" icon={<FaCog />}>Settings</NavItem>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default UserDashboard;