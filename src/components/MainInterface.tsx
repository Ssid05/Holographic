import { Dispatch, SetStateAction } from 'react';
import Dock from './Dock';
import AssistantApp from './apps/AssistantApp';
import WeatherApp from './apps/WeatherApp';
import CalculatorApp from './apps/CalculatorApp';
import NotesApp from './apps/NotesApp';
import MusicApp from './apps/MusicApp';
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
      default:
        return null;
    }
  };

  return (
    <div className="main-interface">
      <div className="content-area">
        {!appState.activeApp && (
          <div className="welcome-screen fade-in">
            <h1 className="welcome-title">Holo AI</h1>
            <p className="welcome-subtitle">Point and pinch to select an app</p>
          </div>
        )}
        
        {appState.activeApp && (
          <div className="app-container scale-in">
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
