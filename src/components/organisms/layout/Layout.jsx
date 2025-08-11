import { useState } from "react";
import { Outlet } from "react-router-dom";
import Container from "../../atoms/container/Container";
import Navbar from "../../molecules/navbar/Navbar";
import { ToastContainer } from 'react-toastify';
import Dashboard from "../../molecules/dashboard/Dashboard";
import Footer from "../../molecules/footer/Footer";
import { useUserStore } from "../../../store/UserStore"; 
import SignInContainer from "../../molecules/formContainers/SignInContainer"; 
import SignUpContainer from "../../molecules/formContainers/SignUpContainer"; 
import ResetPasswordContainer from "../../molecules/formContainers/ResetPasswordContainer"; 
import Modal from "../../atoms/modal/Modal"; 
import { useModalStore } from "../../../store/ModalStore";
import "./Layout.scss";


const Layout = () => {
  const { user } = useUserStore();
  const { isOpen, content, closeModal } = useModalStore();

  return (
    <div className="layout-wrapper">
      <Navbar />
      <>
        { user != null ? <Dashboard /> : <></>}
      </>
      <div className="main-content-wrapper">
        <Container className="pt-32 px-4">
          <ToastContainer />
          <Outlet />
        </Container>
        <Footer />
      </div>
      <Modal isOpen={isOpen} onClose={closeModal}>
        {content === 'signIn' && <SignInContainer />}
        {content === 'signUp' && <SignUpContainer />}
        {content === 'resetPassword' && <ResetPasswordContainer />}
      </Modal>
    </div>
  );
};

export default Layout;