import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 2 hours in milliseconds
const SESSION_DURATION = 2 * 60 * 60 * 1000; 

export default function useAutoLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Get or initialize the login timestamp
    let loginTime = localStorage.getItem("loginTime");
    if (!loginTime) {
      loginTime = Date.now().toString();
      localStorage.setItem("loginTime", loginTime);
    }

    // Calculate time elapsed and remaining
    const timeElapsed = Date.now() - parseInt(loginTime, 10);
    const timeRemaining = SESSION_DURATION - timeElapsed;

    const performLogout = () => {
      // Preserve language setting if it exists, clear the rest
      const lang = localStorage.getItem("language");
      localStorage.clear();
      if (lang) localStorage.setItem("language", lang);
      
      navigate("/");
    };

    // If 2 hours have already passed, log out immediately
    if (timeRemaining <= 0) {
      performLogout();
      return;
    }

    // Otherwise, schedule logout for when the 2 hours expire
    const timer = setTimeout(performLogout, timeRemaining);

    return () => clearTimeout(timer);
  }, [navigate]);
}
