import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Mode = "login" | "signup";
const REMEMBER_EMAIL_KEY = "gotit.rememberEmail";

export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberEmail, setRememberEmail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signedUp, setSignedUp] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY);
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberEmail(true);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setError(error.message);
      else if (rememberEmail) {
        localStorage.setItem(REMEMBER_EMAIL_KEY, email.trim());
      } else {
        localStorage.removeItem(REMEMBER_EMAIL_KEY);
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setSignedUp(true);
    }

    setLoading(false);
  }

  if (signedUp) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ background: "#F2F2F7" }}
      >
        <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-sm">
          <div className="text-4xl mb-4">📬</div>
          <h2 className="text-[20px] font-bold text-gray-900 mb-2">
            Check your email
          </h2>
          <p className="text-sm text-gray-500">
            We sent a confirmation link to <strong>{email}</strong>. Click it to
            activate your account, then come back to log in.
          </p>
          <button
            onClick={() => {
              setSignedUp(false);
              setMode("login");
            }}
            className="mt-6 text-sm font-semibold cursor-pointer border-none bg-transparent"
            style={{ color: "#007AFF" }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "#F2F2F7" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚽</div>
          <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">
            Got It
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Panini WC 2026 Sticker Tracker
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          {/* Mode toggle */}
          <div className="bg-gray-100 rounded-xl p-1 flex mb-6">
            {(["login", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setError(null);
                }}
                className={`flex-1 py-1.5 text-[13px] font-semibold rounded-[10px] transition-all cursor-pointer border-none ${
                  mode === m
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 bg-transparent"
                }`}
              >
                {m === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="mt-1 w-full bg-gray-100 rounded-xl px-4 py-3 text-[15px] text-gray-900 placeholder-gray-400 outline-none border-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="mt-1 w-full bg-gray-100 rounded-xl px-4 py-3 text-[15px] text-gray-900 placeholder-gray-400 outline-none border-none"
              />
            </div>

            {mode === "login" && (
              <label className="flex items-center gap-2 px-1 text-sm text-gray-500 select-none">
                <input
                  type="checkbox"
                  checked={rememberEmail}
                  onChange={(e) => setRememberEmail(e.target.checked)}
                />
                Remember email
              </label>
            )}

            {error && (
              <p className="text-sm text-red-500 font-medium px-1">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3.5 rounded-2xl text-white text-[17px] font-semibold cursor-pointer border-none disabled:opacity-50"
              style={{ background: "#007AFF" }}
            >
              {loading
                ? "Please wait…"
                : mode === "login"
                  ? "Log In"
                  : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
