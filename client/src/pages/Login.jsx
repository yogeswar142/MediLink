import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/login/patient", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    if (!res.ok) {
      setError(true);
      return;
    }

    // apply language from DB
    i18n.changeLanguage(data.user.settings.language);
    localStorage.setItem("language", data.user.settings.language);
    localStorage.setItem("userId", data.user.id);

    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-300">
      <form onSubmit={handleSubmit} className="bg-slate-100 p-8 rounded shadow w-96">
        <h2 className="text-xl font-semibold mb-6 text-center">
          {t("login")}
        </h2>

        <input
          placeholder={t("email")}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder={t("password")}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          {t("login")}
        </button>
      </form>

      {error && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-slate-100 p-6 rounded shadow w-80 relative">
            <button
              className="absolute top-2 right-3"
              onClick={() => setError(false)}
            >
              ✕
            </button>
            <h3 className="font-semibold mb-2">Login Failed</h3>
            <p className="text-sm">Invalid email or password.</p>
          </div>
        </div>
      )}
    </div>
  );
}
