import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `http://localhost:8080/api/auth/reset-password/${token}`,
        { newPassword }
      );
      setMessage(data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        className="bg-white p-6 shadow-md rounded-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl mb-4">Reset Password</h2>
        <input
          type="password"
          className="border p-2 w-full mb-4"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded w-full"
        >
          Reset Password
        </button>
        {message && <p className="mt-2 text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
