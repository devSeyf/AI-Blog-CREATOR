import React, { useState } from "react";
import { loginUser } from "../utils/authApi";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await loginUser(email, password);

      if (user) {
        setUser(user);
        toast.success("Welcome back! 👋");
        navigate("/");
      } else {
        toast.error("Invalid email or password.");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-cyan-50 to-emerald-50 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-sky-800 mb-6 text-center">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-sky-800 mb-1">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-sky-200 px-4 py-2 focus:ring-2 focus:ring-sky-300 outline-none"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block my-5 text-sm font-medium text-sky-800 mb-1">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-sky-200 px-4 py-2 focus:ring-2 focus:ring-sky-300 outline-none"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-5 rounded-lg bg-gradient-to-r from-sky-400 to-cyan-400 text-white py-2 font-semibold hover:from-sky-500 hover:to-cyan-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-sky-700 text-center mt-4">
          Don’t have an account?{" "}
          <Link
            className="text-cyan-600 font-semibold hover:underline"
            to="/register"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
