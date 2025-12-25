import { useState, useRef, useEffect, useCallback } from 'react';
import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { HandRegistrationData } from '../types';
import './HandRegistration.css';

interface Props {
  onComplete: (data: HandRegistrationData) => void;
}

const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17]
];

export default function HandRegistration({ onComplete }: Props) {
  const [step, setStep] = useState<'welcome' | 'left-front' | 'left-back' | 'right-front' | 'right-back' | 'complete'>('left-front');
  const [progress, setProgress] = useState(0);
  const [handDetected, setHandDetected] = useState(false);
  const [registrationData, setRegistrationData] = useState<Partial<HandRegistrationData>>({});
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handsRef = useRef<Hands | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const detectionTimeRef = useRef<number>(0);

  const stepLabels = {
    'welcome': 'Welcome',
    'left-front': 'Left Hand - Palm',
    'left-back': 'Left Hand - Back',
    'right-front': 'Right Hand - Palm',
    'right-back': 'Right Hand - Back',
    'complete': 'Complete'
  };

  const stepInstructions = {
    'left-front': 'Show the palm of your left hand',
    'left-back': 'Show the back of your left hand',
    'right-front': 'Show the palm of your right hand',
    'right-back': 'Show the back of your right hand',
  };

  const onResults = useCallback((results: Results) => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      setHandDetected(true);
      detectionTimeRef.current += 50;
      
      const newProgress = Math.min((detectionTimeRef.current / 2000) * 100, 100);
      setProgress(newProgress);

      for (const landmarks of results.multiHandLandmarks) {
        drawConnectors(ctx, landmarks, HAND_CONNECTIONS as any, {
          color: 'rgba(0, 255, 255, 0.5)',
          lineWidth: 2
        });
        drawLandmarks(ctx, landmarks, {
          color: 'rgba(0, 200, 255, 0.8)',
          lineWidth: 1,
          radius: 4
        });
      }

      if (newProgress >= 100) {
        handleStepComplete();
      }
    } else {
      setHandDetected(false);
      detectionTimeRef.current = Math.max(0, detectionTimeRef.current - 25);
      setProgress(Math.min((detectionTimeRef.current / 2000) * 100, 100));
    }
  }, [step]);

  const handleStepComplete = useCallback(() => {
    detectionTimeRef.current = 0;
    setProgress(0);

    switch (step) {
      case 'left-front':
        setRegistrationData(prev => ({ ...prev, leftHandFront: true }));
        setStep('left-back');
        break;
      case 'left-back':
        setRegistrationData(prev => ({ ...prev, leftHandBack: true }));
        setStep('right-front');
        break;
      case 'right-front':
        setRegistrationData(prev => ({ ...prev, rightHandFront: true }));
        setStep('right-back');
        break;
      case 'right-back':
        setRegistrationData(prev => ({ ...prev, rightHandBack: true }));
        setStep('complete');
        setTimeout(() => {
          if (cameraRef.current) {
            cameraRef.current.stop();
          }
          onComplete({
            leftHandFront: true,
            leftHandBack: true,
            rightHandFront: true,
            rightHandBack: true,
            timestamp: Date.now()
          });
        }, 1500);
        break;
    }
  }, [step, onComplete]);

  useEffect(() => {
    if (step === 'welcome' || step === 'complete') return;

    const initCamera = async () => {
      if (!videoRef.current) return;

      handsRef.current = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
      });

      handsRef.current.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.5
      });

      handsRef.current.onResults(onResults);

      cameraRef.current = new Camera(videoRef.current, {
        onFrame: async () => {
          if (handsRef.current && videoRef.current) {
            await handsRef.current.send({ image: videoRef.current });
          }
        },
        width: 640,
        height: 480
      });

      await cameraRef.current.start();
    };

    initCamera();

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
    };
  }, [step, onResults]);

  const startRegistration = () => {
    setStep('left-front');
  };

  const currentStepIndex = ['left-front', 'left-back', 'right-front', 'right-back'].indexOf(step) + 1;

  if (step === 'welcome') {
    return (
      <div className="registration-wrapper">
        <div className="registration-container">
          <div className="holo-frame">
            <div className="frame-corner tl"></div>
            <div className="frame-corner tr"></div>
            <div className="frame-corner bl"></div>
            <div className="frame-corner br"></div>
            <div className="frame-glow"></div>
          </div>
          
          <div className="registration-welcome">
            <div className="welcome-badge">Secure Access</div>
            
            <div className="welcome-icon-container">
              <div className="icon-rings">
                <div className="icon-ring r1"></div>
                <div className="icon-ring r2"></div>
                <div className="icon-ring r3"></div>
              </div>
              <div className="welcome-icon">
                <svg viewBox="0 0 100 100" className="hand-icon">
                  <defs>
                    <linearGradient id="handGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00d4ff"/>
                      <stop offset="100%" stopColor="#0071e3"/>
                    </linearGradient>
                  </defs>
                  <path d="M50 10 L50 35 M35 20 L35 40 M65 20 L65 40 M25 30 L25 50 M75 30 L75 50 M20 50 Q20 80 50 90 Q80 80 80 50 L80 45 L20 45 Z" 
                        stroke="url(#handGrad)" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            <h1 className="welcome-title">Hand Registration</h1>
            <p className="welcome-description">
              For secure access, please register both of your hands. 
              This ensures only you can control the holographic interface.
            </p>
            
            <div className="security-note">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span>Biometric data is processed locally</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="registration-wrapper">
        <div className="registration-container">
          <div className="holo-frame success">
            <div className="frame-corner tl"></div>
            <div className="frame-corner tr"></div>
            <div className="frame-corner bl"></div>
            <div className="frame-corner br"></div>
            <div className="frame-glow"></div>
          </div>
          
          <div className="registration-complete">
            <div className="success-icon-container">
              <div className="success-rings">
                <div className="success-ring r1"></div>
                <div className="success-ring r2"></div>
              </div>
              <div className="success-icon">
                <svg viewBox="0 0 100 100" className="check-icon">
                  <circle cx="50" cy="50" r="40" stroke="rgba(52, 199, 89, 0.3)" strokeWidth="3" fill="none"/>
                  <path d="M30 50 L45 65 L70 35" stroke="#34C759" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            <h1 className="complete-title">Registration Complete</h1>
            <p className="complete-description">
              Your hands have been registered successfully. 
              Initializing holographic interface...
            </p>
            
            <div className="loading-bar">
              <div className="loading-progress"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="registration-wrapper">
      <div className="registration-container scanning">
        <div className="holo-frame scanning">
          <div className="frame-corner tl"></div>
          <div className="frame-corner tr"></div>
          <div className="frame-corner bl"></div>
          <div className="frame-corner br"></div>
          <div className="frame-glow"></div>
          <div className="scan-line"></div>
        </div>
        
        <div className="registration-panel">
          <div className="panel-header">
            <div className="step-info">
              <span className="step-label">{stepLabels[step]}</span>
              <span className="step-count">Step {currentStepIndex} of 4</span>
            </div>
            <div className="step-progress-bar">
              <div className="progress-fill" style={{ width: `${(currentStepIndex / 4) * 100}%` }}></div>
            </div>
          </div>
          
          <div className="camera-container">
            <video ref={videoRef} className="camera-video" playsInline />
            <canvas ref={canvasRef} className="skeleton-canvas" width={640} height={480} />
            
            <div className="camera-overlay">
              <div className="corner-bracket tl"></div>
              <div className="corner-bracket tr"></div>
              <div className="corner-bracket bl"></div>
              <div className="corner-bracket br"></div>
            </div>
            
            <div className={`detection-indicator ${handDetected ? 'detected' : ''}`}>
              <svg viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" className="indicator-bg" />
                <circle 
                  cx="100" 
                  cy="100" 
                  r="90" 
                  className="indicator-progress"
                  style={{ strokeDasharray: `${progress * 5.65} 565` }}
                />
              </svg>
              <div className="indicator-center">
                <span className="indicator-percent">{Math.round(progress)}%</span>
              </div>
            </div>
          </div>

          <div className="instruction-panel">
            <div className={`status-badge ${handDetected ? 'active' : ''}`}>
              <div className="status-dot"></div>
              <span>{handDetected ? 'Hand Detected' : 'Scanning...'}</span>
            </div>
            <p className="instruction-text">{stepInstructions[step as keyof typeof stepInstructions]}</p>
            <span className="instruction-hint">
              {handDetected ? 'Hold steady until the circle completes' : 'Position your hand in front of the camera'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
