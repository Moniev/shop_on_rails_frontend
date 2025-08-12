import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/organisms/layout/Layout";
import Home from "./components/pages/home/Home";
import "./App.scss";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;