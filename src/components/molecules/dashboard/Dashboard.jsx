import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../../store/UserStore'; 
import { IoSettingsSharp } from "react-icons/io5";
import { FaHome, FaUser } from "react-icons/fa";
import { FaBuilding } from "react-icons/fa6";
import { LuWorkflow } from "react-icons/lu";
import { MdPayments } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";
import { MdLogout } from "react-icons/md";
import Button from '../../atoms/button/Button';
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
            <li>
              <Button
                variant="sidebar-nav-item" 
                onClick={() => handleNavLinkClick('/home')}
              >
                <FaHome className="text-cyan-700" />   
                <a>Home</a>
              </Button>
            </li>
            <li>
              <Button
                variant="sidebar-nav-item"
                onClick={() => handleNavLinkClick('/workflows')} 
              >
                <LuWorkflow className="text-cyan-700"/> 
                <a>Workflows</a>
              </Button>
            </li>
            <li>
              <Button
                variant="sidebar-nav-item"
                onClick={() => handleNavLinkClick('/organizations')} 
              >
                <FaBuilding className="text-cyan-700" />   
                <a>Organizations</a>
              </Button>
            </li>
            <li>
              <Button
                variant="sidebar-nav-item"
                onClick={() => handleNavLinkClick('/teams')} 
              >
                <RiTeamFill className="text-cyan-700"/>   
                <a>Teams</a>
              </Button>
            </li>
            <li>
              <Button
                variant="sidebar-nav-item"
                onClick={() => handleNavLinkClick('/profile')}
              >
                <FaUser className="text-cyan-700"/> 
                <a>Profile</a>
              </Button>
            </li>
            <li>
              <Button
                variant="sidebar-nav-item"
                onClick={() => handleNavLinkClick('/settings')}
              >
                <IoSettingsSharp className="text-cyan-700"/>   
                <a>Settings</a>
              </Button>
            </li>
            <li>
              <Button
                variant="sidebar-nav-item"
                onClick={() => handleNavLinkClick('/subscriptions')} 
              >
                <MdPayments className="text-cyan-700"/>   
                <a>Subscriptions</a>
              </Button>
            </li>
          </ul>

          <div className="dashboard-sidebar__logout-button-container">
            <Button
              onClick={handleLogout}
              variant="secondary md"
              className="w-full text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
            >
              Sign out
            </Button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Dashboard;