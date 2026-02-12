import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLanding from "./pages/AuthLanding";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SymptomChecker from "./pages/SymptomChecker";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthLanding />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/symptom-checker" element={<SymptomChecker />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

