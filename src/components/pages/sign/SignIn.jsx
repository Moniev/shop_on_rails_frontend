import Container from "../../atoms/container/Container";
import Footer from "../../molecules/footer/Footer";
import SignInContainer from "../../molecules/signContainer/SignInContainer";


const Sign = () => {
  return (
    <Container className="flex flex-col gap-16 items-center">
      <SignInContainer />
    </Container>
  );
};

export default Sign;