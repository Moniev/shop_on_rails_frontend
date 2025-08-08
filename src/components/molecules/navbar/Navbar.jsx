import Hamburger from "./Hamburger";
import Logo from "../../atoms/logo/Logo";
import Button from "../../atoms/button/Button";
import Container from "../../atoms/container/Container";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCode, FaList, FaRocket, FaChalkboardTeacher, FaBook, FaUserPlus, FaSignInAlt } from "react-icons/fa";
import "./Navbar.scss";

const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  const navLinks = [
    { text: "Sandbox", href: "/sandbox", icon: <FaCode /> },
    { text: "Offer", href: "/offer", icon: <FaList /> },
    { text: "Deployment", href: "/insight", icon: <FaRocket /> },
    { text: "Training", href: "/training", icon: <FaChalkboardTeacher /> },
    { text: "Docs", href: "/training", icon: <FaBook /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 0) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  return (
    <nav
      className={`
        navbar 
        fixed
        left-0 
        right-0 
        start-0 
        top-0 
        z-10 
        px-4
        py-2
        transition-transform
        duration-300
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
      `}
    >
      <div className="navbar-brand flex">
        <Logo full />
      </div>
      <div className="lg:hidden">
        <div className={`navbar-toggle ${isDropdownOpen ? "open" : ""}`}>
          <Hamburger
            isDropdownOpen={isDropdownOpen}
            setDropdownOpen={setDropdownOpen}
          />
        </div>
        {isDropdownOpen && (
          <div
            className={`small-menu absolute left-0 top-full z-20 w-full rounded-b-3xl bg-white drop-shadow-xl px-6 py-4 ${
              isDropdownOpen ? "slide-down" : "small-menu"
            }`}
          >
            <div className="grid text-end items-end justify-end">
              {navLinks?.map((link, index) => (
                <Link to={link.href} key={index}>
                  <div
                    className={`nav-item navhover text-right text-3xl font-extrabold text-blue-600 flex items-center justify-end ${
                      index === navLinks.length - 1 ? "lg:mr-8" : ""
                    }`}
                  >
                    {link.icon}
                    <span className="ml-2">{link.text}</span>
                  </div>
                </Link>
              ))}
              <Container>
                <Button
                  onClick={() => navigate("/register")}
                  variant="secondary md"
                  className="flex items-center justify-center"
                >
                  <FaUserPlus className="mr-2 text-xl" />
                  Sign up
                </Button>
                <Button
                  onClick={() => navigate("/login")}
                  variant="primary md"
                  className="flex items-center justify-center"
                >
                  <FaSignInAlt className="mr-2 text-xl" />
                  Sign in
                </Button>
              </Container>
            </div>
          </div>
        )}
      </div>
      <div className="hidden items-center align-middle lg:flex lg:space-x-5">
        {navLinks.map((link, index) => (
          <Link to={link.href} key={index}>
            <div className="nav-item navhover font-bold text-blue-600 flex items-center">
              {link.icon}
              <span className="ml-2">{link.text}</span>
            </div>
          </Link>
        ))}
        <div className="h-20 border border-cyan-900" />
        <Button
          onClick={() => navigate("/sign-up")}
          variant="secondary md"
          className="flex items-center justify-center"
        >
          <FaUserPlus className="mr-2 text-lg" />
          Sign up
        </Button>
        <Button
          onClick={() => navigate("/sign-in")}
          variant="primary md"
          className="flex items-center justify-center"
        >
          <FaSignInAlt className="mr-2 text-lg" />
          Sign in
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;