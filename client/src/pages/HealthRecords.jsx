import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import API_BASE_URL from "../api";

export default function HealthRecords() {
  const { t } = useTranslation();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_BASE_URL}/api/records/my`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setRecords(data.records);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen relative">
      <div className="absolute top-1/4 left-0 w-[40rem] h-[40rem] bg-purple-500/10 rounded-full blur-3xl -z-10 mix-blend-screen -translate-x-1/2"></div>
      
      <div className="max-w-4xl mx-auto pb-12">
        <Navbar role="patient" />

        <div className="px-6 mt-8 mb-8 animate-[fadeIn_0.5s_ease-out]">
          <h2 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <span className="text-4xl">📋</span> {t("medicalRecords") || "Medical Records"}
          </h2>
          <p className="text-slate-400 mt-2">View your past prescriptions and consultation notes.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner message="Loading records..." /></div>
        ) : records.length === 0 ? (
          <div className="px-6">
            <div className="glass rounded-2xl p-12 text-center">
              <span className="text-5xl block mb-4">📂</span>
              <h3 className="text-xl font-bold text-slate-200 mb-2">No Records Found</h3>
              <p className="text-slate-400">You don't have any past consultations yet.</p>
            </div>
          </div>
        ) : (
          <div className="px-6 space-y-6">
            {records.map((rec, i) => (
              <div key={rec._id} className="glass p-6 rounded-2xl border border-slate-700/50 hover:border-purple-500/30 transition-colors animate-[fadeIn_0.5s_ease-out]" style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-700/50 pb-4 mb-4">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center font-bold text-xl">⚕️</div>
                     <div>
                       <h3 className="text-lg font-bold text-slate-200">
                         {rec.doctorId ? `Dr. ${rec.doctorId.fullName}` : "Unknown Doctor"}
                       </h3>
                       <p className="text-sm text-slate-400">{formatDate(rec.createdAt)}</p>
                     </div>
                  </div>
                  
                  {rec.prescriptionUrl && (
                    <a 
                      href={`${API_BASE_URL}${rec.prescriptionUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-500/20 hover:bg-emerald-500 hover:text-white text-emerald-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <span>📥</span> Prescription
                    </a>
                  )}
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs uppercase text-slate-500 font-bold mb-2 tracking-wider">Symptoms Evaluated</h4>
                    <p className="text-slate-300 bg-slate-800/50 p-3 rounded-xl text-sm border border-slate-700">
                      {rec.symptomSummary || "No symptoms recorded"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase text-indigo-400 font-bold mb-2 tracking-wider drop-shadow-lg">Doctor Notes</h4>
                    <p className="text-indigo-100 bg-indigo-500/10 p-3 rounded-xl border border-indigo-500/20 text-sm whitespace-pre-wrap">
                      {rec.doctorNotes || rec.notes || "No notes provided"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
