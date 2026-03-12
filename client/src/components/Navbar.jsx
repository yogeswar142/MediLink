import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Navbar({ role }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const name = localStorage.getItem("fullName") || "User";

  return (
    <nav className="glass sticky top-0 z-50 flex items-center justify-between px-6 py-4 mb-8 rounded-b-xl border-t-0">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(role === 'doctor' ? '/doctor/home' : '/home')}>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <span className="font-bold text-white text-sm">ML</span>
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300 tracking-tight">
          MediLink {role === 'doctor' && <span className="text-sm font-medium text-emerald-400 ml-1">for Doctors</span>}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-300 hidden sm:block">
          Welcome, {name}
        </span>
        <button
          onClick={handleLogout}
          className="text-sm px-4 py-1.5 rounded-full border border-slate-600 hover:bg-slate-700/50 hover:border-slate-400 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
