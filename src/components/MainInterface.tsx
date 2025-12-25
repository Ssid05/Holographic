import { Dispatch, SetStateAction } from 'react';
import Dock from './Dock';
import StatusBar from './StatusBar';
import AssistantApp from './apps/AssistantApp';
import WeatherApp from './apps/WeatherApp';
import CalculatorApp from './apps/CalculatorApp';
import NotesApp from './apps/NotesApp';
import MusicApp from './apps/MusicApp';
import DashboardApp from './apps/DashboardApp';
import { AppState } from '../types';
import { VoiceController } from '../services/voiceController';
import './MainInterface.css';

interface Props {
  appState: AppState;
  setAppState: Dispatch<SetStateAction<AppState>>;
  voiceController: VoiceController | null;
}

export default function MainInterface({ appState, setAppState, voiceController }: Props) {
  const handleAppSelect = (appId: string) => {
    setAppState(prev => ({ ...prev, activeApp: appId }));
  };

  const handleAppClose = () => {
    setAppState(prev => ({ ...prev, activeApp: null }));
  };

  const handleOpenDashboard = () => {
    setAppState(prev => ({ ...prev, activeApp: 'dashboard' }));
  };

  const handleToggleCamera = () => {
    setAppState(prev => ({ ...prev, isCameraActive: !prev.isCameraActive }));
  };

  const renderActiveApp = () => {
    if (!appState.activeApp) return null;

    const appProps = {
      onClose: handleAppClose,
      voiceController,
    };

    switch (appState.activeApp) {
      case 'assistant':
        return <AssistantApp {...appProps} />;
      case 'weather':
        return <WeatherApp {...appProps} />;
      case 'calculator':
        return <CalculatorApp {...appProps} />;
      case 'notes':
        return <NotesApp {...appProps} />;
      case 'music':
        return <MusicApp {...appProps} />;
      case 'dashboard':
        return (
          <DashboardApp 
            {...appProps} 
            appState={appState}
            onToggleCamera={handleToggleCamera}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="main-interface">
      <div className="holographic-grid" />
      
      <StatusBar appState={appState} onOpenDashboard={handleOpenDashboard} />
      
      <div className="content-area">
        {!appState.activeApp && (
          <div className="welcome-screen fade-in">
            <div className="holo-logo">
              <div className="logo-ring" />
              <div className="logo-ring" />
              <div className="logo-ring" />
              <div className="logo-core">AI</div>
            </div>
            <h1 className="welcome-title">Holo AI</h1>
            <p className="welcome-subtitle">AI-Driven Multimodal Holographic Interface</p>
            <div className="gesture-hint">
              <span className="hint-icon">👆</span>
              <span>Point and pinch to select an app</span>
            </div>
          </div>
        )}
        
        {appState.activeApp && (
          <div className="app-container float-in">
            {renderActiveApp()}
          </div>
        )}
      </div>

      <Dock 
        selectedIndex={appState.selectedDockIndex}
        activeApp={appState.activeApp}
        onSelect={handleAppSelect}
      />
    </div>
  );
}
