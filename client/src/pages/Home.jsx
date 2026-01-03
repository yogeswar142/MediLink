import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useAutoLogout from "../utils/useAutoLogout";

export default function Home() {
  useAutoLogout();

  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const lang = localStorage.getItem("language");
    if (lang) i18n.changeLanguage(lang);

    if (location.state?.showPopup) {
      setShowPopup(true);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-300 p-8">
      <h1 className="text-2xl font-semibold mb-6">MediLink</h1>

      <div className="grid gap-4 max-w-md">
        <div className="bg-slate-100 p-4 rounded">AI Symptom Check</div>
        <div className="bg-slate-100 p-4 rounded">Book Appointment</div>
        <div className="bg-slate-100 p-4 rounded">Consult Doctor</div>
        <div className="bg-slate-100 p-4 rounded">Medical Records</div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-slate-100 p-6 rounded shadow w-80 relative">
            <button
              className="absolute top-2 right-3"
              onClick={() => setShowPopup(false)}
            >
              ✕
            </button>
            <h3 className="font-semibold mb-2">Account Created</h3>
            <p className="text-sm">Your patient account was created successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
}
