import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
import Button from "../button/Button"; 
import "./FooterColumn.scss";

const FooterColumn = ({ title, links }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div className="dropdown-section-col">
            <Button 
                variant="dropdown" 
                onClick={() => setIsOpen(!isOpen)}
            >
                {title}
                <FaChevronDown className={`chevron-icon ${isOpen ? "open" : ""}`} />
            </Button>
            <div className={`dropdown-content-col ${isOpen ? "open" : ""}`}>
                {links.map((link, index) => (
                    <Link key={index} to={link.href}>
                        {link.text}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default FooterColumn;