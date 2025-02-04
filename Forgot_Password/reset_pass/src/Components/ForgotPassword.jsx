import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/auth/forgot-password",
        { email }
      );
      setMessage(data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending reset link");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        className="bg-white p-6 shadow-md rounded-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl mb-4">Forgot Password</h2>
        <input
          type="email"
          className="border p-2 w-full mb-4"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Send Reset Link
        </button>
        {message && <p className="mt-2 text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
