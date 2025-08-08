import { Outlet } from "react-router-dom";
import Container from "../../atoms/container/Container";
import Navbar from "../../molecules/navbar/Navbar";
import { ToastContainer } from 'react-toastify';
import Dashboard from "../../molecules/dashboard/Dashboard";
import Footer from "../../molecules/footer/Footer";
import { useUserStore } from "../../../store/UserStore"; 
import "./Layout.scss";


const Layout = () => {
  const { user } = useUserStore();

  return (
    <div className="layout-wrapper">
      <Dashboard />
      <div className="main-content-wrapper">
        <Container className="pt-32 px-4">
          <ToastContainer />
          <Outlet />
        </Container>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;