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
  const [step, setStep] = useState<'welcome' | 'left-front' | 'left-back' | 'right-front' | 'right-back' | 'complete'>('welcome');
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

  if (step === 'welcome') {
    return (
      <div className="registration-container">
        <div className="registration-welcome glass-panel fade-in">
          <div className="welcome-icon">
            <svg viewBox="0 0 100 100" className="hand-icon">
              <path d="M50 10 L50 35 M35 20 L35 40 M65 20 L65 40 M25 30 L25 50 M75 30 L75 50 M20 50 Q20 80 50 90 Q80 80 80 50 L80 45 L20 45 Z" 
                    stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1>Hand Registration</h1>
          <p>For secure access, please register both of your hands. This ensures only you can control the interface.</p>
          <button className="glass-button start-button" onClick={startRegistration}>
            Begin Registration
          </button>
        </div>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="registration-container">
        <div className="registration-complete glass-panel fade-in">
          <div className="success-icon">
            <svg viewBox="0 0 100 100" className="check-icon">
              <circle cx="50" cy="50" r="40" stroke="rgba(52, 199, 89, 0.8)" strokeWidth="3" fill="none"/>
              <path d="M30 50 L45 65 L70 35" stroke="rgba(52, 199, 89, 1)" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1>Registration Complete</h1>
          <p>Your hands have been registered successfully. Initializing interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="registration-container">
      <div className="registration-panel glass-panel fade-in">
        <div className="step-indicator">
          <span className="step-label">{stepLabels[step]}</span>
          <span className="step-count">{['left-front', 'left-back', 'right-front', 'right-back'].indexOf(step) + 1} / 4</span>
        </div>
        
        <div className="camera-container">
          <video ref={videoRef} className="camera-video" playsInline />
          <canvas ref={canvasRef} className="skeleton-canvas" width={640} height={480} />
          <div className={`detection-ring ${handDetected ? 'detected' : ''}`}>
            <svg viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="95" className="ring-bg" />
              <circle 
                cx="100" 
                cy="100" 
                r="95" 
                className="ring-progress"
                style={{ strokeDasharray: `${progress * 5.97} 597` }}
              />
            </svg>
          </div>
        </div>

        <div className="instruction-text">
          <p>{stepInstructions[step as keyof typeof stepInstructions]}</p>
          <span className="hold-text">{handDetected ? 'Hold steady...' : 'Waiting for hand...'}</span>
        </div>
      </div>
    </div>
  );
}
