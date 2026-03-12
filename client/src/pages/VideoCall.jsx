import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { io } from "socket.io-client";
import Modal from "../components/Modal";
import RatingStars from "../components/RatingStars";

import API_BASE_URL from "../api";

// For MVP, we will simulate a local media stream and mock WebRTC or use a dummy interface if camera fails
export default function VideoCall() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("room");
  
  const role = localStorage.getItem("role"); // 'patient' or 'doctor'
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("fullName");

  const [socket, setSocket] = useState(null);
  const [remoteName, setRemoteName] = useState("Connected User");
  const [chat, setChat] = useState([]);
  const [msg, setMsg] = useState("");
  const [disconnected, setDisconnected] = useState(false);
  const [timer, setTimer] = useState(300); // 5 mins
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const s = io(API_BASE_URL);
    setSocket(s);

    const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
    let peerConnection = new RTCPeerConnection(config);
    let localStream;

    s.on("offer", async (offer) => {
      try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        s.emit("answer", answer);
      } catch (err) { console.error("WebRTC offer err", err); }
    });

    s.on("answer", async (answer) => {
      try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (err) { console.error("WebRTC answer err", err); }
    });

    s.on("ice-candidate", async (candidate) => {
      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) { console.error("WebRTC ice err", err); }
    });

    s.on("user-connected", async ({ name }) => {
      setRemoteName(name);
      setDisconnected(false);
      setTimer(300);
      
      try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        s.emit("offer", offer);
      } catch (err) { console.error("WebRTC create offer err", err); }
    });

    s.on("user-disconnected", () => setDisconnected(true));
    s.on("user-reconnected", ({ name }) => { setRemoteName(name); setDisconnected(false); setTimer(300); });
    s.on("chat-message", (message) => setChat(prev => [...prev, message]));
    s.on("session-ended", () => {
      if (role === "patient") setShowRating(true);
    });

    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current && remoteVideoRef.current.srcObject !== event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) s.emit("ice-candidate", event.candidate);
    };

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localStream = stream;
        if(localVideoRef.current) localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

        s.emit("join-room", { roomId, userId, role, name: userName });
        if (role === 'doctor') s.emit("session-started");
      })
      .catch(err => {
        console.log("Camera access denied or unvailable:", err);
        s.emit("join-room", { roomId, userId, role, name: userName });
        if (role === 'doctor') s.emit("session-started");
      });

    return () => {
      s.disconnect();
      if (peerConnection) peerConnection.close();
      if (localStream) localStream.getTracks().forEach(t => t.stop());
    };
  }, [roomId, role, userId, userName]);

  useEffect(() => {
    if (disconnected && timer > 0) {
      const int = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(int);
    }
  }, [disconnected, timer]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!msg.trim()) return;
    const message = { text: msg, sender: userName, isMe: false };
    socket.emit("chat-message", message);
    setChat(prev => [...prev, { ...message, isMe: true }]);
    setMsg("");
  };

  const endSession = () => {
    socket.emit("session-ended"); // notify the other party immediately!
    if (role === "doctor") {
      navigate("/doctor/dashboard");
    } else {
      navigate("/home");
    }
  };

  const submitRating = () => {
    alert("Thank you for your feedback!");
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'prescription.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    navigate("/home");
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="h-screen bg-slate-900 flex flex-col pt-4 pb-4 px-4 overflow-hidden relative text-slate-100">
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-3xl opacity-50 mix-blend-screen -z-10"></div>
      
      {/* Header */}
      <div className="glass rounded-xl p-4 flex justify-between items-center z-10 mx-auto max-w-7xl w-full mb-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center font-bold">ML</div>
          <div>
            <h2 className="font-semibold text-lg">{remoteName || "Connecting..."}</h2>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className={`w-2 h-2 rounded-full ${disconnected ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
              {disconnected ? `Disconnected - Waiting ${formatTime(timer)}` : "Secure Connection"}
            </div>
          </div>
        </div>
        
        <button onClick={endSession} className="bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white px-6 py-2 rounded-lg font-medium transition-all shadow-lg">
          {t("endSession") || "End Session"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 max-w-7xl w-full mx-auto h-[calc(100vh-120px)]">
        {/* Videos */}
        <div className="flex-1 flex flex-col gap-4 relative">
          <div className="relative flex-1 bg-black rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl">
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover opacity-80" />
            
            {disconnected && (
              <div className="absolute inset-0 bg-slate-900/80 backdrop-blur flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-slate-600 border-t-amber-500 rounded-full animate-spin mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">{remoteName} disconnected</h3>
                <p className="text-amber-400 font-mono text-xl">{formatTime(timer)}</p>
              </div>
            )}
            
            <div className="absolute bottom-4 left-4 bg-slate-900/60 backdrop-blur px-3 py-1 rounded-md text-sm">
              {remoteName || "Remote"}
            </div>
          </div>
          
          <div className="absolute bottom-6 right-6 w-32 sm:w-48 aspect-video bg-slate-800 rounded-xl overflow-hidden shadow-2xl border-2 border-slate-600/50">
            <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute bottom-2 left-2 bg-slate-900/60 backdrop-blur px-2 py-0.5 rounded text-xs">
              You
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="lg:w-96 glass rounded-2xl flex flex-col h-64 lg:h-auto z-10">
          <div className="p-4 border-b border-slate-700/50">
            <h3 className="font-semibold text-slate-200">Session Chat</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {chat.map((m, i) => (
              <div key={i} className={`flex flex-col ${m.isMe ? 'items-end' : 'items-start'}`}>
                <span className="text-xs text-slate-400 mb-1">{m.sender}</span>
                <div className={`px-4 py-2 rounded-2xl max-w-[85%] ${m.isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-100 rounded-bl-none'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          
          <form onSubmit={sendMessage} className="p-4 border-t border-slate-700/50 flex gap-2">
            <input 
              value={msg} 
              onChange={e => setMsg(e.target.value)}
              placeholder={t("chatHere") || "Type a message..."} 
              className="flex-1 bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-500"
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 w-10 h-10 rounded-xl flex items-center justify-center text-white transition-colors">
              <svg className="w-5 h-5 translate-x-px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>

      <Modal isOpen={showRating} title={t("rateSession") || "Post-Session Feedback"}>
        <div className="flex flex-col items-center">
          <p className="text-slate-300 mb-6 text-center">Your consultation with Dr. {remoteName} has ended. Please rate your experience.</p>
          <RatingStars rating={rating} setRating={setRating} />
          <div className="w-full mt-8 flex flex-col gap-3">
             <button onClick={submitRating} className="btn-primary flex items-center justify-center gap-2">
               <span>⬇️</span>
               {t("downloadPrescription") || "Download Prescription & Finish"}
             </button>
          </div>
        </div>
      </Modal>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 10px; }
      `}</style>
    </div>
  );
}
