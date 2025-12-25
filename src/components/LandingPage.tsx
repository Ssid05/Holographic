import { useState, useEffect, useRef } from 'react';
import './LandingPage.css';

interface Props {
  onEnterDemo: () => void;
}

function useCountUp(end: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!start) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start]);
  
  return count;
}

export default function LandingPage({ onEnterDemo }: Props) {
  const [scrollY, setScrollY] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLElement>(null);

  const fps = useCountUp(30, 2000, statsVisible);
  const apps = useCountUp(6, 1500, statsVisible);
  const landmarks = useCountUp(21, 2000, statsVisible);
  const latency = useCountUp(200, 2000, statsVisible);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing-page">
      <nav className="apple-nav">
        <div className="nav-content">
          <a href="#" className="nav-logo">Holo AI</a>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#modules">Modules</a>
            <a href="#demo">Demo</a>
            <a href="#about">About</a>
          </div>
          <button className="nav-cta" onClick={onEnterDemo}>Try Demo</button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-line">The Future of</span>
            <span className="title-line gradient-text">Human-Computer</span>
            <span className="title-line gradient-text">Interaction</span>
          </h1>
          <p className="hero-subtitle">
            AI-Driven Multimodal Holographic Interface. Gesture control. Voice commands. 
            Zero physical contact. Pure innovation.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={onEnterDemo}>
              Experience Demo
            </button>
            <a href="#features" className="btn-secondary">
              Learn More
            </a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="holo-sphere">
            <div className="sphere-ring ring-1"></div>
            <div className="sphere-ring ring-2"></div>
            <div className="sphere-ring ring-3"></div>
            <div className="sphere-core">AI</div>
          </div>
        </div>
        <div className="scroll-indicator">
          <span>Scroll to explore</span>
          <div className="scroll-arrow"></div>
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="section-header">
          <h2>Revolutionary Interaction</h2>
          <p>Experience computing without boundaries</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 1 1 3 0m-3 6a1.5 1.5 0 1 0-3 0v2a6 6 0 0 0 12 0v-5.5a1.5 1.5 0 0 0-3 0m-3-3.5V14m0-9.5v0a1.5 1.5 0 1 1 3 0v9.5" />
              </svg>
            </div>
            <h3>Gesture Control</h3>
            <p>Navigate seamlessly with natural hand movements. Point, pinch, and interact without touching any surface.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </div>
            <h3>Voice Commands</h3>
            <p>Speak naturally and let AI understand. Advanced speech recognition for hands-free operation.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <h3>Holographic UI</h3>
            <p>Floating 3D interfaces that respond to your every move. A futuristic visual experience.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3>Contactless Security</h3>
            <p>Hand registration system ensures only you can access the interface. Secure and hygienic.</p>
          </div>
        </div>
      </section>

      <section className="stats-section" ref={statsRef}>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">{fps}</span>
            <span className="stat-label">FPS Gesture Detection</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{apps}</span>
            <span className="stat-label">Integrated Apps</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{landmarks}</span>
            <span className="stat-label">Hand Landmarks</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">&lt;{latency}</span>
            <span className="stat-label">ms Voice Latency</span>
          </div>
        </div>
      </section>

      <section id="modules" className="modules-section">
        <div className="section-header">
          <h2>Five Powerful Modules</h2>
          <p>A complete multimodal interaction ecosystem</p>
        </div>
        <div className="modules-list">
          <div className="module-item">
            <div className="module-number">01</div>
            <div className="module-content">
              <h3>Gesture Detection System</h3>
              <p>Powered by MediaPipe AI for real-time hand tracking. Detects pinch, point, and fist gestures with high accuracy.</p>
            </div>
          </div>
          <div className="module-item">
            <div className="module-number">02</div>
            <div className="module-content">
              <h3>Voice Command System</h3>
              <p>Natural language processing with Web Speech API. Continuous listening mode with text-to-speech feedback.</p>
            </div>
          </div>
          <div className="module-item">
            <div className="module-number">03</div>
            <div className="module-content">
              <h3>Holographic UI Simulation</h3>
              <p>Floating 3D-like interfaces with glassmorphism design. 60fps smooth animations and depth effects.</p>
            </div>
          </div>
          <div className="module-item">
            <div className="module-number">04</div>
            <div className="module-content">
              <h3>Interaction Engine</h3>
              <p>Intelligent mapping of multimodal inputs to UI actions. Seamless fusion of gesture and voice commands.</p>
            </div>
          </div>
          <div className="module-item">
            <div className="module-number">05</div>
            <div className="module-content">
              <h3>System Dashboard</h3>
              <p>Real-time monitoring of system status, performance metrics, and configuration controls.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="demo" className="demo-section">
        <div className="demo-badge">Interactive Experience</div>
        <h2 className="demo-title">Experience the Future</h2>
        <p className="demo-subtitle">
          Step into a world where technology responds to your natural movements. 
          Our holographic interface transforms how you interact with digital systems.
        </p>
        
        <div className="demo-showcase">
          <div className="showcase-visual">
            <div className="holo-interface">
              <div className="interface-glow"></div>
              <div className="floating-hand">
                <svg viewBox="0 0 100 120" fill="none">
                  <path d="M50 10 L50 35 M35 25 L35 50 M65 25 L65 50 M25 40 L25 60 M75 40 L75 60" 
                        stroke="url(#handGradient)" strokeWidth="8" strokeLinecap="round"/>
                  <ellipse cx="50" cy="85" rx="35" ry="25" stroke="url(#handGradient)" strokeWidth="4" fill="none"/>
                  <defs>
                    <linearGradient id="handGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00d4ff"/>
                      <stop offset="100%" stopColor="#0071e3"/>
                    </linearGradient>
                  </defs>
                </svg>
                <div className="hand-pulse"></div>
              </div>
              <div className="interface-apps">
                <div className="floating-app app-1">🤖</div>
                <div className="floating-app app-2">🌤️</div>
                <div className="floating-app app-3">🔢</div>
                <div className="floating-app app-4">📝</div>
                <div className="floating-app app-5">🎵</div>
                <div className="floating-app app-6">⚙️</div>
              </div>
              <div className="voice-wave">
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
                <div className="wave-bar"></div>
              </div>
            </div>
          </div>
          
          <div className="showcase-features">
            <div className="showcase-feature">
              <div className="feature-num">01</div>
              <div className="feature-detail">
                <h4>Gesture Navigation</h4>
                <p>Point to hover, pinch to select. Natural hand movements control the entire interface.</p>
              </div>
            </div>
            <div className="showcase-feature">
              <div className="feature-num">02</div>
              <div className="feature-detail">
                <h4>Voice Commands</h4>
                <p>Speak naturally. AI understands and responds with text-to-speech feedback.</p>
              </div>
            </div>
            <div className="showcase-feature">
              <div className="feature-num">03</div>
              <div className="feature-detail">
                <h4>6 Built-in Apps</h4>
                <p>Assistant, Weather, Calculator, Notes, Music, and System Dashboard.</p>
              </div>
            </div>
            <div className="showcase-feature">
              <div className="feature-num">04</div>
              <div className="feature-detail">
                <h4>Real-time Tracking</h4>
                <p>21-point hand skeleton detection at 30 FPS for precise gesture recognition.</p>
              </div>
            </div>
          </div>
        </div>
        
        <button className="demo-cta" onClick={onEnterDemo}>
          <span className="cta-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>
            </svg>
          </span>
          <span className="cta-text">Launch Interactive Demo</span>
          <span className="cta-arrow">→</span>
        </button>
      </section>

      <section id="about" className="about-section">
        <div className="about-content">
          <div className="about-badge">Academic Project</div>
          <h2>AI-Driven Multimodal Holographic Human-Computer Interaction System</h2>
          <div className="about-details">
            <div className="detail-item">
              <span className="detail-label">Course</span>
              <span className="detail-value">B.Tech CSE AI ML DL</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Domain</span>
              <span className="detail-value">Artificial Intelligence, Computer Vision, HCI</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Technologies</span>
              <span className="detail-value">React, TypeScript, MediaPipe, Web Speech API</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="apple-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">Holo AI</span>
            <p>AI-Driven Multimodal Holographic Interface</p>
          </div>
          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#modules">Modules</a>
            <a href="#demo">Demo</a>
            <a href="#about">About</a>
          </div>
          <div className="footer-copyright">
            <p>B.Tech CSE AI ML DL Project</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
