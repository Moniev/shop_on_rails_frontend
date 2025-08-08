import { Link } from "react-router-dom";
import "./Logo.scss";

const Logo = ({ full = false }) => {
  return (
    <Link to="/" className="logo">
      <img src="icons/logo.svg" width={50} />
      {full && (
        <span>
          
        </span>
      )}
    </Link>
  );
};

export default Logo;