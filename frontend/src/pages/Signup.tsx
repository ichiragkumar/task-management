import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api/api";
import toast from "react-hot-toast";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await signup({ email, password });
      toast.success("Account created!");
      navigate("/login");
    } catch {
      toast.error("Signup failed");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>
      <input
        placeholder="Email"
        className="border p-2 w-full mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-4"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleSignup}
        className="bg-blue-600 text-white w-full py-2 rounded"
      >
        Sign Up
      </button>
      <p className="text-sm mt-4">
        Already have an account? <Link to="/login" className="text-blue-600 underline">Login</Link>
      </p>
    </div>
  );
}
