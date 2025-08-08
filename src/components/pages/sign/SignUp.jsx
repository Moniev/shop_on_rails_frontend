import Container from "../../atoms/container/Container";
import Footer from "../../molecules/footer/Footer";
import SignUpContainer from "../../molecules/signContainer/SignUpContainer";

const SignUp = () => {
  return (
    <Container className="flex flex-col gap-16 items-center">
      <SignUpContainer />
      <Footer />
    </Container>
  );
};

export default SignUp;