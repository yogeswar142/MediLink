import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

import API_BASE_URL from "../api";

export default function BookAppointment() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [loading, setLoading] = useState(false);

  // Time slots representing hour start: 8 = 8AM, 14 = 2PM
  const timeSlots = [
    { id: 8, label: "08:00 AM - 09:00 AM" },
    { id: 9, label: "09:00 AM - 10:00 AM" },
    { id: 10, label: "10:00 AM - 12:00 PM" },
    { id: 14, label: "02:00 PM - 03:00 PM" },
    { id: 15, label: "03:00 PM - 04:00 PM" },
    { id: 16, label: "04:00 PM - 05:00 PM" },
    { id: 18, label: "06:00 PM - 07:00 PM" }
  ];

  const handleBook = async () => {
    if (!date || !slot) return alert("Select date and slot");
    
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_BASE_URL}/api/appointment/book`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ date, timeSlot: slot })
      });
      const data = await res.json();
      
      if (data.success) {
        alert("Appointment booked successfully! We will redirect you to Waiting Room at the given time.");
        navigate("/home");
      } else {
        alert(data.message || "Failed to book");
      }
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get min date string for input
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen relative">
      <div className="absolute top-1/3 left-1/3 w-[30rem] h-[30rem] bg-emerald-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      
      <div className="max-w-4xl mx-auto pb-12">
        <Navbar role="patient" />

        <div className="px-6 mt-8 mb-6 animate-[fadeIn_0.5s_ease-out]">
          <h2 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <span className="text-4xl">📅</span> {t("bookAppointment") || "Book Appointment"}
          </h2>
          <p className="text-slate-400 mt-2">Select a convenient date and time slot. Doctors will accept your request.</p>
        </div>

        <div className="px-6 max-w-xl animate-[fadeIn_0.5s_ease-out_0.2s_both]">
          <div className="glass p-8 rounded-2xl">
            <div className="space-y-6">
              
              <div>
                <label className="block text-slate-300 font-medium mb-3">1. Select Date</label>
                <input 
                  type="date"
                  min={today}
                  className="input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-3">2. Select Time Slot</label>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
                  {timeSlots.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSlot(s.id)}
                      className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                        slot === s.id 
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <div className="mt-10 pt-6 border-t border-slate-700/50">
              <button 
                onClick={handleBook}
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all font-medium text-lg disabled:opacity-50"
              >
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
