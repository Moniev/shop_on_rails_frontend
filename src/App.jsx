import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/organisms/layout/Layout";
import Home from "./components/pages/home/Home";
import SignIn from "./components/pages/sign/SignIn";
import SignUp from "./components/pages/sign/SignUp";
import "./App.scss";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/sign-in" element={<Layout />}>
          <Route index element={<SignIn />} />
        </Route>
         <Route path="/sign-up" element={<Layout />}>
          <Route index element={<SignUp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;