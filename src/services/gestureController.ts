import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

type GestureCallback = (event: string, data?: any) => void;

export class GestureController {
  private hands: Hands | null = null;
  private camera: Camera | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private callback: GestureCallback;
  private lastPinchTime: number = 0;
  private pinchStartTime: number = 0;
  private isPinching: boolean = false;
  private fistCount: number = 0;
  private lastFistTime: number = 0;
  private bothHandsFist: boolean = false;
  private selectedIndex: number = -1;

  constructor(callback: GestureCallback) {
    this.callback = callback;
  }

  async start() {
    if (this.camera) {
      return;
    }

    this.videoElement = document.createElement('video');
    this.videoElement.className = 'hidden-video';
    this.videoElement.playsInline = true;
    this.videoElement.autoplay = true;
    this.videoElement.muted = true;
    document.body.appendChild(this.videoElement);

    this.hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });

    this.hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5
    });

    this.hands.onResults(this.onResults.bind(this));

    this.camera = new Camera(this.videoElement, {
      onFrame: async () => {
        if (this.hands && this.videoElement && this.videoElement.readyState >= 2) {
          try {
            await this.hands.send({ image: this.videoElement });
          } catch (e) {
            // Silently handle frame processing errors
          }
        }
      },
      width: 640,
      height: 480
    });

    try {
      await this.camera.start();
    } catch (e) {
      console.warn('Camera initialization delayed, retrying...');
    }
  }

  stop() {
    if (this.camera) {
      this.camera.stop();
      this.camera = null;
    }
    if (this.hands) {
      this.hands.close();
      this.hands = null;
    }
    if (this.videoElement && this.videoElement.parentNode) {
      this.videoElement.parentNode.removeChild(this.videoElement);
      this.videoElement = null;
    }
  }

  private onResults(results: Results) {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      return;
    }

    const now = Date.now();
    let leftHand: any = null;
    let rightHand: any = null;

    results.multiHandLandmarks.forEach((landmarks, index) => {
      const handedness = results.multiHandedness?.[index]?.label;
      if (handedness === 'Left') {
        rightHand = landmarks;
      } else {
        leftHand = landmarks;
      }
    });

    const activeHand = rightHand || leftHand;
    if (activeHand) {
      const indexTip = activeHand[8];
      const screenX = 1 - indexTip.x;
      
      const dockIndex = this.getDockIndexFromPosition(screenX);
      if (dockIndex !== this.selectedIndex) {
        this.selectedIndex = dockIndex;
        this.callback('hover', { index: dockIndex });
      }

      const isPinching = this.detectPinch(activeHand);
      
      if (isPinching && !this.isPinching) {
        this.isPinching = true;
        this.pinchStartTime = now;
        this.playPinchSound();
      } else if (!isPinching && this.isPinching) {
        const pinchDuration = now - this.pinchStartTime;
        this.isPinching = false;
        
        if (pinchDuration >= 2000) {
          this.callback('close', {});
        } else if (pinchDuration >= 1000) {
          this.callback('select', { index: this.selectedIndex });
        }
      }
    }

    if (leftHand && rightHand) {
      const leftFist = this.detectFist(leftHand);
      const rightFist = this.detectFist(rightHand);
      
      if (leftFist && rightFist) {
        if (!this.bothHandsFist) {
          this.bothHandsFist = true;
          if (now - this.lastFistTime < 1000) {
            this.fistCount++;
          } else {
            this.fistCount = 1;
          }
          this.lastFistTime = now;
          
          if (this.fistCount >= 3) {
            this.callback('toggleCamera', {});
            this.fistCount = 0;
          }
        }
      } else {
        this.bothHandsFist = false;
      }
    }
  }

  private getDockIndexFromPosition(x: number): number {
    const dockStart = 0.2;
    const dockEnd = 0.8;
    const dockWidth = dockEnd - dockStart;
    
    if (x < dockStart || x > dockEnd) {
      return -1;
    }
    
    const relativeX = (x - dockStart) / dockWidth;
    return Math.min(Math.floor(relativeX * 6), 5);
  }

  private detectPinch(landmarks: any[]): boolean {
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    
    const distance = Math.sqrt(
      Math.pow(thumbTip.x - indexTip.x, 2) +
      Math.pow(thumbTip.y - indexTip.y, 2) +
      Math.pow(thumbTip.z - indexTip.z, 2)
    );
    
    return distance < 0.05;
  }

  private detectFist(landmarks: any[]): boolean {
    const fingerTips = [8, 12, 16, 20];
    const fingerMcps = [5, 9, 13, 17];
    
    let closedFingers = 0;
    
    for (let i = 0; i < fingerTips.length; i++) {
      const tipY = landmarks[fingerTips[i]].y;
      const mcpY = landmarks[fingerMcps[i]].y;
      
      if (tipY > mcpY) {
        closedFingers++;
      }
    }
    
    return closedFingers >= 3;
  }

  private playPinchSound() {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }
}
