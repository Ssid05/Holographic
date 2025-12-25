import './Dock.css';

interface Props {
  selectedIndex: number;
  activeApp: string | null;
  onSelect: (appId: string) => void;
}

const AssistantIcon = () => (
  <svg viewBox="0 0 120 120" className="app-icon-svg">
    <defs>
      <linearGradient id="assistBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#667eea"/>
        <stop offset="50%" stopColor="#764ba2"/>
        <stop offset="100%" stopColor="#6B73FF"/>
      </linearGradient>
      <linearGradient id="assistHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.5)"/>
        <stop offset="50%" stopColor="rgba(255,255,255,0)"/>
      </linearGradient>
      <radialGradient id="assistGlow" cx="50%" cy="30%" r="60%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.4)"/>
        <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
      </radialGradient>
      <filter id="assistShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.3"/>
      </filter>
    </defs>
    <rect x="8" y="8" width="104" height="104" rx="24" fill="url(#assistBg)"/>
    <rect x="8" y="8" width="104" height="52" rx="24" fill="url(#assistHighlight)"/>
    <circle cx="60" cy="60" r="28" fill="rgba(255,255,255,0.15)" filter="url(#assistShadow)"/>
    <circle cx="60" cy="60" r="22" fill="rgba(255,255,255,0.2)"/>
    <circle cx="60" cy="60" r="14" fill="white"/>
    <circle cx="60" cy="60" r="8" fill="url(#assistBg)"/>
    <circle cx="60" cy="32" r="6" fill="white" opacity="0.9"/>
    <circle cx="60" cy="88" r="6" fill="white" opacity="0.9"/>
    <circle cx="32" cy="60" r="6" fill="white" opacity="0.9"/>
    <circle cx="88" cy="60" r="6" fill="white" opacity="0.9"/>
    <circle cx="40" cy="40" r="4" fill="white" opacity="0.7"/>
    <circle cx="80" cy="40" r="4" fill="white" opacity="0.7"/>
    <circle cx="40" cy="80" r="4" fill="white" opacity="0.7"/>
    <circle cx="80" cy="80" r="4" fill="white" opacity="0.7"/>
  </svg>
);

const WeatherIcon = () => (
  <svg viewBox="0 0 120 120" className="app-icon-svg">
    <defs>
      <linearGradient id="weatherBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#56CCF2"/>
        <stop offset="100%" stopColor="#2F80ED"/>
      </linearGradient>
      <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE259"/>
        <stop offset="100%" stopColor="#FFA751"/>
      </linearGradient>
      <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff"/>
        <stop offset="100%" stopColor="#e8e8e8"/>
      </linearGradient>
      <filter id="sunGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="glow"/>
        <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="cloudShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#1a5fb4" floodOpacity="0.3"/>
      </filter>
    </defs>
    <rect x="8" y="8" width="104" height="104" rx="24" fill="url(#weatherBg)"/>
    <rect x="8" y="8" width="104" height="52" rx="24" fill="rgba(255,255,255,0.2)"/>
    <circle cx="45" cy="45" r="20" fill="url(#sunGrad)" filter="url(#sunGlow)"/>
    <g stroke="#FFA751" strokeWidth="3" strokeLinecap="round" opacity="0.9">
      <line x1="45" y1="18" x2="45" y2="24"/>
      <line x1="45" y1="66" x2="45" y2="72"/>
      <line x1="18" y1="45" x2="24" y2="45"/>
      <line x1="66" y1="45" x2="72" y2="45"/>
      <line x1="26" y1="26" x2="30" y2="30"/>
      <line x1="60" y1="60" x2="64" y2="64"/>
      <line x1="26" y1="64" x2="30" y2="60"/>
      <line x1="60" y1="30" x2="64" y2="26"/>
    </g>
    <ellipse cx="70" cy="75" rx="32" ry="20" fill="url(#cloudGrad)" filter="url(#cloudShadow)"/>
    <ellipse cx="55" cy="70" rx="22" ry="16" fill="url(#cloudGrad)"/>
    <ellipse cx="80" cy="72" rx="18" ry="14" fill="url(#cloudGrad)"/>
  </svg>
);

