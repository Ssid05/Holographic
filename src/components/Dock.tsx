import './Dock.css';

interface Props {
  selectedIndex: number;
  activeApp: string | null;
  onSelect: (appId: string) => void;
}

const apps = [
  { id: 'assistant', name: 'Assistant', icon: '🤖', gradient: 'linear-gradient(135deg, #5856D6, #AF52DE)' },
  { id: 'weather', name: 'Weather', icon: '🌤️', gradient: 'linear-gradient(135deg, #007AFF, #5AC8FA)' },
  { id: 'calculator', name: 'Calculator', icon: '🔢', gradient: 'linear-gradient(135deg, #FF9500, #FF3B30)' },
  { id: 'notes', name: 'Notes', icon: '📝', gradient: 'linear-gradient(135deg, #FFCC00, #FF9500)' },
  { id: 'music', name: 'Music', icon: '🎵', gradient: 'linear-gradient(135deg, #FF2D55, #FF6B6B)' },
];

export default function Dock({ selectedIndex, activeApp, onSelect }: Props) {
  return (
    <div className="dock-container">
      <div className="dock glass-panel">
        {apps.map((app, index) => (
          <button
            key={app.id}
            className={`dock-item ${selectedIndex === index ? 'selected' : ''} ${activeApp === app.id ? 'active' : ''}`}
            onClick={() => onSelect(app.id)}
            style={{ '--app-gradient': app.gradient } as React.CSSProperties}
          >
            <div className="dock-icon">
              <span className="icon-emoji">{app.icon}</span>
            </div>
            <span className="dock-label">{app.name}</span>
            {selectedIndex === index && <div className="selection-glow" />}
            {activeApp === app.id && <div className="active-indicator" />}
          </button>
        ))}
      </div>
    </div>
  );
}
