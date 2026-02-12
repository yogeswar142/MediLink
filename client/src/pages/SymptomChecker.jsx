import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function SymptomChecker() {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    age: "",
    gender: "",
    duration: "",
    severity: "",
    symptoms: [],
    notes: ""
  });

  const symptomList = [
    "fever",
    "cough",
    "cold",
    "sore_throat",
    "headache",
    "body_pain",
    "fatigue",
    "breathing_problem",
    "chest_pain",
    "stomach_pain",
    "vomiting",
    "diarrhea",
    "constipation",
    "loss_of_appetite",
    "dizziness",
    "anxiety",
    "sleep_problem",
    "skin_rash",
    "itching",
    "burning_urination",
    "frequent_urination"
  ];

  const toggleSymptom = (s) => {
    setForm((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(s)
        ? prev.symptoms.filter((x) => x !== s)
        : [...prev.symptoms, s]
    }));
  };

  const handleSubmit = () => {
    console.log("SUBMITTED DATA", form);
    // backend call will be added later
  };

  return (
    <div className="min-h-screen bg-slate-200 p-6">
      <h1 className="text-xl font-semibold mb-4">{t("aiSymptomCheck")}</h1>

      <div className="bg-white rounded p-4 max-w-xl">
        <div className="grid gap-3">

          <input
            type="number"
            placeholder={t("age")}
            className="input"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
          />

          <select
            className="input"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="">{t("gender")}</option>
            <option value="male">{t("male")}</option>
            <option value="female">{t("female")}</option>
            <option value="other">{t("other")}</option>
          </select>

          <select
            className="input"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
          >
            <option value="">{t("duration")}</option>
            <option value="1">{t("oneDay")}</option>
            <option value="2-3">{t("twoThreeDays")}</option>
            <option value="4+">{t("moreThanFour")}</option>
          </select>

          <select
            className="input"
            value={form.severity}
            onChange={(e) => setForm({ ...form, severity: e.target.value })}
          >
            <option value="">{t("severity")}</option>
            <option value="low">{t("low")}</option>
            <option value="medium">{t("medium")}</option>
            <option value="high">{t("high")}</option>
          </select>

          <div>
            <p className="font-medium mb-1">{t("selectSymptoms")}</p>
            <div className="grid grid-cols-2 gap-2">
              {symptomList.map((s) => (
                <label key={s} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.symptoms.includes(s)}
                    onChange={() => toggleSymptom(s)}
                  />
                  {t(s)}
                </label>
              ))}
            </div>
          </div>

          <textarea
            placeholder={t("additionalNotes")}
            className="input"
            rows={3}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white py-2 rounded"
          >
            {t("checkSymptoms")}
          </button>

          <p className="text-xs text-gray-500">
            {t("medicalDisclaimer")}
          </p>

        </div>
      </div>
    </div>
  );
}