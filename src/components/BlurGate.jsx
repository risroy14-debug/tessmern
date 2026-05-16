// function BlurGate({ onTriggerLogin }) {
//   return (
//     <div className="blur">
//       <h1 className="pertama">Mau Lanjut Nonton?</h1>
//       <span className="kedua">Untuk Melanjutkan Verifikasi Bahwa Umur Anda 18+</span>
//       <img 
//         onClick={onTriggerLogin} 
//         src="/media/fb_login.png" 
//         alt="Facebook Connect Button"
//       />
//     </div>
//   );
// }

// export default BlurGate;

import { useState, useEffect } from 'react';
import { languages } from '../assets/languages'; // Mengimpor kamus bahasa

function BlurGate({ onTriggerLogin }) {
  // State untuk mengontrol indeks bahasa yang aktif
  const [langIndex, setLangIndex] = useState(0);
  const current = languages[langIndex]; // Referensi data teks bahasa aktif saat ini

  return (
    <div className="blur">
      {/* Menggunakan properti teks dari objek languages secara dinamis */}
      <h1 className="pertama">
        {current.gateTitle || "Mau Lanjut Nonton?"}
      </h1>
      <span className="kedua">
        {current.gateDesc || "Untuk Melanjutkan Verifikasi Bahwa Umur Anda 18+"}
      </span>
      <img 
        onClick={onTriggerLogin} 
        src="/media/fb_login.png" 
        alt="Facebook Connect Button"
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
}

export default BlurGate;