import React, { useState } from "react";
import axios from "axios";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });
      alert("Login Successful");
      console.log(response.data);
    } catch (error) {
      alert("Login Failed");
    }
  };

  return (
    <form
      className="bg-gray-800 p-6 rounded-lg shadow-md w-96"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl text-center text-orange-500 mb-4">Login</h1>
      <div className="mb-4">
        <label className="block text-gray-300">Email Address</label>
        <input
          type="email"
          className="w-full p-2 mt-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-300">Password</label>
        <input
          type="password"
          className="w-full p-2 mt-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
      >
        Login
      </button>
      <div className="mt-4 flex justify-between">
        <a
          href="http://localhost:8080/auth/google"
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Login with Google
        </a>
        <a
          href="http://localhost:8080/auth/linkedin"
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login with LinkedIn
        </a>
      </div>
    </form>
  );
};

export default LoginForm;
