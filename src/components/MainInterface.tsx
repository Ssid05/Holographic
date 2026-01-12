import { Dispatch, SetStateAction, useRef, useEffect, useState } from 'react';
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
  onExit: () => void;
}

const GestureIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 14V3"/>
    <path d="M8 7V4.5C8 3.67 8.67 3 9.5 3S11 3.67 11 4.5"/>
    <path d="M13 4.5V3.5C13 2.67 13.67 2 14.5 2S16 2.67 16 3.5V7"/>
    <path d="M16 5.5C16 4.67 16.67 4 17.5 4S19 4.67 19 5.5V14"/>
    <path d="M8 14V7.5C8 6.67 7.33 6 6.5 6S5 6.67 5 7.5V16C5 19.31 7.69 22 11 22H13C16.31 22 19 19.31 19 16"/>
  </svg>
);

export default function MainInterface({ appState, setAppState, voiceController, onExit }: Props) {
  const cameraRef = useRef<HTMLVideoElement>(null);
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    if (!appState.isCameraActive) {
      setCameraReady(false);
      if (cameraRef.current && cameraRef.current.srcObject) {
        const tracks = (cameraRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        cameraRef.current.srcObject = null;
      }
      return;
    }

    let cancelled = false;

    if (cameraRef.current) {
      navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      })
        .then(stream => {
          if (cancelled) {
            stream.getTracks().forEach(track => track.stop());
            return;
          }
          if (cameraRef.current) {
            cameraRef.current.srcObject = stream;
            setCameraReady(true);
          }
        })
        .catch(err => {
          console.warn('Camera not available:', err);
        });
    }

    return () => {
      cancelled = true;
      if (cameraRef.current && cameraRef.current.srcObject) {
        const tracks = (cameraRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        cameraRef.current.srcObject = null;
      }
    };
  }, [appState.isCameraActive]);

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
      <div className="camera-background">
        <video 
          ref={cameraRef} 
          autoPlay 
          playsInline 
          muted 
          className={`camera-feed ${cameraReady ? 'ready' : ''}`}
        />
        <div className="camera-overlay" />
      </div>
      
      <div className="holographic-grid" />
      
      <StatusBar appState={appState} onOpenDashboard={handleOpenDashboard} onExit={onExit} />
      
      <div className="content-area">
        {!appState.activeApp && (
          <div className="welcome-screen fade-in">
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
