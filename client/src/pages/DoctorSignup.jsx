import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import API_BASE_URL from "../api";

export default function DoctorSignup() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialization: "",
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

    try {
      const res = await fetch(`${API_BASE_URL}/api/signup/doctor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          specialization: form.specialization,
          password: form.password
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
      localStorage.setItem("role", "doctor");

      navigate("/doctor/dashboard");

    } catch (err) {
      setLoading(false);
      setErrorMsg("Server not reachable");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12 bg-slate-900">
      <div className="absolute top-1/2 right-0 w-[40rem] h-[40rem] bg-emerald-600/10 rounded-full blur-3xl mix-blend-screen -translate-y-1/2 translate-x-1/4"></div>
      
      <form className="glass p-10 rounded-2xl w-full max-w-md z-10 mx-4 shadow-2xl border-emerald-500/20" onSubmit={handleSubmit}>
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <span className="font-bold text-white text-xl">👨‍⚕️</span>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-8 text-center text-emerald-400">
          Doctor Registration
        </h2>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
            ⚠️ {errorMsg}
          </div>
        )}

        <div className="space-y-4 mb-8">
          <input name="fullName" type="text" placeholder="Full Name (Dr. X)" onChange={handleChange} className="input focus:border-emerald-500" required />
          <input name="email" type="email" placeholder="Email Address" onChange={handleChange} className="input focus:border-emerald-500" required />
          <input name="phone" type="text" placeholder="Phone Number" onChange={handleChange} className="input focus:border-emerald-500" required />
          <input name="specialization" type="text" placeholder="Specialization (e.g. Cardiologist)" onChange={handleChange} className="input focus:border-emerald-500" required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} className="input focus:border-emerald-500" required />
          <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} className="input focus:border-emerald-500" required />
        </div>

        <button disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 rounded-xl shadow-lg transition-all font-medium text-lg disabled:opacity-50 mb-6">
          {loading ? "..." : "Register"}
        </button>
        
        <p className="text-center text-sm text-slate-400 mt-6">
          Already registered?{" "}
          <span 
            className="text-emerald-400 font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/doctor")}
          >
            Login Here
          </span>
        </p>

        <p className="text-center mt-6">
          <span 
            className="text-slate-500 text-xs cursor-pointer hover:text-slate-300 transition-colors"
            onClick={() => navigate("/")}
          >
            ← Back to Main Menu
          </span>
        </p>
      </form>
    </div>
  );
}
