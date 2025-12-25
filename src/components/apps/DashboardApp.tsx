import { useState } from 'react';
import { AppState } from '../../types';
import { VoiceController } from '../../services/voiceController';
import './AppStyles.css';
import './DashboardStyles.css';

interface Props {
  onClose: () => void;
  voiceController: VoiceController | null;
  appState: AppState;
  onToggleCamera: () => void;
}

export default function DashboardApp({ onClose, voiceController, appState, onToggleCamera }: Props) {
  const [gestureMode, setGestureMode] = useState<'standard' | 'precision'>('standard');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);

  const systemStats = {
    gestureFPS: 30,
    voiceLatency: '~200ms',
    uptime: Math.floor(Date.now() / 1000 % 3600),
    memoryUsage: '128MB',
  };

  const formatUptime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="app-window glass-panel dashboard-app">
      <div className="app-header">
        <h2>System Dashboard</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="dashboard-content">
        <section className="dashboard-section">
          <h3>System Status</h3>
          <div className="status-grid">
            <div className="status-card">
              <div className={`status-icon ${appState.isCameraActive ? 'active' : ''}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 7l-7 5 7 5V7z" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
              </div>
              <div className="status-info">
                <span className="status-label">Camera</span>
                <span className={`status-value ${appState.isCameraActive ? 'active' : 'inactive'}`}>
                  {appState.isCameraActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="status-card">
              <div className="status-icon active">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                </svg>
              </div>
              <div className="status-info">
                <span className="status-label">Voice</span>
                <span className="status-value active">Ready</span>
              </div>
            </div>

            <div className="status-card">
              <div className="status-icon active">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                </svg>
              </div>
              <div className="status-info">
                <span className="status-label">Gesture</span>
                <span className="status-value active">{systemStats.gestureFPS} FPS</span>
              </div>
            </div>

            <div className="status-card">
              <div className="status-icon active">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <div className="status-info">
                <span className="status-label">UI Engine</span>
                <span className="status-value active">Running</span>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-section">
          <h3>Controls</h3>
          <div className="controls-list">
            <div className="control-item">
              <div className="control-info">
                <span className="control-label">Camera Tracking</span>
                <span className="control-desc">Enable hand gesture detection</span>
              </div>
              <button 
                className={`toggle-switch ${appState.isCameraActive ? 'active' : ''}`}
                onClick={onToggleCamera}
              >
                <div className="toggle-thumb" />
              </button>
            </div>

            <div className="control-item">
              <div className="control-info">
                <span className="control-label">Voice Commands</span>
                <span className="control-desc">Enable voice recognition</span>
              </div>
              <button 
                className={`toggle-switch ${voiceEnabled ? 'active' : ''}`}
                onClick={() => setVoiceEnabled(!voiceEnabled)}
              >
                <div className="toggle-thumb" />
              </button>
            </div>

            <div className="control-item">
              <div className="control-info">
                <span className="control-label">Audio Feedback</span>
                <span className="control-desc">Play sounds on interactions</span>
              </div>
              <button 
                className={`toggle-switch ${hapticFeedback ? 'active' : ''}`}
                onClick={() => setHapticFeedback(!hapticFeedback)}
              >
                <div className="toggle-thumb" />
              </button>
            </div>

            <div className="control-item">
              <div className="control-info">
                <span className="control-label">Gesture Mode</span>
                <span className="control-desc">Select tracking precision</span>
              </div>
              <div className="mode-selector">
                <button 
                  className={gestureMode === 'standard' ? 'active' : ''}
                  onClick={() => setGestureMode('standard')}
                >
                  Standard
                </button>
                <button 
                  className={gestureMode === 'precision' ? 'active' : ''}
                  onClick={() => setGestureMode('precision')}
                >
                  Precision
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-section">
          <h3>Performance</h3>
          <div className="performance-grid">
            <div className="perf-item">
              <span className="perf-value">{systemStats.gestureFPS}</span>
              <span className="perf-label">Gesture FPS</span>
            </div>
            <div className="perf-item">
              <span className="perf-value">{systemStats.voiceLatency}</span>
              <span className="perf-label">Voice Latency</span>
            </div>
            <div className="perf-item">
              <span className="perf-value">{formatUptime(systemStats.uptime)}</span>
              <span className="perf-label">Session Time</span>
            </div>
            <div className="perf-item">
              <span className="perf-value">{systemStats.memoryUsage}</span>
              <span className="perf-label">Memory</span>
            </div>
          </div>
        </section>

        <div className="dashboard-footer">
          <span className="version">Holo AI v1.0</span>
          <span className="copyright">AI-Driven Multimodal HCI System</span>
        </div>
      </div>
    </div>
  );
}
