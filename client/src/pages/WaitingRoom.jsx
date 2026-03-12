import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import API_BASE_URL from "../api";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";

export default function WaitingRoom() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("request");
  
  const [socket, setSocket] = useState(null);
  const [doctorName, setDoctorName] = useState("");

  useEffect(() => {
    // Basic polling to see if active session exists
    const checkSession = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE_URL}/api/consult/active`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.isActive && data.roomId) {
          navigate(`/video-call?room=${data.roomId}`);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const interval = setInterval(checkSession, 5000);
    checkSession();

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 w-[40rem] h-[40rem] bg-emerald-500/10 rounded-full blur-3xl -z-10 -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-4xl mx-auto pb-12">
        <Navbar role="patient" />

        <div className="flex flex-col items-center justify-center mt-20 animate-[fadeIn_0.5s_ease-out]">
          <div className="glass p-12 rounded-3xl w-full max-w-lg text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50"></div>
            
            <div className="relative z-10">
              <LoadingSpinner />
              
              <h2 className="text-2xl font-bold text-slate-100 mt-8 mb-4">
                {t("lookingForDoctor") || "Looking for an available doctor..."}
              </h2>
              
              <p className="text-slate-400">
                Please wait while we connect you with a medical professional. Do not close this page.
              </p>
              
              <div className="mt-8 pt-6 border-t border-slate-700/50">
                <button 
                  onClick={() => navigate("/home")}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Cancel Request
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
