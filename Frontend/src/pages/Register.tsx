import { LoaderCircle, UserPlus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { buttonStyles, cardStyles, fieldStyles, labelStyles } from "../styles/ui";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;
    try {
      setLoading(true);
      const result = await register(name, email, password);
      if (result.success) navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 pb-12 pt-28">
      <section className={`${cardStyles} w-full max-w-md p-6 sm:p-8`}>
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">Join AIBLOG</p>
        <h1 className="mt-3 text-center text-3xl font-black text-slate-950">Create your account</h1>
        <p className="mt-2 text-center text-sm text-slate-500">Start writing, publishing, and joining conversations.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="register-name" className={labelStyles}>Name</label>
            <input
              id="register-name"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={fieldStyles}
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label htmlFor="register-email" className={labelStyles}>Email</label>
            <input
              id="register-email"
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
            <label htmlFor="register-password" className={labelStyles}>Password</label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={fieldStyles}
              placeholder="At least 6 characters"
              required
            />
          </div>
          <button type="submit" disabled={loading} className={`${buttonStyles.primary} w-full`}>
            {loading ? <LoaderCircle className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link className="font-semibold text-cyan-700 hover:text-cyan-800 hover:underline" to="/login">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
