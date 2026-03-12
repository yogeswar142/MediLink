import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import API_BASE_URL from "../api";

export default function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (form.password !== form.confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setLoading(true);
    const language = localStorage.getItem("language") || "en";

    try {
      const res = await fetch(`${API_BASE_URL}/api/signup/patient`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          settings: { language }
        })
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setErrorMsg(data.message || "Signup failed");
        return;
      }
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("fullName", data.user.fullName);
      localStorage.setItem("role", "patient");

      navigate("/home", { state: { showPopup: true } });

    } catch (err) {
      setLoading(false);
      setErrorMsg("Server not reachable");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12">
      <div className="absolute top-1/2 left-0 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-3xl mix-blend-screen -translate-y-1/2 -translate-x-1/2"></div>
      
      <form className="glass p-10 rounded-2xl w-full max-w-md z-10 mx-4 shadow-2xl" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-8 text-center text-slate-100">
          {t("createAccount")}
        </h2>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
            ⚠️ {errorMsg}
          </div>
        )}

        <div className="space-y-4 mb-8">
          {["fullName", "email", "phone", "password", "confirmPassword"].map((field) => (
            <input
              key={field}
              name={field}
              type={field.includes("email") ? "email" : field.includes("password") ? "password" : "text"}
              placeholder={t(field)}
              onChange={handleChange}
              className="input"
              required
            />
          ))}
        </div>

        <button disabled={loading} className="btn-primary py-3.5 mb-6">
          {loading ? "..." : t("submit")}
        </button>
        
        <p className="text-center text-sm text-slate-400 mt-6">
          {t("alreadyAccount")}{" "}
          <span 
            className="text-indigo-400 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            {t("loginHere") || "Login"}
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
    </div>
  );
}
