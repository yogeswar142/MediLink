import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useAutoLogout from "../utils/useAutoLogout";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import API_BASE_URL from "../api";

export default function Home() {
  useAutoLogout();

  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [showWelcome, setShowWelcome] = useState(false);
  const [activeRoomId, setActiveRoomId] = useState(null);

  useEffect(() => {
    const lang = localStorage.getItem("language");
    if (lang) i18n.changeLanguage(lang);

    if (location.state?.showPopup) {
      setShowWelcome(true);
    }

    const checkActiveSession = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/consult/active`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.isActive && data.roomId) {
          setActiveRoomId(data.roomId);
        }
      } catch (err) {} // ignore
    };
    checkActiveSession();
  }, [location]);

  const features = [
    { id: "symptom", icon: "🤖", titleKey: "aiSymptomCheck", desc: "Analyze symptoms instantly", path: "/symptom-checker", color: "from-blue-500 to-indigo-500" },
    { id: "book", icon: "📅", titleKey: "bookAppointment", desc: "Schedule a doctor visit", path: "/book-appointment", color: "from-emerald-400 to-teal-500" },
    { id: "medicine", icon: "💊", titleKey: "medicineAvailability", desc: "Find medicines near you", path: "/medicines", color: "from-amber-400 to-orange-500" },
    { id: "records", icon: "📋", titleKey: "medicalRecords", desc: "View past prescriptions", path: "/health-records", color: "from-purple-500 to-pink-500" }
  ];

  return (
    <div className="min-h-screen relative">
      <div className="absolute top-0 right-1/4 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse delay-700"></div>
      
      <div className="max-w-6xl mx-auto pb-12">
        <Navbar role="patient" />
        
        <div className="px-6 mt-12 mb-8 animate-[fadeIn_0.5s_ease-out]">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight">
            How can we help you today?
          </h2>
          <p className="text-slate-400 mt-2 text-lg">Select a service below to get started</p>
        </div>

        {activeRoomId && (
          <div className="px-6 mb-8 animate-[fadeIn_0.5s_ease-out]">
            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-amber-400 font-bold mb-1">Active Consultation In Progress</h3>
                <p className="text-slate-300 text-sm">You have an ongoing video consultation with a doctor.</p>
              </div>
              <button 
                onClick={() => navigate(`/video-call?room=${activeRoomId}`)}
                className="bg-amber-500 text-slate-900 font-bold px-6 py-2.5 rounded-lg hover:bg-amber-400 shadow-lg shadow-amber-500/20 transition-all whitespace-nowrap"
              >
                Rejoin Call
              </button>
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6">
          {features.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => navigate(item.path)}
              className="glass p-6 rounded-2xl cursor-pointer group hover:bg-slate-800/80 transition-all duration-300 transform hover:-translate-y-2 border border-slate-700/50 hover:border-slate-500/50"
              style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-6 bg-gradient-to-br ${item.color} shadow-lg group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-2 group-hover:text-indigo-300 transition-colors">
                {t(item.titleKey)}
              </h3>
              <p className="text-sm text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Modal isOpen={showWelcome} onClose={() => setShowWelcome(false)} title="Account Created">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
             <span className="text-2xl">🎉</span>
          </div>
          <p className="text-slate-300">Your patient account was created successfully. Welcome to MediLink!</p>
          <button 
            onClick={() => setShowWelcome(false)}
            className="mt-6 btn-primary py-2"
          >
            Get Started
          </button>
        </div>
      </Modal>

      <style>{`
        .grid > div {
          animation: slideUp 0.5s ease-out;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
