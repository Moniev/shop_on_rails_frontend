import Hamburger from "./Hamburger";
import Logo from "../../atoms/logo/Logo";
import Button from "../../atoms/button/Button";
import Container from "../../atoms/container/Container";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import {  FaSearch, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { useModalStore } from "../../../store/ModalStore";
import "./Navbar.scss";


const Navbar = ({ onSignInClick, onSignUpClick }) => {
  const { openModal } = useModalStore();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navLinks = [
    { text: "About", href: "/about"  },
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

  const navbarClassName = `navbar ${!isVisible ? "navbar--hidden" : ""}`;

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
                <Link to={link.href} key={index}>
                  <div className="nav-item nav-item--mobile">{link.text}</div>
                </Link>
              ))}
              <Container>
                <Button onClick={onSignUpClick} variant="secondary md">
                  <FaUserPlus className="mr-2 text-xl" />
                </Button>
                <Button onClick={onSignInClick} variant="primary md">
                  <FaSignInAlt className="mr-2 text-xl" />
                </Button>
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
        <Button onClick={() => openModal('signIn')} variant="submit md">
          <FaUserPlus className="mr-2"/>
          <span></span>
        </Button>
        <Button onClick={() => openModal('signUp')} variant="submit md">
          <FaSignInAlt className="mr-2"/>
          <span></span>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;