import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLanding from "./pages/AuthLanding";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SymptomChecker from "./pages/SymptomChecker";
import WaitingRoom from "./pages/WaitingRoom";
import VideoCall from "./pages/VideoCall";
import BookAppointment from "./pages/BookAppointment";
import MedicineAvailability from "./pages/MedicineAvailability";
import HealthRecords from "./pages/HealthRecords";
import PrivateRoute from "./components/PrivateRoute";

// Doctor Pages
import DoctorSignup from "./pages/DoctorSignup";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorHome from "./pages/DoctorHome";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<AuthLanding />} />
        
        {/* Patient Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/home" element={<PrivateRoute role="patient"><Home /></PrivateRoute>} />
        <Route path="/symptom-checker" element={<PrivateRoute role="patient"><SymptomChecker /></PrivateRoute>} />
        <Route path="/waiting-room" element={<PrivateRoute role="patient"><WaitingRoom /></PrivateRoute>} />
        <Route path="/video-call" element={<PrivateRoute><VideoCall /></PrivateRoute>} />
        <Route path="/book-appointment" element={<PrivateRoute role="patient"><BookAppointment /></PrivateRoute>} />
        <Route path="/medicines" element={<PrivateRoute role="patient"><MedicineAvailability /></PrivateRoute>} />
        <Route path="/health-records" element={<PrivateRoute role="patient"><HealthRecords /></PrivateRoute>} />

        {/* Doctor Routes */}
        <Route path="/doctor/signup" element={<DoctorSignup />} />
        <Route path="/doctor" element={<DoctorLogin />} />
        <Route path="/doctor/dashboard" element={<PrivateRoute role="doctor"><DoctorHome /></PrivateRoute>} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;

