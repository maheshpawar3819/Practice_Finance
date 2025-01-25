import React from "react";
import "./App.css";
import LoginForm from "./components/LoginForm";

const App = () => {
  return (
    <div className="h-screen flex justify-center items-center bg-gray-900">
      <LoginForm />
    </div>
  );
};

export default App;