type ClapCallback = () => void;

export class ClapController {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array<ArrayBuffer> | null = null;
  private rafId: number | null = null;
  private stream: MediaStream | null = null;
  private lastPeakTime = 0;
  private peakTimes: number[] = [];
  private readonly peakThreshold = 0.22; // tuned for clap amplitude
  private readonly minPeakSpacingMs = 180; // avoid double-counting one clap
  private readonly windowMs = 1200; // double-clap window
  private callback: ClapCallback;

  constructor(callback: ClapCallback) {
    this.callback = callback;
  }

  async start() {
    if (this.audioContext || this.stream) return;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          channelCount: 1
        },
        video: false
      });
    } catch (err) {
      console.warn('Clap mic unavailable:', err);
      return;
    }

    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = this.audioContext.createMediaStreamSource(this.stream);
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 1024;
    const bufferLength = this.analyser.fftSize;
    this.dataArray = new Uint8Array(bufferLength);
    source.connect(this.analyser);

    const process = () => {
      if (!this.analyser || !this.dataArray) return;
      this.analyser.getByteTimeDomainData(this.dataArray);

      // Compute RMS
      let sum = 0;
      for (let i = 0; i < this.dataArray.length; i++) {
        const v = (this.dataArray[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / this.dataArray.length);

      const now = Date.now();
      if (rms > this.peakThreshold && now - this.lastPeakTime > this.minPeakSpacingMs) {
        this.lastPeakTime = now;
        this.peakTimes.push(now);
        this.peakTimes = this.peakTimes.filter(t => now - t <= this.windowMs);
        if (this.peakTimes.length >= 1) {
          // Single clap exits; clear peaks to avoid multiple exits
          this.peakTimes = [];
          this.callback();
        }
      }

      this.rafId = window.requestAnimationFrame(process);
    };

    this.rafId = window.requestAnimationFrame(process);
  }

  stop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    if (this.analyser) {
      this.analyser.disconnect();
      this.analyser = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    this.dataArray = null;
    this.peakTimes = [];
    this.lastPeakTime = 0;
  }
}
