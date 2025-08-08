import { useState } from "react";
import FooterRow from "../../atoms/footerRow/FooterRow";
import FooterColumn from "../../atoms/footerColumn/FooterColumn";
import FooterContainer from "../../atoms/footerContainer/FooterContainer";
import Button from "../../atoms/button/Button";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok, FaChevronDown } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import "./Footer.scss";

const Footer = () => {
  const [menuState, setMenuState] = useState({
    products: false,
    clients: false,
    materials: false,
    rules: false,
    language: false,
  });

  const toggleMenu = (key) => setMenuState((prev) => ({ ...prev, [key]: !prev[key] }));

  const languages = [
    { code: "pl", label: "Polski" },
    { code: "en", label: "English" },
    { code: "de", label: "Deutsch" },
    { code: "es", label: "Español" },
    { code: "fr", label: "Français" },
    { code: "it", label: "Italiano" },
    { code: "ru", label: "Русский" },
    { code: "zh", label: "中文" },
  ];

  return (
    <footer className="footer-wrapper">
      <div className="footer-content-container">
    <div className="footer bg-white z-10">
      <FooterContainer
        leftContent={
          <>
            <FooterRow title="Language" links={[{}]} />
            <Button
              variant="language-choice"
              onClick={() => toggleMenu("language")}
            >
              <span>English</span>
              <FaChevronDown />
            </Button>
            {menuState.language && (
              <div className="language-menu">
                {languages.map(({ code, label }) => (
                  <span
                    key={code}
                    className="language-option"
                    onClick={() => toggleMenu("language")}
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
            <FooterRow
              title="Community"
              links={[
                { href: "/", text: <FaXTwitter /> },
                { href: "/", text: <FaInstagram /> },
                { href: "/", text: <FaFacebook /> },
                { href: "/", text: <FaYoutube /> },
                { href: "/", text: <FaTiktok /> },
              ]}
            />
          </>
        }
        rightContent={
          <>
            <FooterColumn
              title="Product"
              isOpen={menuState.products}
              onToggle={() => toggleMenu("products")}
              links={[
                { href: "/functions", text: "Features" },
                { href: "/integrations", text: "Integrations" },
                { href: "/mobile", text: "Mobile App" },
                { href: "/price-list", text: "Pricing" },
              ]}
            />
            <FooterColumn
              title="Clients"
              isOpen={menuState.clients}
              onToggle={() => toggleMenu("clients")}
              links={[
                { href: "/products", text: "Case Studies" },
                { href: "/client-about-us", text: "What Clients Say" },
                { href: "/reviews", text: "Reviews" },
              ]}
            />
            <FooterColumn
              title="Resources"
              isOpen={menuState.materials}
              onToggle={() => toggleMenu("materials")}
              links={[
                { href: "/recommendations", text: "Recommendation System" },
                { href: "/security", text: "Security" },
                { href: "/crm", text: "CRM" },
                { href: "/recruitment", text: "Recruitment" },
                { href: "/sales", text: "Sales" },
                { href: "/blog", text: "Blog" },
                { href: "/help-desk", text: "Help Center" },
              ]}
            />
            <FooterColumn
              title="Policies"
              isOpen={menuState.rules}
              onToggle={() => toggleMenu("rules")}
              links={[
                { href: "/products", text: "Terms" },
                { href: "/privacy", text: "Privacy" },
                { href: "/cookies-policy", text: "Cookie Settings" },
                { href: "/licenses", text: "Licenses" },
                { href: "/information", text: "Company Information" },
              ]}
            />
          </>
        }
      />
        </div>
      </div>
    </footer>
  );
};

export default Footer;