import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavItem.scss';

const NavItem = ({ to, icon, children }) => (
  <li>
    <NavLink to={to} className={({ isActive }) => `button sidebar-nav-item ${isActive ? 'sidebar-nav-item--active' : ''}`}>
      {icon}
      <span>{children}</span>
    </NavLink>
  </li>
);

export default NavItem;