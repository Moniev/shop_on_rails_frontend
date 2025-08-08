import Container from "../../atoms/container/Container";
import SignUpForm from "../forms/SignUpForm";
import QRContainer from "../forms/QRContainer";
import "./SignContainer.scss"


const SignUpContainer = () => {
  return (
    <Container row itemsCenter className="max-w-10xl mx-auto px-4 flex-1 sign-container" style={{ minHeight: '100vh' }}>
      <QRContainer className="flex-1" />
      <div className="flex flex-col items-end w-full flex-1">
        <SignUpForm />
      </div>
    </Container>
  );
};

export default SignUpContainer;