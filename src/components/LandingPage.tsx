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
                <div className="floating-app app-1">
                  <svg viewBox="0 0 120 120" className="preview-icon">
                    <defs>
                      <linearGradient id="previewAssist" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#667eea"/>
                        <stop offset="100%" stopColor="#764ba2"/>
                      </linearGradient>
                    </defs>
                    <rect x="8" y="8" width="104" height="104" rx="24" fill="url(#previewAssist)"/>
                    <circle cx="60" cy="60" r="22" fill="rgba(255,255,255,0.2)"/>
                    <circle cx="60" cy="60" r="14" fill="white"/>
                    <circle cx="60" cy="35" r="5" fill="white" opacity="0.9"/>
                    <circle cx="60" cy="85" r="5" fill="white" opacity="0.9"/>
                    <circle cx="35" cy="60" r="5" fill="white" opacity="0.9"/>
                    <circle cx="85" cy="60" r="5" fill="white" opacity="0.9"/>
                  </svg>
                </div>
                <div className="floating-app app-2">
                  <svg viewBox="0 0 120 120" className="preview-icon">
                    <defs>
                      <linearGradient id="previewWeather" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#56CCF2"/>
                        <stop offset="100%" stopColor="#2F80ED"/>
                      </linearGradient>
                      <linearGradient id="previewSun" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFE259"/>
                        <stop offset="100%" stopColor="#FFA751"/>
                      </linearGradient>
                    </defs>
                    <rect x="8" y="8" width="104" height="104" rx="24" fill="url(#previewWeather)"/>
                    <circle cx="45" cy="45" r="18" fill="url(#previewSun)"/>
                    <ellipse cx="70" cy="72" rx="28" ry="18" fill="white"/>
                    <ellipse cx="55" cy="68" rx="18" ry="14" fill="white"/>
                  </svg>
                </div>
                <div className="floating-app app-3">
                  <svg viewBox="0 0 120 120" className="preview-icon">
                    <defs>
                      <linearGradient id="previewCalc" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#434343"/>
                        <stop offset="100%" stopColor="#1a1a1a"/>
                      </linearGradient>
                    </defs>
                    <rect x="8" y="8" width="104" height="104" rx="24" fill="url(#previewCalc)"/>
                    <rect x="18" y="18" width="84" height="24" rx="4" fill="#3a3a3a"/>
                    <text x="94" y="36" fill="white" fontSize="16" fontFamily="-apple-system" textAnchor="end">0</text>
                    <rect x="84" y="50" width="16" height="16" rx="8" fill="#FF9500"/>
                    <rect x="84" y="72" width="16" height="16" rx="8" fill="#FF9500"/>
                  </svg>
                </div>
                <div className="floating-app app-4">
                  <svg viewBox="0 0 120 120" className="preview-icon">
                    <defs>
                      <linearGradient id="previewNotes" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FED330"/>
                        <stop offset="100%" stopColor="#F7B731"/>
                      </linearGradient>
                    </defs>
                    <rect x="8" y="8" width="104" height="104" rx="24" fill="url(#previewNotes)"/>
                    <rect x="24" y="30" width="72" height="66" rx="4" fill="#FFFEF5"/>
                    <line x="24" y="30" x2="96" y2="30" stroke="#E5C100" strokeWidth="6"/>
                    <line x1="34" y1="48" x2="86" y2="48" stroke="#ccc" strokeWidth="1.5"/>
                    <line x1="34" y1="60" x2="86" y2="60" stroke="#ccc" strokeWidth="1.5"/>
                    <line x1="34" y1="72" x2="86" y2="72" stroke="#ccc" strokeWidth="1.5"/>
                  </svg>
                </div>
                <div className="floating-app app-5">
                  <svg viewBox="0 0 120 120" className="preview-icon">
                    <defs>
                      <linearGradient id="previewMusic" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fc5c7d"/>
                        <stop offset="100%" stopColor="#6a1b9a"/>
                      </linearGradient>
                    </defs>
                    <rect x="8" y="8" width="104" height="104" rx="24" fill="url(#previewMusic)"/>
                    <ellipse cx="45" cy="76" rx="12" ry="9" fill="white"/>
                    <ellipse cx="78" cy="66" rx="12" ry="9" fill="white"/>
                    <rect x="53" y="34" width="5" height="42" rx="2" fill="white"/>
                    <rect x="86" y="30" width="5" height="36" rx="2" fill="white"/>
                    <path d="M56 34 L56 30 L88 24 L88 30 Z" fill="white"/>
                  </svg>
                </div>
                <div className="floating-app app-6">
                  <svg viewBox="0 0 120 120" className="preview-icon">
                    <defs>
                      <linearGradient id="previewSettings" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8e9eab"/>
                        <stop offset="100%" stopColor="#555555"/>
                      </linearGradient>
                    </defs>
                    <rect x="8" y="8" width="104" height="104" rx="24" fill="url(#previewSettings)"/>
                    <g transform="translate(60,60)">
                      <path d="M0,-32 L5,-30 L7,-25 L12,-23 L15,-28 L22,-25 L20,-18 L25,-15 L30,-18 L32,-12 L27,-8 L28,-3 L32,0 L28,3 L27,8 L32,12 L30,18 L25,15 L20,18 L22,25 L15,28 L12,23 L7,25 L5,30 L0,32 L-5,30 L-7,25 L-12,23 L-15,28 L-22,25 L-20,18 L-25,15 L-30,18 L-32,12 L-27,8 L-28,3 L-32,0 L-28,-3 L-27,-8 L-32,-12 L-30,-18 L-25,-15 L-20,-18 L-22,-25 L-15,-28 L-12,-23 L-7,-25 L-5,-30 Z" fill="#c0c0c0"/>
                      <circle cx="0" cy="0" r="12" fill="#555"/>
                    </g>
                  </svg>
                </div>
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