const CalculatorIcon = () => (
  <svg viewBox="0 0 120 120" className="app-icon-svg">
    <defs>
      <linearGradient id="calcBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#434343"/>
        <stop offset="100%" stopColor="#1a1a1a"/>
      </linearGradient>
      <linearGradient id="displayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#4a4a4a"/>
        <stop offset="100%" stopColor="#2d2d2d"/>
      </linearGradient>
      <linearGradient id="orangeBtn" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FF9F0A"/>
        <stop offset="100%" stopColor="#FF6B00"/>
      </linearGradient>
      <linearGradient id="grayBtn" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#636366"/>
        <stop offset="100%" stopColor="#48484a"/>
      </linearGradient>
    </defs>
    <rect x="8" y="8" width="104" height="104" rx="24" fill="url(#calcBg)"/>
    <rect x="8" y="8" width="104" height="40" rx="24" fill="rgba(255,255,255,0.05)"/>
    <rect x="18" y="18" width="84" height="28" rx="6" fill="url(#displayGrad)"/>
    <text x="96" y="38" fill="white" fontSize="20" fontFamily="-apple-system, SF Pro Display" fontWeight="300" textAnchor="end">0</text>
    <rect x="18" y="54" width="18" height="18" rx="9" fill="url(#grayBtn)"/>
    <rect x="42" y="54" width="18" height="18" rx="9" fill="url(#grayBtn)"/>
    <rect x="66" y="54" width="18" height="18" rx="9" fill="url(#grayBtn)"/>
    <rect x="84" y="54" width="18" height="18" rx="9" fill="url(#orangeBtn)"/>
    <rect x="18" y="78" width="18" height="18" rx="9" fill="#333"/>
    <rect x="42" y="78" width="18" height="18" rx="9" fill="#333"/>
    <rect x="66" y="78" width="18" height="18" rx="9" fill="#333"/>
    <rect x="84" y="78" width="18" height="18" rx="9" fill="url(#orangeBtn)"/>
    <text x="27" y="67" fill="white" fontSize="10" fontFamily="-apple-system" textAnchor="middle">C</text>
    <text x="51" y="67" fill="white" fontSize="10" fontFamily="-apple-system" textAnchor="middle">±</text>
    <text x="75" y="67" fill="white" fontSize="10" fontFamily="-apple-system" textAnchor="middle">%</text>
    <text x="93" y="67" fill="white" fontSize="12" fontFamily="-apple-system" textAnchor="middle">÷</text>
    <text x="27" y="91" fill="white" fontSize="12" fontFamily="-apple-system" textAnchor="middle">7</text>
    <text x="51" y="91" fill="white" fontSize="12" fontFamily="-apple-system" textAnchor="middle">8</text>
    <text x="75" y="91" fill="white" fontSize="12" fontFamily="-apple-system" textAnchor="middle">9</text>
    <text x="93" y="91" fill="white" fontSize="12" fontFamily="-apple-system" textAnchor="middle">×</text>
  </svg>
);

const NotesIcon = () => (
  <svg viewBox="0 0 120 120" className="app-icon-svg">
    <defs>
      <linearGradient id="notesBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FED330"/>
        <stop offset="100%" stopColor="#F7B731"/>
      </linearGradient>
      <linearGradient id="paperGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFEF5"/>
        <stop offset="100%" stopColor="#FFF9E6"/>
      </linearGradient>
      <filter id="paperShadow" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#c9a227" floodOpacity="0.4"/>
      </filter>
    </defs>
    <rect x="8" y="8" width="104" height="104" rx="24" fill="url(#notesBg)"/>
    <rect x="8" y="8" width="104" height="40" rx="24" fill="rgba(255,255,255,0.3)"/>
    <rect x="22" y="28" width="76" height="72" rx="4" fill="url(#paperGrad)" filter="url(#paperShadow)"/>
    <line x1="22" y1="28" x2="98" y2="28" stroke="#E5C100" strokeWidth="6"/>
    <line x1="32" y1="44" x2="88" y2="44" stroke="#d4d4d4" strokeWidth="1"/>
    <line x1="32" y1="56" x2="88" y2="56" stroke="#d4d4d4" strokeWidth="1"/>
    <line x1="32" y1="68" x2="88" y2="68" stroke="#d4d4d4" strokeWidth="1"/>
    <line x1="32" y1="80" x2="88" y2="80" stroke="#d4d4d4" strokeWidth="1"/>
    <line x1="32" y1="44" x2="70" y2="44" stroke="#666" strokeWidth="1.5"/>
    <line x1="32" y1="56" x2="80" y2="56" stroke="#666" strokeWidth="1.5"/>
    <line x1="32" y1="68" x2="60" y2="68" stroke="#666" strokeWidth="1.5"/>
  </svg>
);

