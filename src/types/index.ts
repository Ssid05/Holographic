export interface AppState {
  isHandsRegistered: boolean;
  isCameraActive: boolean;
  activeApp: string | null;
  selectedDockIndex: number;
  isListening: boolean;
  voiceText: string;
}

export interface HandRegistrationData {
  leftHandFront: boolean;
  leftHandBack: boolean;
  rightHandFront: boolean;
  rightHandBack: boolean;
  timestamp: number;
}

export interface GestureEvent {
  type: 'hover' | 'select' | 'close' | 'toggleCamera';
  data?: any;
}

export interface AppInfo {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Note {
  id: string;
  content: string;
  timestamp: number;
}
