import React, { useEffect } from 'react';
import { Link } from 'wasp/client/router';
import './LandingPage.css';

const LandingPage = () => {
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          (e.target as HTMLElement).style.transitionDelay = `${i * 0.07}s`;
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

    return () => obs.disconnect();
  }, []);

  return (
    <div className="landing-page">
      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <section className="hero">
        <div className="orb of oa" style={{ width: '420px', height: '420px', background: 'var(--coral)', top: '-160px', right: '-130px' }}></div>
        <div className="orb of ob" style={{ width: '300px', height: '300px', background: 'var(--sky)', bottom: '30px', left: '-90px' }}></div>
        <div className="orb of oc" style={{ width: '180px', height: '180px', background: 'var(--lime)', top: '32%', right: '-50px' }}></div>
        <div className="orb os oa" style={{ width: '260px', height: '260px', borderColor: 'var(--mint)', top: '16%', left: '8%', animationDelay: '1s' }}></div>
        <div className="orb os ob" style={{ width: '140px', height: '140px', borderColor: 'var(--pink)', bottom: '18%', right: '10%', animationDelay: '2s' }}></div>

        <img 
          src="https://nextcloud.magor-lab.hu/apps/files_sharing/publicpreview/LcbnaKPS5qWmSBa?file=/&fileId=400&x=2560&y=1440&a=true&etag=df0dbbb60f7691dcadc0ecb6447a0e6f" 
          alt="ShareIt Logo" 
          title="ShareIt" 
          className="site-logo" 
        />

        <div className="hero-eyebrow">ShareIt · Csatlakozz most</div>
        <h1>
          <span className="block">Elfogyott a neted?.</span>
          <span className="block lime">Csatlakozz most!</span>
        </h1>
        <p className="hero-sub" style={{ color: 'white' }}>
          A Sharelt az internet Uber-je, bárki megfizethetően vásárolhatja meg mások kihasználatlan Wi-Fi sávszélességét.
        </p>
        <div className="hero-cta">
          <a href="#steps" className="btn">Mutatom, hogyan ↓</a>
        </div>
        <div className="scroll-hint">
          <span>Görgess</span>
          <div className="arrow"></div>
        </div>
      </section>

      <div className="band"></div>

      {/* ══ STEPS ══════════════════════════════════════════════════ */}
      <section id="steps" className="steps-section">
        <div className="orb of oa" style={{ width: '340px', height: '340px', background: 'var(--sky)', top: '-120px', right: '-100px' }}></div>
        <div className="orb of ob" style={{ width: '240px', height: '240px', background: 'var(--lime)', bottom: '-80px', left: '-80px' }}></div>
        <div className="orb os oc" style={{ width: '160px', height: '160px', borderColor: 'var(--coral)', top: '40%', right: '4%' }}></div>
        <div className="orb os oa" style={{ width: '100px', height: '100px', borderColor: 'var(--pink)', bottom: '20%', left: '4%', animationDelay: '1.5s' }}></div>

        <div className="steps-inner">
          <span className="steps-label reveal">Így működik</span>
          <h2 className="steps-title reveal">4 egyszerű lépés.<br />Ennyi.</h2>

          <div className="step-list">
            {/* STEP 1: LOGIN */}
            <div className="step-item reveal">
              <div className="step-left"><div className="step-num">1</div></div>
              <div className="step-body">
                <span className="step-icon-big">👤</span>
                <h3>Bejelentkezés</h3>
                <p>Kattitns a jobb felső sarokban lévő bejelentkezés gombra! Haszálhatod a Google fiókodat, az egyszerű, gördülékeny bejelentkezéshez! Csak néhány kattintás és bent is vagy!</p>
                <div className="badge-row">
                  <div className="social-badge">
                    <svg width="17" height="17" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google fiókkal
                  </div>
                </div>
                <span className="badge-note">Nincs szükség új jelszóra vagy hosszú regisztrációra.</span>
              </div>
            </div>

            {/* STEP 2: PAY */}
            <div className="step-item reveal">
              <div className="step-left"><div className="step-num">2</div></div>
              <div className="step-body">
                <span className="step-icon-big">💳</span>
                <h3>Fizetsz</h3>
                <p>Egyszerű, biztonságos online fizetés — egyetlen kattintással. nincs előfizetés, nincs elköteleződés. Fizess akár kártyáddal vagy vedd igénybe a Google vagy Apple pay-t.</p>
                <div className="badge-row">
                  <div className="social-badge">
                    <svg width="17" height="17" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google Pay
                  </div>
                  <div className="pay-badge applepay">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-apple" viewBox="0 0 16 16">
                      <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282" />
                    </svg>
                    Apple Pay
                  </div>
                  <div className="pay-badge card">
                    💳 Bankkártya
                  </div>
                </div>
                <span className="badge-note" style={{ color: '#8a90aa' }}>Biztonságos, titkosított fizetés. Adataid soha nem kerülnek tárolásra.</span>
              </div>
            </div>

            {/* STEP 3: SELECT */}
            <div className="step-item reveal">
              <div className="step-left"><div className="step-num">3</div></div>
              <div className="step-body">
                <span className="step-icon-big">📊</span>
                <h3>Kiválasztod, mennyit szeretnél</h3>
                <p>500 MB, 1 GB, 5 GB — Válassz tetszőleges mennyiséget, amennyit te szeretnél. Nincs felesleg, csak annyit fizetsz amennyit megadtál</p>
              </div>
            </div>

            {/* STEP 4: ONLINE */}
            <div className="step-item reveal">
              <div className="step-left"><div className="step-num">4</div></div>
              <div className="step-body">
                <span className="step-icon-big">🚀</span>
                <h3>Netezesz</h3>
                <p>Fizetés után azonnal felhasználható! nincs várakozás vagy késés! Gyors stabil internet azonnal!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="band"></div>

      {/* ══ CTA ════════════════════════════════════════════════════ */}
      <section className="cta-section">
        <div className="orb of oa" style={{ width: '400px', height: '400px', background: 'var(--coral)', top: '-140px', right: '-120px' }}></div>
        <div className="orb of ob" style={{ width: '280px', height: '280px', background: 'var(--sky)', bottom: '-100px', left: '-80px' }}></div>
        <div className="orb os oc" style={{ width: '180px', height: '180px', borderColor: 'var(--lime)', top: '25%', left: '6%' }}></div>
        <div className="orb os oa" style={{ width: '120px', height: '120px', borderColor: 'var(--pink)', bottom: '22%', right: '6%', animationDelay: '1.5s' }}></div>

        <div className="cta-inner">
          <h2 className="reveal">Próbáld ki most!</h2>
          
          <div className="reveal">
            <Link to="/login" className="btn">Bejelentkezés</Link>
            <a href="#" className="btn-outline">Vissza a tetejére</a>
          </div>
        </div>
      </section>

      <footer>
        <p>© 2026 <Link to="/">ShareIt</Link> · Tóth András & Füvesi Magor · Minden jog fenntartva</p>
      </footer>
    </div>
  );
};

export default LandingPage;
