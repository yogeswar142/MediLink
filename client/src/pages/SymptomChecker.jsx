import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../api";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";

export default function SymptomChecker() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    age: "",
    gender: "",
    duration: "",
    severity: "",
    symptoms: [],
    notes: ""
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [requestId, setRequestId] = useState(null);

  const symptomList = [
    "fever", "cough", "cold", "sore_throat", "headache", "body_pain",
    "fatigue", "breathing_problem", "chest_pain", "stomach_pain", "vomiting",
    "diarrhea", "constipation", "loss_of_appetite", "dizziness", "anxiety",
    "sleep_problem", "skin_rash", "itching", "burning_urination", "frequent_urination"
  ];

  const toggleSymptom = (s) => {
    setForm((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(s)
        ? prev.symptoms.filter((x) => x !== s)
        : [...prev.symptoms, s]
    }));
  };

  const handleSubmit = async () => {
    if (!form.age || !form.gender || form.symptoms.length === 0) {
      alert("Please fill in age, gender, and select at least one symptom.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_BASE_URL}/api/symptom/analyze`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ ...form, language: i18n.language })
      });
      const data = await res.json();
      
      if (data.success) {
        setResult(data.analysis);
        setRequestId(data.requestId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestDoctor = () => {
    // Navigate to waiting room with the requestId
    navigate(`/waiting-room?request=${requestId}`);
  };

  return (
    <div className="min-h-screen relative">
      <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      
      <div className="max-w-4xl mx-auto pb-12">
        <Navbar role="patient" />

        <div className="px-6 mt-8 mb-6">
          <h2 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <span className="text-4xl">🤖</span> {t("aiSymptomCheck")}
          </h2>
          <p className="text-slate-400 mt-2">Enter your symptoms for an AI-powered preliminary analysis.</p>
        </div>

        <div className="px-6 grid lg:grid-cols-2 gap-8">
          <div className="glass p-8 rounded-2xl animate-[fadeIn_0.5s_ease-out]">
            <div className="space-y-5">
              <div className="flex gap-4">
                <input
                  type="number"
                  placeholder={t("age")}
                  className="input flex-1"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                />
                <select
                  className="input flex-1"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                >
                  <option value="">{t("gender")}</option>
                  <option value="male">{t("male")}</option>
                  <option value="female">{t("female")}</option>
                  <option value="other">{t("other")}</option>
                </select>
              </div>

              <div className="flex gap-4">
                <select
                  className="input flex-1"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                >
                  <option value="">{t("duration")}</option>
                  <option value="1">{t("oneDay")}</option>
                  <option value="2-3">{t("twoThreeDays")}</option>
                  <option value="4+">{t("moreThanFour")}</option>
                </select>
                <select
                  className="input flex-1"
                  value={form.severity}
                  onChange={(e) => setForm({ ...form, severity: e.target.value })}
                >
                  <option value="">{t("severity")}</option>
                  <option value="low">{t("low")}</option>
                  <option value="medium">{t("medium")}</option>
                  <option value="high">{t("high")}</option>
                </select>
              </div>

              <div>
                <p className="font-medium text-slate-300 mb-3">{t("selectSymptoms")}</p>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 pr-4 custom-scrollbar">
                  {symptomList.map((s) => {
                    const isSelected = form.symptoms.includes(s);
                    return (
                      <button
                        key={s}
                        onClick={() => toggleSymptom(s)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          isSelected 
                            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                            : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {isSelected && '✓ '} {t(s)}
                      </button>
                    )
                  })}
                </div>
              </div>

              <textarea
                placeholder={t("additionalNotes") || "Additional notes..."}
                className="input min-h-[100px]"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? "Analyzing..." : t("checkSymptoms")}
              </button>
            </div>
          </div>

          <div className="h-full">
            {loading ? (
              <div className="glass h-full rounded-2xl flex items-center justify-center p-8">
                <LoadingSpinner message="Gemini AI is analyzing your symptoms..." />
              </div>
            ) : result ? (
              <div className="glass h-full rounded-2xl p-8 flex flex-col items-center justify-center text-center animate-[fadeIn_0.5s_ease-out]">
                <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                  <span className="text-3xl">✨</span>
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-4">AI Analysis Complete</h3>
                <div className="text-slate-300 bg-slate-800/50 p-6 rounded-xl border border-slate-700 text-left w-full mb-8">
                  <p className="leading-relaxed whitespace-pre-line text-sm sm:text-base">{result}</p>
                </div>
                
                <button
                  onClick={handleRequestDoctor}
                  className="btn-primary flex items-center justify-center gap-2"
                >
                  <span>📞</span>
                  {t("requestDocCall")}
                </button>
                <p className="text-xs text-slate-400 mt-4 px-4">{t("medicalDisclaimer")}</p>
              </div>
            ) : (
               <div className="glass h-full rounded-2xl p-8 flex flex-col items-center justify-center text-center opacity-50">
                 <span className="text-6xl mb-4">🩺</span>
                 <p className="text-slate-400">Fill your symptoms and run the checker to see the AI analysis here.</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}