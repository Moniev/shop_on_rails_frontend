import "./Button.scss";

const Button = ({ children, variant, onClick }) => {
  return (
    <button onClick={onClick} className={`button ${variant}`}>
      {children}
    </button>
  );
};

export default Button;