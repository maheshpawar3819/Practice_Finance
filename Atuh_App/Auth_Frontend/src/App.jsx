import React, { useState } from "react";
import UserList from "./Components/UserList";
import CreateUser from "./Components/CreateUser";

function App() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/auth/google";
  };

  const handleLinkedInLogin = () => {
    window.location.href = "http://localhost:8080/auth/linkedin";
  };
  return (
    <div className="flex flex-col items-center bg-gray-100 p-8 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold mb-4">Login with OAuth</h2>
    <button 
      onClick={handleGoogleLogin} 
      className="bg-red-500 text-white py-2 px-4 rounded mb-4 hover:bg-red-600 transition duration-200"
    >
      Login with Google
    </button>
    <button 
      onClick={handleLinkedInLogin} 
      className="bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800 transition duration-200"
    >
      Login with LinkedIn
    </button>
    <UserList/>
    {/* <CreateUser/> */}
  </div>
  );
}

export default App;
