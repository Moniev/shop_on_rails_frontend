import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useUserStore } from '../../../store/UserStore';
import Hamburger from '../navbar/Hamburger';
import './_Dashboard.scss'; 
import { FaUsers, FaBox } from 'react-icons/fa';
import { MdPayments, MdLocalShipping } from "react-icons/md";
import NavItem from '../../atoms/navItem/NavItem';


const InternalDashboard = () => {
  const position = 'left'; 
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
              <span className="truncate">This is your {currentUser.role}'s panel!<p>Manage carefully!</p></span>
            </div>
          )}
          <ul className="dashboard-sidebar__nav-list">
            <NavItem to="/internal/users" icon={<FaUsers />}>User</NavItem>
            <NavItem to="/internal/products" icon={<FaBox />}>Products</NavItem>
            <NavItem to="/internal/orders" icon={<MdLocalShipping />}>Orders</NavItem>
            <NavItem to="/internal/payments" icon={<MdPayments />}>Payments</NavItem>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default InternalDashboard;