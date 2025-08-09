import { Link } from "react-router-dom";
import logoImage from "../../../assets/logo.png"
import "./Logo.scss";

const Logo = ({ full = false }) => {
  return (
    <Link to="/" className="logo">
      <img src={logoImage} width={170} />
      {full && (
        <span>
          
        </span>
      )}
    </Link>
  );
};

export default Logo;