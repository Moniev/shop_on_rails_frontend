import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import Button from "../button/Button"; 
import "./FooterRow.scss"

const FooterRow = ({ title, links }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div className="dropdown-section">
            <Button 
                variant="dropdown" 
                onClick={() => setIsOpen(!isOpen)}
            >
                {title}
            </Button>
            <div className={`dropdown-content-row ${isOpen ? 'open' : ''}`}>
                {links.map((link, index) => (
                    <Link key={index} to={link.href}>
                        {link.text}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default FooterRow;