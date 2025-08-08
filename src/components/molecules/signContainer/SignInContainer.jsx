import Container from "../../atoms/container/Container";
import SignInForm from "../forms/SignInForm";
import QRContainer from "../forms/QRContainer";
import "./SignContainer.scss"


const SignInContainer = () => {
  return (
    <Container row itemsCenter className="max-w-10xl mx-auto px-4 flex-1 sign-container" style={{ minHeight: '100vh' }}>
      <QRContainer className="flex-1" />
      <div className="flex flex-col items-end w-full flex-1">
        <SignInForm />
      </div>
    </Container>
  );
};

export default SignInContainer;