const MusicIcon = () => (
  <svg viewBox="0 0 120 120" className="app-icon-svg">
    <defs>
      <linearGradient id="musicBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fc5c7d"/>
        <stop offset="50%" stopColor="#e91e63"/>
        <stop offset="100%" stopColor="#6a1b9a"/>
      </linearGradient>
      <linearGradient id="noteWhite" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff"/>
        <stop offset="100%" stopColor="#f0f0f0"/>
      </linearGradient>
      <filter id="noteShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#6a1b9a" floodOpacity="0.5"/>
      </filter>
    </defs>
    <rect x="8" y="8" width="104" height="104" rx="24" fill="url(#musicBg)"/>
    <rect x="8" y="8" width="104" height="45" rx="24" fill="rgba(255,255,255,0.2)"/>
    <g filter="url(#noteShadow)">
      <ellipse cx="45" cy="78" rx="14" ry="10" fill="url(#noteWhite)"/>
      <ellipse cx="80" cy="68" rx="14" ry="10" fill="url(#noteWhite)"/>
      <rect x="55" y="32" width="6" height="46" rx="3" fill="url(#noteWhite)"/>
      <rect x="90" y="28" width="6" height="40" rx="3" fill="url(#noteWhite)"/>
      <path d="M58 32 L58 28 L93 22 L93 28 Z" fill="url(#noteWhite)"/>
    </g>
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 120 120" className="app-icon-svg">
    <defs>
      <linearGradient id="settingsBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8e9eab"/>
        <stop offset="100%" stopColor="#555555"/>
      </linearGradient>
      <linearGradient id="gearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e0e0e0"/>
        <stop offset="50%" stopColor="#a0a0a0"/>
        <stop offset="100%" stopColor="#707070"/>
      </linearGradient>
      <filter id="gearShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.4"/>
      </filter>
    </defs>
    <rect x="8" y="8" width="104" height="104" rx="24" fill="url(#settingsBg)"/>
    <rect x="8" y="8" width="104" height="45" rx="24" fill="rgba(255,255,255,0.15)"/>
    <g transform="translate(60,60)" filter="url(#gearShadow)">
      <path d="M0,-38 L6,-36 L8,-30 L14,-28 L18,-34 L26,-30 L24,-22 L30,-18 L36,-22 L38,-14 L32,-10 L34,-4 L38,0 L34,4 L32,10 L38,14 L36,22 L30,18 L24,22 L26,30 L18,34 L14,28 L8,30 L6,36 L0,38 L-6,36 L-8,30 L-14,28 L-18,34 L-26,30 L-24,22 L-30,18 L-36,22 L-38,14 L-32,10 L-34,4 L-38,0 L-34,-4 L-32,-10 L-38,-14 L-36,-22 L-30,-18 L-24,-22 L-26,-30 L-18,-34 L-14,-28 L-8,-30 L-6,-36 Z" fill="url(#gearGrad)"/>
      <circle cx="0" cy="0" r="16" fill="url(#settingsBg)"/>
      <circle cx="0" cy="0" r="10" fill="#333"/>
    </g>
  </svg>
);

const apps = [
  { id: 'assistant', name: 'Assistant', Icon: AssistantIcon },
  { id: 'weather', name: 'Weather', Icon: WeatherIcon },
  { id: 'calculator', name: 'Calculator', Icon: CalculatorIcon },
  { id: 'notes', name: 'Notes', Icon: NotesIcon },
  { id: 'music', name: 'Music', Icon: MusicIcon },
  { id: 'dashboard', name: 'Settings', Icon: SettingsIcon },
];

export default function Dock({ selectedIndex, activeApp, onSelect }: Props) {
  return (
    <div className="dock-container">
      <div className="dock-reflection" />
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
              >
                <div className="dock-icon-wrapper">
                  <div className="dock-icon">
                    <Icon />
                  </div>
                  {selectedIndex === index && <div className="selection-ring" />}
                </div>
                <span className="dock-label">{app.name}</span>
                {activeApp === app.id && <div className="active-dot" />}
              </button>
            );
          })}
        </div>
        <div className="dock-shine" />
      </div>
    </div>
  );
}
