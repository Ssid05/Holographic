import { useState, useEffect, useCallback, useRef } from 'react';
import LandingPage from './components/LandingPage';
import HandRegistration from './components/HandRegistration';
import MainInterface from './components/MainInterface';
import { GestureController } from './services/gestureController';
import { VoiceController } from './services/voiceController';
import { AppState, HandRegistrationData } from './types';

function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [appState, setAppState] = useState<AppState>({
    isHandsRegistered: false,
    isCameraActive: false,
    activeApp: null,
    selectedDockIndex: -1,
    isListening: false,
    voiceText: '',
  });

  const [handData, setHandData] = useState<HandRegistrationData | null>(null);
  const gestureControllerRef = useRef<GestureController | null>(null);
  const voiceControllerRef = useRef<VoiceController | null>(null);
  const controllersInitialized = useRef(false);

  const handleGestureEvent = useCallback((event: string, data?: any) => {
    switch (event) {
      case 'hover':
        setAppState(prev => ({ ...prev, selectedDockIndex: data.index }));
        break;
      case 'select':
        if (data.index >= 0 && data.index < 6) {
          const apps = ['assistant', 'weather', 'calculator', 'notes', 'music', 'dashboard'];
          setAppState(prev => ({ ...prev, activeApp: apps[data.index] }));
        }
        break;
      case 'close':
        setAppState(prev => ({ ...prev, activeApp: null }));
        break;
      case 'toggleCamera':
        setAppState(prev => ({ ...prev, isCameraActive: !prev.isCameraActive }));
        break;
    }
  }, []);

  const handleVoiceCommand = useCallback((command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('open assistant') || lowerCommand.includes('hey assistant')) {
      setAppState(prev => ({ ...prev, activeApp: 'assistant' }));
    } else if (lowerCommand.includes('open weather') || lowerCommand.includes('show weather')) {
      setAppState(prev => ({ ...prev, activeApp: 'weather' }));
    } else if (lowerCommand.includes('open calculator') || lowerCommand.includes('calculator')) {
      setAppState(prev => ({ ...prev, activeApp: 'calculator' }));
    } else if (lowerCommand.includes('open notes') || lowerCommand.includes('notes')) {
      setAppState(prev => ({ ...prev, activeApp: 'notes' }));
    } else if (lowerCommand.includes('open music') || lowerCommand.includes('play music')) {
      setAppState(prev => ({ ...prev, activeApp: 'music' }));
    } else if (lowerCommand.includes('open dashboard') || lowerCommand.includes('show dashboard') || lowerCommand.includes('settings')) {
      setAppState(prev => ({ ...prev, activeApp: 'dashboard' }));
    } else if (lowerCommand.includes('close') || lowerCommand.includes('exit')) {
      setAppState(prev => ({ ...prev, activeApp: null }));
    }
  }, []);

  const handleRegistrationComplete = useCallback((data: HandRegistrationData) => {
    setHandData(data);
    setAppState(prev => ({
      ...prev,
      isHandsRegistered: true,
      isCameraActive: true,
    }));
  }, []);

  const handleEnterDemo = () => {
    setShowLanding(false);
    document.body.classList.add('no-scroll');
  };

  useEffect(() => {
    if (!showLanding && appState.isHandsRegistered && !controllersInitialized.current) {
      controllersInitialized.current = true;
      
      voiceControllerRef.current = new VoiceController(handleVoiceCommand);
      
      gestureControllerRef.current = new GestureController(handleGestureEvent);
      gestureControllerRef.current.start();
    }

    return () => {
      if (gestureControllerRef.current) {
        gestureControllerRef.current.stop();
        gestureControllerRef.current = null;
      }
      if (voiceControllerRef.current) {
        voiceControllerRef.current.stopListening();
        voiceControllerRef.current = null;
      }
      controllersInitialized.current = false;
    };
  }, [showLanding, appState.isHandsRegistered, handleGestureEvent, handleVoiceCommand]);

  useEffect(() => {
    if (gestureControllerRef.current) {
      if (appState.isCameraActive) {
        gestureControllerRef.current.start();
      } else {
        gestureControllerRef.current.stop();
      }
    }
  }, [appState.isCameraActive]);

  if (showLanding) {
    return <LandingPage onEnterDemo={handleEnterDemo} />;
  }

  return (
    <div className="app-container">
      <div className="background-gradient" />
      <div className="background-stars" />
      
      {!appState.isHandsRegistered ? (
        <HandRegistration onComplete={handleRegistrationComplete} />
      ) : (
        <MainInterface
          appState={appState}
          setAppState={setAppState}
          voiceController={voiceControllerRef.current}
        />
      )}
    </div>
  );
}

export default App;
