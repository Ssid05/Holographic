import { AppState } from '../types';
import './StatusBar.css';

interface Props {
  appState: AppState;
  onOpenDashboard: () => void;
  onExit: () => void;
}

export default function StatusBar({ appState, onOpenDashboard, onExit }: Props) {
  return (
    <div className="status-bar">
      <button className="status-pill exit-pill" onClick={onExit}>
        <span className="pill-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 6L4 12L10 18" />
            <path d="M4 12H16" />
            <path d="M16 6H20V18H16" />
          </svg>
        </span>
        <span className="pill-label">End Demo</span>
      </button>

      <div className="status-indicator">
        <div className={`status-dot ${appState.isCameraActive ? '' : 'inactive'}`} />
        <span>Camera {appState.isCameraActive ? 'Active' : 'Off'}</span>
      </div>
      
      <div className="status-indicator">
        <div className={`status-dot ${appState.isListening ? 'warning' : ''}`} />
        <span>Voice {appState.isListening ? 'Listening' : 'Ready'}</span>
      </div>

      <button className="dashboard-button" onClick={onOpenDashboard}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      </button>
    </div>
  );
}
