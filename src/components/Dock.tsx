import './Dock.css';

interface Props {
  selectedIndex: number;
  activeApp: string | null;
  onSelect: (appId: string) => void;
}

const AssistantIcon = () => (
  <svg viewBox="0 0 60 60" fill="none" className="app-icon-svg">
    <defs>
      <linearGradient id="assistantGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7B68EE"/>
        <stop offset="50%" stopColor="#9B59B6"/>
        <stop offset="100%" stopColor="#8E44AD"/>
      </linearGradient>
      <filter id="assistantGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <circle cx="30" cy="30" r="12" stroke="url(#assistantGrad)" strokeWidth="2" fill="none" filter="url(#assistantGlow)"/>
    <circle cx="30" cy="30" r="6" fill="url(#assistantGrad)" opacity="0.8"/>
    <circle cx="30" cy="12" r="3" fill="url(#assistantGrad)"/>
    <circle cx="30" cy="48" r="3" fill="url(#assistantGrad)"/>
    <circle cx="12" cy="30" r="3" fill="url(#assistantGrad)"/>
    <circle cx="48" cy="30" r="3" fill="url(#assistantGrad)"/>
    <circle cx="17" cy="17" r="2.5" fill="url(#assistantGrad)" opacity="0.7"/>
    <circle cx="43" cy="17" r="2.5" fill="url(#assistantGrad)" opacity="0.7"/>
    <circle cx="17" cy="43" r="2.5" fill="url(#assistantGrad)" opacity="0.7"/>
    <circle cx="43" cy="43" r="2.5" fill="url(#assistantGrad)" opacity="0.7"/>
  </svg>
);

const WeatherIcon = () => (
  <svg viewBox="0 0 60 60" fill="none" className="app-icon-svg">
    <defs>
      <linearGradient id="weatherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4FC3F7"/>
        <stop offset="50%" stopColor="#29B6F6"/>
        <stop offset="100%" stopColor="#0288D1"/>
      </linearGradient>
      <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD54F"/>
        <stop offset="100%" stopColor="#FF9800"/>
      </linearGradient>
    </defs>
    <circle cx="22" cy="22" r="10" fill="url(#sunGrad)"/>
    <g stroke="url(#sunGrad)" strokeWidth="2" strokeLinecap="round">
      <line x1="22" y1="6" x2="22" y2="9"/>
      <line x1="22" y1="35" x2="22" y2="38"/>
      <line x1="6" y1="22" x2="9" y2="22"/>
      <line x1="35" y1="22" x2="38" y2="22"/>
      <line x1="10" y1="10" x2="12" y2="12"/>
      <line x1="32" y1="32" x2="34" y2="34"/>
      <line x1="10" y1="34" x2="12" y2="32"/>
      <line x1="32" y1="12" x2="34" y2="10"/>
    </g>
    <path d="M24 38 C16 38 12 42 12 47 C12 52 17 55 24 55 L48 55 C52 55 55 52 55 48 C55 44 52 41 48 41 C48 34 42 30 36 30 C30 30 25 33 24 38Z" fill="url(#weatherGrad)" opacity="0.9"/>
  </svg>
);

const CalculatorIcon = () => (
  <svg viewBox="0 0 60 60" fill="none" className="app-icon-svg">
    <defs>
      <linearGradient id="calcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF7043"/>
        <stop offset="100%" stopColor="#E64A19"/>
      </linearGradient>
    </defs>
    <rect x="10" y="6" width="40" height="48" rx="6" fill="url(#calcGrad)" opacity="0.15"/>
    <rect x="10" y="6" width="40" height="48" rx="6" stroke="url(#calcGrad)" strokeWidth="2" fill="none"/>
    <rect x="14" y="10" width="32" height="12" rx="3" fill="url(#calcGrad)" opacity="0.3"/>
    <text x="42" y="19" fill="white" fontSize="10" fontFamily="SF Pro Display, -apple-system" fontWeight="500" textAnchor="end">0</text>
    <rect x="14" y="26" width="8" height="8" rx="2" fill="url(#calcGrad)" opacity="0.8"/>
    <rect x="26" y="26" width="8" height="8" rx="2" fill="url(#calcGrad)" opacity="0.8"/>
    <rect x="38" y="26" width="8" height="8" rx="2" fill="url(#calcGrad)" opacity="0.8"/>
    <rect x="14" y="38" width="8" height="8" rx="2" fill="url(#calcGrad)" opacity="0.8"/>
    <rect x="26" y="38" width="8" height="8" rx="2" fill="url(#calcGrad)" opacity="0.8"/>
    <rect x="38" y="38" width="8" height="8" rx="2" fill="white" opacity="0.9"/>
    <text x="42" y="45" fill="#E64A19" fontSize="10" fontFamily="SF Pro Display, -apple-system" fontWeight="600" textAnchor="middle">=</text>
  </svg>
);

const NotesIcon = () => (
  <svg viewBox="0 0 60 60" fill="none" className="app-icon-svg">
    <defs>
      <linearGradient id="notesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFD93D"/>
        <stop offset="100%" stopColor="#F4A100"/>
      </linearGradient>
    </defs>
    <rect x="10" y="6" width="40" height="48" rx="4" fill="url(#notesGrad)"/>
    <rect x="10" y="6" width="40" height="48" rx="4" fill="white" opacity="0.2"/>
    <line x1="16" y1="18" x2="44" y2="18" stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
    <line x1="16" y1="26" x2="44" y2="26" stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
    <line x1="16" y1="34" x2="44" y2="34" stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
    <line x1="16" y1="42" x2="44" y2="42" stroke="rgba(0,0,0,0.2)" strokeWidth="1"/>
    <line x1="20" y1="6" x2="20" y2="54" stroke="rgba(255,100,100,0.4)" strokeWidth="1"/>
    <path d="M16 17 L20 17 L18 14 L16 17Z" fill="rgba(0,0,0,0.15)"/>
    <line x1="24" y1="18" x2="38" y2="18" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5"/>
    <line x1="24" y1="26" x2="42" y2="26" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5"/>
    <line x1="24" y1="34" x2="36" y2="34" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5"/>
  </svg>
);

const MusicIcon = () => (
  <svg viewBox="0 0 60 60" fill="none" className="app-icon-svg">
    <defs>
      <linearGradient id="musicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF6B9D"/>
        <stop offset="50%" stopColor="#FA4D6A"/>
        <stop offset="100%" stopColor="#E91E63"/>
      </linearGradient>
      <filter id="musicGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <circle cx="30" cy="30" r="24" stroke="url(#musicGrad)" strokeWidth="2" fill="none" opacity="0.3"/>
    <circle cx="30" cy="30" r="18" stroke="url(#musicGrad)" strokeWidth="2" fill="none" opacity="0.5"/>
    <circle cx="30" cy="30" r="12" fill="url(#musicGrad)" opacity="0.2"/>
    <circle cx="30" cy="30" r="6" fill="url(#musicGrad)"/>
    <path d="M32 18 L32 34 M32 18 L42 15 L42 20 L32 23" stroke="url(#musicGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#musicGlow)"/>
    <ellipse cx="28" cy="36" rx="5" ry="4" fill="url(#musicGrad)"/>
    <ellipse cx="38" cy="33" rx="4" ry="3" fill="url(#musicGrad)"/>
  </svg>
);

const DashboardIcon = () => (
  <svg viewBox="0 0 60 60" fill="none" className="app-icon-svg">
    <defs>
      <linearGradient id="dashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00D4FF"/>
        <stop offset="100%" stopColor="#0099CC"/>
      </linearGradient>
    </defs>
    <circle cx="30" cy="30" r="24" stroke="url(#dashGrad)" strokeWidth="2" fill="none" opacity="0.3"/>
    <path d="M30 10 A20 20 0 0 1 50 30" stroke="url(#dashGrad)" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <path d="M30 10 A20 20 0 0 0 10 30" stroke="url(#dashGrad)" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.5"/>
    <circle cx="30" cy="30" r="6" fill="url(#dashGrad)"/>
    <line x1="30" y1="30" x2="42" y2="22" stroke="url(#dashGrad)" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="18" cy="44" r="4" fill="url(#dashGrad)" opacity="0.6"/>
    <circle cx="42" cy="44" r="4" fill="url(#dashGrad)" opacity="0.6"/>
    <rect x="26" y="46" width="8" height="4" rx="2" fill="url(#dashGrad)" opacity="0.6"/>
  </svg>
);

const apps = [
  { id: 'assistant', name: 'Assistant', Icon: AssistantIcon, gradient: 'linear-gradient(145deg, #7B68EE 0%, #9B59B6 50%, #8E44AD 100%)' },
  { id: 'weather', name: 'Weather', Icon: WeatherIcon, gradient: 'linear-gradient(145deg, #4FC3F7 0%, #29B6F6 50%, #0288D1 100%)' },
  { id: 'calculator', name: 'Calculator', Icon: CalculatorIcon, gradient: 'linear-gradient(145deg, #FF7043 0%, #FF5722 50%, #E64A19 100%)' },
  { id: 'notes', name: 'Notes', Icon: NotesIcon, gradient: 'linear-gradient(145deg, #FFD93D 0%, #FFC107 50%, #F4A100 100%)' },
  { id: 'music', name: 'Music', Icon: MusicIcon, gradient: 'linear-gradient(145deg, #FF6B9D 0%, #FA4D6A 50%, #E91E63 100%)' },
  { id: 'dashboard', name: 'Settings', Icon: DashboardIcon, gradient: 'linear-gradient(145deg, #00D4FF 0%, #00B4D8 50%, #0099CC 100%)' },
];

export default function Dock({ selectedIndex, activeApp, onSelect }: Props) {
  return (
    <div className="dock-container">
      <div className="dock-backdrop" />
      <div className="dock">
        <div className="dock-glass" />
        <div className="dock-content">
          {apps.map((app, index) => {
            const Icon = app.Icon;
            return (
              <button
                key={app.id}
                className={`dock-item ${selectedIndex === index ? 'selected' : ''} ${activeApp === app.id ? 'active' : ''}`}
                onClick={() => onSelect(app.id)}
                style={{ '--app-gradient': app.gradient } as React.CSSProperties}
              >
                <div className="dock-icon-wrapper">
                  <div className="dock-icon">
                    <div className="icon-glass" />
                    <div className="icon-content">
                      <Icon />
                    </div>
                    <div className="icon-shine" />
                  </div>
                  {selectedIndex === index && <div className="selection-ring" />}
                </div>
                <span className="dock-label">{app.name}</span>
                {activeApp === app.id && <div className="active-dot" />}
              </button>
            );
          })}
        </div>
        <div className="dock-highlight" />
      </div>
    </div>
  );
}
