import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import useAutoLogout from "../utils/useAutoLogout";
import API_BASE_URL from "../api";

export default function DoctorHome() {
  useAutoLogout();

  const { t } = useTranslation();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("requests");
  const [prescribing, setPrescribing] = useState(null); // the consult request/appointment being completed
  const [prescriptionForm, setPrescriptionForm] = useState({ notes: "", experience: "" });
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const p1 = fetch(`${API_BASE_URL}/api/consult/pending`, { headers: { "Authorization": `Bearer ${token}` } }).then(r=>r.json());
      const p2 = fetch(`${API_BASE_URL}/api/appointment/pending`, { headers: { "Authorization": `Bearer ${token}` } }).then(r=>r.json());
      const p3 = fetch(`${API_BASE_URL}/api/records/my`, { headers: { "Authorization": `Bearer ${token}` } }).then(r=>r.json());

      const [consultRes, apptRes, recRes] = await Promise.all([p1, p2, p3]);

      if (consultRes.success) setRequests(consultRes.requests);
      if (apptRes.success) setAppointments(apptRes.appointments);
      if (recRes.success) setRecords(recRes.records);

    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const takeCase = async (reqId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/api/consult/take/${reqId}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        }
      });
      const data = await res.json();
      if (data.success && data.roomId) {
        navigate(`/video-call?room=${data.roomId}`);
      } else {
        alert(data.message || "Failed to take case");
      }
    } catch(err) {
      console.error(err);
    }
  };

  const submitPrescription = async (e) => {
     e.preventDefault();
     setSubmitting(true);
     
     const token = localStorage.getItem("token");
     try {
       // Step 1: Upload prescription file if provided
       let prescriptionUrl = null;
       if (prescriptionFile) {
         const formData = new FormData();
         formData.append("prescription", prescriptionFile);
         const uploadRes = await fetch(`${API_BASE_URL}/api/upload/prescription`, {
           method: "POST",
           headers: { "Authorization": `Bearer ${token}` },
           body: formData
         });
         const uploadData = await uploadRes.json();
         if (uploadData.success) {
           prescriptionUrl = uploadData.url;
         }
       }

       // Step 2: End session with notes + prescription URL
       const res = await fetch(`${API_BASE_URL}/api/records/session/end`, {
         method: "POST",
         headers: { 
           "Content-Type": "application/json",
           "Authorization": `Bearer ${token}` 
         },
         body: JSON.stringify({ 
           roomId: prescribing.roomId, 
           patientNotes: prescriptionForm.notes,
           prescriptionUrl
         })
       });
       
       if (res.ok) {
         setPrescribing(null);
         setPrescriptionForm({ notes: "", experience: "" });
         setPrescriptionFile(null);
         fetchDashboardData();
       } else {
         alert("Failed to complete session.");
       }
     } catch (err) {
       console.error("End session error:", err);
     } finally {
       setSubmitting(false);
     }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const renderRequests = () => (
    <div className="space-y-4">
      {requests.length === 0 && <p className="text-slate-400 p-4 bg-slate-800/50 rounded-xl text-center">No active consult requests currently.</p>}
      
      {requests.map(req => (
        <div key={req._id} className="glass p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
             <div className="flex items-center gap-2 mb-2">
                <span className="bg-red-500/20 text-red-500 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider animate-pulse">
                  Emergency Consult
                </span>
                <span className="text-sm text-slate-400">{formatDate(req.createdAt)}</span>
             </div>
             <p className="text-slate-200 font-medium">Patient: <span className="text-indigo-400">{req.patientId.fullName}</span></p>
             <p className="text-slate-400 text-sm mt-1">{req.symptomSummary.substring(0, 100)}...</p>
          </div>
          
          <div className="flex gap-2">
             {req.status === "taken" && req.roomId ? (
               <>
                 <button onClick={() => navigate(`/video-call?room=${req.roomId}`)} className="bg-amber-600 hover:bg-amber-500 text-white px-5 py-2.5 rounded-lg font-medium whitespace-nowrap shadow-lg shadow-amber-500/20 transition-all active:scale-95">
                   Rejoin Call
                 </button>
                 <button onClick={() => setPrescribing(req)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-medium whitespace-nowrap shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
                   Complete Session
                 </button>
               </>
             ) : (
                <button onClick={() => takeCase(req._id)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-lg font-medium whitespace-nowrap shadow-lg shadow-emerald-500/20 transition-all active:scale-95">
                   Take Case
                </button>
             )}
          </div>
        </div>
      ))}

      <h3 className="text-xl font-bold mt-10 mb-4 text-emerald-400 border-b border-slate-700/50 pb-2">Upcoming Appointments</h3>
      {appointments.length === 0 && <p className="text-slate-400 p-4 bg-slate-800/50 rounded-xl text-center">No upcoming appointments.</p>}
      {appointments.map(appt => (
        <div key={appt._id} className="glass p-5 rounded-xl border-l-4 border-emerald-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
             <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">📅</span>
                <span className="font-semibold text-emerald-400">{formatDate(appt.date)}</span>
             </div>
             <p className="text-slate-200 font-medium">Patient: {appt.patientId.fullName}</p>
             <p className="text-slate-400 text-sm">Time Slot: {appt.timeSlot}:00 hrs</p>
          </div>
          <button className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all">
             Start Call
          </button>
        </div>
      ))}
    </div>
  );

  const renderPastRecords = () => (
    <div className="space-y-4">
      {records.length === 0 && <p className="text-slate-400 text-center py-10">No past records to display.</p>}
      
      {records.map((rec, i) => (
         <div key={rec._id} className="glass p-6 rounded-2xl animate-[fadeIn_0.5s_ease-out]">
            <div className="flex justify-between border-b border-slate-700/50 pb-4 mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-200">
                  Patient: <span className="text-indigo-400">{rec.patientId ? rec.patientId.fullName : "Unknown"}</span>
                </h3>
                <p className="text-sm text-slate-500">{formatDate(rec.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="text-emerald-400 font-bold">★ {rec.patientRating}/5</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs uppercase text-slate-500 font-bold mb-1">Symptoms</h4>
                <p className="text-slate-300 text-sm">{rec.symptomSummary || "None"}</p>
              </div>
              <div>
                <h4 className="text-xs uppercase text-slate-500 font-bold mb-1">My Notes</h4>
                <p className="text-indigo-200 text-sm bg-indigo-500/10 p-2 rounded">{rec.doctorNotes || "No notes provided"}</p>
              </div>
            </div>
         </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen relative bg-slate-900">
      <div className="absolute top-0 right-1/4 w-[40rem] h-[40rem] bg-emerald-500/5 rounded-full blur-3xl -z-10 mix-blend-screen"></div>
      
      <div className="max-w-6xl mx-auto pb-12">
        <Navbar role="doctor" />

        <div className="px-6 mt-12 mb-8 flex flex-col md:flex-row justify-between md:items-end gap-4 animate-[fadeIn_0.5s_ease-out]">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight">
              Doctor <span className="text-emerald-400">Dashboard</span>
            </h2>
            <p className="text-slate-400 mt-2 text-lg">Manage your consultations and patient records.</p>
          </div>
        </div>

        <div className="px-6 mb-6">
          <div className="bg-slate-800/50 p-1.5 rounded-xl inline-flex w-full sm:w-auto overflow-x-auto custom-scrollbar">
            <button 
              onClick={() => setActiveTab('requests')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'requests' ? 'bg-emerald-600 shadow-md text-white' : 'text-slate-400 hover:text-white'}`}
            >
               Active Cases
            </button>
            <button 
              onClick={() => setActiveTab('records')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'records' ? 'bg-emerald-600 shadow-md text-white' : 'text-slate-400 hover:text-white'}`}
            >
               Past Records
            </button>
          </div>
        </div>

        <div className="px-6">
          {loading ? (
             <div className="py-20 flex justify-center"><LoadingSpinner /></div>
          ) : (
             activeTab === 'requests' ? renderRequests() : renderPastRecords()
          )}
        </div>
      </div>

      <Modal isOpen={!!prescribing} title="Upload Prescription & Generate Notes">
         <form onSubmit={submitPrescription}>
            <div className="mb-4">
              <label className="block text-slate-300 font-medium mb-2">Doctor Notes / Observation</label>
              <textarea 
                className="input min-h-[100px]" 
                value={prescriptionForm.notes}
                onChange={e => setPrescriptionForm({...prescriptionForm, notes: e.target.value})}
                required
              />
            </div>
            
            <div className="mb-6">
               <label className="block text-slate-300 font-medium mb-2">Upload Prescription (Image/PDF)</label>
               <input 
                 type="file" 
                 accept="image/*,.pdf"
                 onChange={(e) => setPrescriptionFile(e.target.files[0])}
                 className="text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-500/20 file:text-emerald-400 cursor-pointer" 
               />
            </div>

            <button type="submit" disabled={submitting} className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-lg text-white font-medium shadow-lg transition-colors disabled:opacity-50">
               {submitting ? "Submitting..." : "Submit Prescription & Complete Session"}
            </button>
         </form>
      </Modal>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #059669; border-radius: 10px; }
      `}</style>
    </div>
  );
}
