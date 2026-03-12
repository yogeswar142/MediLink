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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-indigo-500/20 rounded-full blur-3xl"></div>

      {step === 1 && (
        <div className="glass p-10 rounded-2xl w-full max-w-sm z-10 mx-4 animate-[fadeIn_0.5s_ease-out]">
          <h2 className="text-2xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
            {t("chooseLanguage")}
          </h2>

          <div className="flex flex-col gap-4 mb-8">
            <button 
              onClick={() => setLanguage("en")}
              className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between ${language === 'en' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800/50 hover:bg-slate-700/50'}`}
            >
              <span className="text-lg font-medium text-slate-200">English</span>
              <span className="text-2xl">🇬🇧</span>
            </button>
            <button 
              onClick={() => setLanguage("hi")}
              className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between ${language === 'hi' ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800/50 hover:bg-slate-700/50'}`}
            >
              <span className="text-lg font-medium text-slate-200">हिंदी</span>
              <span className="text-2xl">🇮🇳</span>
            </button>
          </div>

          <button onClick={handleContinue} className="btn-primary">
            {t("continue")}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col items-center z-10 w-full max-w-md mx-4 animate-[fadeIn_0.5s_ease-out]">
          <div className="glass p-10 rounded-3xl w-full text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            
            <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-6 transform group-hover:rotate-12 transition-transform duration-500">
              <span className="font-bold text-white text-3xl">ML</span>
            </div>

            <h1 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
              MediLink
            </h1>

            <div className="flex flex-col gap-4 relative z-10">
              <button onClick={() => navigate("/signup")} className="btn-primary text-lg py-4">
                {t("signup")}
              </button>
              <button onClick={() => navigate("/login")} className="btn-secondary text-lg py-4">
                {t("login")}
              </button>
            </div>
          </div>

          <button 
            onClick={() => navigate("/doctor")}
            className="mt-8 text-slate-400 hover:text-indigo-400 font-medium transition-colors flex items-center gap-2"
          >
            {t("doctorLogin")}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

