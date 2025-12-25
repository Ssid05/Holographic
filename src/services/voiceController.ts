type VoiceCallback = (command: string) => void;

export class VoiceController {
  private recognition: any = null;
  private synthesis: SpeechSynthesis;
  private mainCallback: VoiceCallback;
  private tempCallback: VoiceCallback | null = null;
  private isListening: boolean = false;

  constructor(callback: VoiceCallback) {
    this.mainCallback = callback;
    this.synthesis = window.speechSynthesis;
    this.initRecognition();
  }

  private initRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US';

    this.recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const command = event.results[last][0].transcript;
      if (this.tempCallback) {
        this.tempCallback(command);
      } else {
        this.mainCallback(command);
      }
    };

    this.recognition.onerror = (event: any) => {
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.warn('Speech recognition error:', event.error);
      }
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        try {
          this.recognition.start();
        } catch (e) {
        }
      }
    };
  }

  startListening() {
    if (this.recognition && !this.isListening) {
      this.isListening = true;
      try {
        this.recognition.start();
      } catch (e) {
      }
    }
  }

  stopListening() {
    if (this.recognition) {
      this.isListening = false;
      try {
        this.recognition.stop();
      } catch (e) {
      }
    }
  }

  setTempCallback(callback: VoiceCallback | null) {
    this.tempCallback = callback;
  }

  listenOnce(callback: VoiceCallback) {
    this.tempCallback = (text: string) => {
      callback(text);
      this.tempCallback = null;
    };
    
    if (!this.isListening) {
      this.startListening();
    }
  }

  speak(text: string, onEnd?: () => void): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synthesis) {
        if (onEnd) onEnd();
        resolve();
        return;
      }

      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      const voices = this.synthesis.getVoices();
      const preferredVoice = voices.find(v => 
        v.name.includes('Samantha') || 
        v.name.includes('Google UK English Female') ||
        v.name.includes('Microsoft Zira')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        if (onEnd) onEnd();
        resolve();
      };

      this.synthesis.speak(utterance);
    });
  }

  get isSupported(): boolean {
    return !!(this.recognition && this.synthesis);
  }

  get listening(): boolean {
    return this.isListening;
  }
}
