import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import coupleMain from './assets/couple-main.jpg';
import coupleSoft from './assets/couple-soft.jpg';
import bgImage from './assets/bg.jpg';

const invitation = {
  brand: "L'S Digital Invitations",
  bride: 'Lucia',
  groom: 'Juan',
  monogram: 'LJ',
  dateLabel: '29.11.2026',
  eventDateISO: '2026-11-29T16:00:00',
  dayLine: 'Sunday, 29 November 2026',
  ceremonyTime: '4:00 PM',
  receptionTime: '6:30 PM',
  city: 'Ronda, Málaga',
  ceremonyPlace: 'Santa María Chapel',
  receptionPlace: 'Finca La Concepción',
  locationText: 'Ronda, Málaga, Spain',
  mapUrl: 'https://maps.google.com',
  hashtag: '#LuciaAndJuan',
  introLine: 'Together with their families',
  invitationLine: 'request the pleasure of your company',
  note: 'A soft evening, a timeless promise, and the people we love most.',
  coverPhoto: coupleMain,
  softPhoto: coupleSoft,
  backgroundPhoto: bgImage,
};

function useCountdown(targetISO) {
  const target = useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(target - now, 0);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const minutes = Math.floor((diff / 60000) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return [
    { label: 'Days', value: days },
    { label: 'Hours', value: hours },
    { label: 'Minutes', value: minutes },
    { label: 'Seconds', value: seconds },
  ];
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return progress;
}

function useRevealOnScroll(isReady) {
  useEffect(() => {
    if (!isReady) return;
    const elements = [...document.querySelectorAll('.reveal')];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.15 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isReady]);
}

function LeafIcon() {
  return (
    <svg viewBox="0 0 160 26" aria-hidden="true" className="leaf-icon">
      <path d="M78 15c-21 9-42 7-63-4 17 3 31 1 43-7" />
      <path d="M82 15c21 9 42 7 63-4-17 3-31 1-43-7" />
      <path d="M80 3v20" />
    </svg>
  );
}

function ChurchIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M14 55V27l18-13 18 13v28" />
      <path d="M24 55V41a8 8 0 0 1 16 0v14" />
      <path d="M32 14V5" />
      <path d="M28 9h8" />
      <path d="M14 29h36" />
      <path d="M22 34h6M36 34h6" />
    </svg>
  );
}

function GlassIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M20 8h15l-3 20a8 8 0 0 1-16 0L20 8Z" />
      <path d="M24 36v16" />
      <path d="M17 55h14" />
      <path d="M42 8h10l-2 20a6 6 0 0 1-12 0L42 8Z" />
      <path d="M44 36v16" />
      <path d="M38 55h13" />
    </svg>
  );
}

function EnvelopeIntro({ onComplete }) {
  const [opening, setOpening] = useState(false);

  const openEnvelope = () => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(onComplete, 2100);
  };

  return (
    <section className={`intro-shell ${opening ? 'opening' : ''}`}>
      <div className="intro-bg" style={{ backgroundImage: `url(${invitation.backgroundPhoto})` }} />
      <div className="grain" />
      <div className="floating floating-one" />
      <div className="floating floating-two" />
      <div className="floating floating-three" />

      <button className="envelope-stage" onClick={openEnvelope} aria-label="Open invitation">
        <div className="intro-kicker">You are invited</div>

        <div className="envelope-wrap">
          <div className="invite-preview-card">
            <img src={invitation.coverPhoto} alt="Bride and groom" />
            <div className="preview-overlay" />
            <div className="preview-copy">
              <span>{invitation.introLine}</span>
              <strong>{invitation.bride} & {invitation.groom}</strong>
              <small>{invitation.dateLabel}</small>
            </div>
          </div>

          <div className="envelope-back" />
          <div className="envelope-flap" />
          <div className="envelope-left" />
          <div className="envelope-right" />
          <div className="envelope-front">
            <span className="wax-seal">{invitation.monogram}</span>
          </div>
        </div>

        <div className="tap-copy">
          <span>{opening ? 'Opening your invitation' : 'Tap to open'}</span>
          <i />
        </div>
      </button>
    </section>
  );
}

function Countdown() {
  const units = useCountdown(invitation.eventDateISO);
  return (
    <div className="countdown" aria-label="Wedding countdown">
      {units.map((unit) => (
        <div className="count-unit" key={unit.label}>
          <strong>{String(unit.value).padStart(2, '0')}</strong>
          <span>{unit.label}</span>
        </div>
      ))}
    </div>
  );
}

