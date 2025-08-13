import Verify2faForm from "../forms/Verify2faForm";
import "./SignContainer.scss"

const SignUpContainer = () => {
  return (
    <div className="sign-container-wrapper">
      <Verify2faForm />
    </div>
  );
};

export default SignUpContainer;