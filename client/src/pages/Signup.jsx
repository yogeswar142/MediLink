import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Signup() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const language = localStorage.getItem("language") || "en";

    try {
      const res = await fetch("http://localhost:5000/api/signup/patient", {
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

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      navigate("/home", { state: { showPopup: true } });

    } catch (err) {
      alert("Server not reachable");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-300">
      <form className="bg-slate-100 p-8 rounded shadow w-96" onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold mb-6 text-center">
          {t("createAccount")}
        </h2>

        {["fullName", "email", "phone", "password", "confirmPassword"].map((field) => (
          <input
            key={field}
            name={field}
            type={field.includes("password") ? "password" : "text"}
            placeholder={t(field)}
            onChange={handleChange}
            className="w-full mb-3 p-2 border rounded"
            required
          />
        ))}

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          {t("submit")}
        </button>
      </form>
    </div>
  );
}
