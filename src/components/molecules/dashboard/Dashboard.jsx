import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../../store/UserStore'; 
import Hamburger from '../navbar/Hamburger';
import './Dashboard.scss'; 

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, clearUser } = useUserStore();
  const [isOpen, setIsOpen] = useState(false); 

  const handleLogout = () => {
    clearUser();
    navigate('/sign-in');
    setIsOpen(false); 
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleNavLinkClick = (path) => {
    navigate(path);
    setIsOpen(false); 
  };

  return (
    <>
      <div className="dashboard-sidebar-toggle"> 
        <Hamburger
          isDropdownOpen={isOpen}
          setDropdownOpen={setIsOpen}
        />
      </div>

      {isOpen && (
        <div
          className="dashboard-overlay"
          onClick={toggleSidebar}
          id="sidebar-overlay"
        ></div>
      )}

      <nav
        className={`dashboard-sidebar ${isOpen ? 'dashboard-sidebar--open' : ''}`}
      >
        <div className="dashboard-sidebar__content">
          <div className="dashboard-sidebar__logo">
            <div className="dashboard-sidebar__close-button-wrapper">
              <Hamburger
                isDropdownOpen={isOpen}
                setDropdownOpen={setIsOpen}
              />
            </div>
          </div>

          {user && (
            <div className="dashboard-sidebar__user-info">
              <span className="truncate">Welcome, {user.mail || 'Użytkowniku'}!</span>
            </div>
          )}

          <ul className="dashboard-sidebar__nav-list">
          
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Dashboard;
