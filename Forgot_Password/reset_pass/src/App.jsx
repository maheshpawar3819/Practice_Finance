import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";
import AddUser from "./Components/Adduser";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AddUser />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
