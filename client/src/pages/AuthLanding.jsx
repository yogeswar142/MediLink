import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AuthLanding() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [language, setLanguage] = useState("en");

  const handleContinue = () => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
    setStep(2);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-300 relative">
      {step === 1 && (
        <div className="bg-slate-100 p-8 rounded shadow w-80 text-center">
          <h2 className="text-lg font-semibold mb-4">
            {t("chooseLanguage")}
          </h2>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full border p-2 rounded mb-4"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>

          <button
            onClick={handleContinue}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {t("continue")}
          </button>
        </div>
      )}

      {step === 2 && (
        <>
          <div className="bg-slate-100 p-10 rounded shadow text-center w-96">
            <h1 className="text-4xl font-bold mb-8">
              <span className="text-blue-700">Medi</span>
              <span className="text-gray-800">Link</span>
            </h1>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => navigate("/signup")}
                className="border border-blue-600 text-blue-600 py-2 rounded"
              >
                {t("signup")}
              </button>

              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 text-white py-2 rounded"
              >
                {t("login")}
              </button>
            </div>
          </div>

          <button className="absolute bottom-6 right-6 text-sm text-blue-700">
            {t("doctorLogin")}
          </button>
        </>
      )}
    </div>
  );
}