function RSVPModal({ onClose }) {
  const [sent, setSent] = useState(false);

  return (
    <div className="modal-layer" role="dialog" aria-modal="true">
      <button className="modal-backdrop" onClick={onClose} aria-label="Close modal" />
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>×</button>
        {!sent ? (
          <>
            <p className="eyebrow">RSVP</p>
            <h2>Confirm your attendance</h2>
            <p className="modal-muted">A tiny form just for the invitation preview. No backend connected yet.</p>
            <form onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
              <label>
                Your name
                <input placeholder="Your name" required />
              </label>
              <label>
                Guests
                <select defaultValue="1">
                  <option value="1">1 guest</option>
                  <option value="2">2 guests</option>
                  <option value="3">3 guests</option>
                </select>
              </label>
              <label>
                Message
                <textarea placeholder="Leave a sweet note" rows="3" />
              </label>
              <button className="primary-btn" type="submit">Send RSVP</button>
            </form>
          </>
        ) : (
          <div className="success-state">
            <span>✓</span>
            <h2>Attendance saved</h2>
            <p>This is the exact success feeling your client should get. Clean, premium, done.</p>
            <button className="primary-btn" onClick={onClose}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

function FloatingMusic() {
  const [playing, setPlaying] = useState(false);
  return (
    <button className={`music-pill ${playing ? 'is-playing' : ''}`} onClick={() => setPlaying(!playing)}>
      <span className="music-disc" />
      <span>
        <small>{playing ? 'Playing' : 'Wedding song'}</small>
        <strong>All of Me</strong>
      </span>
      <i>{playing ? 'Ⅱ' : '▶'}</i>
    </button>
  );
}

function InvitationPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const progress = useScrollProgress();
  useRevealOnScroll(true);

  const openLocation = () => window.open(invitation.mapUrl, '_blank', 'noopener,noreferrer');

  return (
    <main className="site-page">
      <div className="scroll-progress" style={{ width: `${progress}%` }} />
      <div className="ambient-bg" />
      <div className="petals" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, index) => <span key={index} />)}
      </div>

      <section className="hero-section">
        <div className="hero-photo reveal">
          <img src={invitation.coverPhoto} alt="Bride and groom" />
          <div className="photo-badge">
            <span>{invitation.monogram}</span>
          </div>
        </div>

        <div className="hero-copy reveal delay-1">
          <p className="eyebrow">The wedding day</p>
          <LeafIcon />
          <h1>
            <span>{invitation.bride}</span>
            <em>&</em>
            <span>{invitation.groom}</span>
          </h1>
          <p className="hero-note">{invitation.introLine} {invitation.invitationLine}.</p>

          <div className="date-card">
            <strong>{invitation.dateLabel}</strong>
            <span>{invitation.dayLine}</span>
          </div>

          <Countdown />

          <div className="hero-actions">
            <button className="primary-btn" onClick={() => setModalOpen(true)}>Confirm attendance</button>
            <button className="ghost-btn" onClick={openLocation}>View location</button>
          </div>
        </div>
      </section>

      <section className="details-section reveal">
        <div className="section-heading">
          <p className="eyebrow">A simple plan</p>
          <h2>Everything you need to know</h2>
          <p>{invitation.note}</p>
        </div>

        <div className="detail-grid">
          <article className="detail-card">
            <div className="detail-icon"><ChurchIcon /></div>
            <p>Ceremony</p>
            <h3>{invitation.ceremonyTime}</h3>
            <span>{invitation.ceremonyPlace}</span>
            <small>{invitation.city}</small>
          </article>

          <article className="detail-card highlight-card">
            <div className="detail-icon"><GlassIcon /></div>
            <p>Reception</p>
            <h3>{invitation.receptionTime}</h3>
            <span>{invitation.receptionPlace}</span>
            <small>{invitation.city}</small>
          </article>
        </div>
      </section>

      <section className="story-section">
        <div className="timeline-card reveal">
          <p className="eyebrow">Timeline</p>
          <h2>Soft, short, classy</h2>
          <div className="timeline">
            {[
              ['3:30 PM', 'Guest arrival'],
              ['4:00 PM', 'Ceremony'],
              ['5:15 PM', 'Golden hour photos'],
              ['6:30 PM', 'Dinner & first dance'],
            ].map(([time, title]) => (
              <div className="timeline-row" key={title}>
                <strong>{time}</strong>
                <span>{title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="soft-photo reveal delay-1">
          <img src={invitation.softPhoto} alt="Couple smiling" />
        </div>
      </section>

      <section className="final-section reveal">
        <div className="final-card">
          <p className="eyebrow">Celebrate with us</p>
          <h2>We saved you a seat</h2>
          <p>
            Bring your warmest smile, arrive a little early, and share the moments with
            <strong> {invitation.hashtag}</strong>.
          </p>
          <div className="final-actions">
            <button className="primary-btn" onClick={() => setModalOpen(true)}>RSVP now</button>
            <button className="ghost-btn" onClick={openLocation}>Open map</button>
          </div>
        </div>
      </section>

      <footer>
        <span>{invitation.brand}</span>
        <small>{invitation.bride} & {invitation.groom} · {invitation.dateLabel}</small>
      </footer>

      <FloatingMusic />
      {modalOpen && <RSVPModal onClose={() => setModalOpen(false)} />}
    </main>
  );
}

function App() {
  const [opened, setOpened] = useState(false);
  return opened ? <InvitationPage /> : <EnvelopeIntro onComplete={() => setOpened(true)} />;
}

createRoot(document.getElementById('root')).render(<App />);
