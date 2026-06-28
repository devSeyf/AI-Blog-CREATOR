import { LoaderCircle, LogIn } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { buttonStyles, cardStyles, fieldStyles, labelStyles } from "../styles/ui";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;
    try {
      setLoading(true);
      const result = await login(email, password);
      if (result.success) navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 pb-12 pt-28">
      <section className={`${cardStyles} w-full max-w-md p-6 sm:p-8`}>
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">AIBLOG workspace</p>
        <h1 className="mt-3 text-center text-3xl font-black text-slate-950">Welcome back</h1>
        <p className="mt-2 text-center text-sm text-slate-500">Sign in to manage your stories and comments.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="login-email" className={labelStyles}>Email</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={fieldStyles}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="login-password" className={labelStyles}>Password</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={fieldStyles}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" disabled={loading} className={`${buttonStyles.primary} w-full`}>
            {loading ? <LoaderCircle className="size-4 animate-spin" /> : <LogIn className="size-4" />}
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          New to AIBLOG?{" "}
          <Link className="font-semibold text-cyan-700 hover:text-cyan-800 hover:underline" to="/register">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
}
