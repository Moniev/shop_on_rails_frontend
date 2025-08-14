import Hamburger from "./Hamburger";
import Logo from "../../atoms/logo/Logo";
import Button from "../../atoms/button/Button";
import Container from "../../atoms/container/Container";
import { useUserStore } from "../../../store/UserStore"; 
import { useAuthStore } from "../../../store/AuthStore"; 
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSignInAlt, FaUserPlus, FaUserCircle, FaSignOutAlt } from "react-icons/fa"; 
import { useModalStore } from "../../../store/ModalStore";
import { toast } from 'react-toastify'; 
import "./Navbar.scss";

const Navbar = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  const logout = useAuthStore((state) => state.logout);
  const { openModal } = useModalStore();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navLinks = [
    { text: "About", href: "/about" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 0) setIsVisible(true);
      else if (currentScrollY > lastScrollY) setIsVisible(false);
      else setIsVisible(true);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false); 
    toast.success("You have been successfully logged out.");
  };

  const navbarClassName = `navbar ${!isVisible ? "navbar--hidden" : ""}`;

  const UserActions = () => (
    <>
      <Button onClick={handleLogout} variant="submit md">
        <FaSignOutAlt className="mr-2"/>
        <span>Log Out</span>
      </Button>
    </>
  );

  const GuestActions = () => (
     <>
        <Button onClick={() => openModal('signUp')} variant="submit md">
          <FaUserPlus className="mr-2"/>
          <span>Sign Up</span>
        </Button>
        <Button onClick={() => openModal('signIn')} variant="submit md">
          <FaSignInAlt className="mr-2"/>
          <span>Sign In</span>
        </Button>
     </>
  );


  return (
    <nav className={navbarClassName}>
      <div className="navbar__brand">
        <Logo full />
      </div>

      <div className="navbar__mobile-menu">
        <Hamburger isDropdownOpen={isDropdownOpen} setDropdownOpen={setDropdownOpen} />
        {isDropdownOpen && (
          <div className="navbar__dropdown">
            <div className="navbar__dropdown-grid">
              {navLinks?.map((link, index) => (
                <Link to={link.href} key={index} onClick={() => setDropdownOpen(false)}>
                  <div className="nav-item nav-item--mobile">{link.text}</div>
                </Link>
              ))}
              <Container>
                {currentUser ? <UserActions /> : <GuestActions />}
              </Container>
            </div>
          </div>
        )}
      </div>

      <div className="navbar__desktop-menu">
        {navLinks.map((link, index) => (
          <Link to={link.href} key={index}>
            <div className="nav-item nav-item--desktop"><span>{link.text}</span></div>
          </Link>
        ))}
        <div className="navbar__divider" />
        {currentUser ? <UserActions /> : <GuestActions />}
      </div>
    </nav>
  );
};

export default Navbar;