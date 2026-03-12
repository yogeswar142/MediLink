import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import API_BASE_URL from "../api";

export default function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/login/patient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(true);
        return;
      }

      i18n.changeLanguage(data.user.settings.language);
      localStorage.setItem("language", data.user.settings.language);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("fullName", data.user.fullName);
      localStorage.setItem("role", "patient");

      navigate("/home");
    } catch(err) {
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-3xl mix-blend-screen"></div>

      <form onSubmit={handleSubmit} className="glass p-10 rounded-2xl w-full max-w-sm z-10 mx-4 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="font-bold text-white text-2xl">ML</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-8 text-center text-slate-100">
          {t("patientLogin")}
        </h2>

        <div className="space-y-4 mb-8">
          <input
            placeholder={t("email")}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input"
            required
            type="email"
          />
          <input
            type="password"
            placeholder={t("password")}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input"
            required
          />
        </div>

        <button disabled={loading} className="btn-primary py-3.5 mb-6 opacity-90 hover:opacity-100 disabled:opacity-50">
          {loading ? "..." : t("login")}
        </button>

        <p className="text-center text-sm text-slate-400">
          {t("alreadyAccount") === "Already have an account?" ? "Don't have an account?" : "खाता नहीं है?"}{" "}
          <span 
            className="text-indigo-400 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/signup")}
          >
            {t("signup")}
          </span>
        </p>

        <p className="text-center mt-6">
          <span 
            className="text-slate-500 text-xs cursor-pointer hover:text-slate-300 transition-colors"
            onClick={() => navigate("/")}
          >
            ← Back
          </span>
        </p>
      </form>

      {error && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass p-8 rounded-xl w-80 relative transform animate-[fadeIn_0.2s_ease-out]">
            <button className="absolute top-4 right-4 text-slate-400 hover:text-white" onClick={() => setError(false)}>
              ✕
            </button>
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4 text-red-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-lg text-slate-100 mb-2">Login Failed</h3>
            <p className="text-sm text-slate-300">Invalid email or password. Please try again.</p>
          </div>
        </div>
      )}
    </div>
  );
}
