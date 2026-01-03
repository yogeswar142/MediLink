import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const IDLE_TIME = 15 * 60 * 1000; // 15 minutes

export default function useAutoLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        localStorage.clear();
        navigate("/");
      }, IDLE_TIME);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);

    resetTimer();

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, []);
}
