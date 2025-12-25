import { useState, useRef, useEffect } from 'react';
import { VoiceController } from '../../services/voiceController';
import './AppStyles.css';

interface Props {
  onClose: () => void;
  voiceController: VoiceController | null;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  gradient: string;
}

const tracks: Track[] = [
  { id: '1', title: 'Ambient Dreams', artist: 'Holo AI', duration: '3:24', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { id: '2', title: 'Digital Sunrise', artist: 'Synthwave', duration: '4:12', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
  { id: '3', title: 'Neural Networks', artist: 'AI Composer', duration: '2:58', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
  { id: '4', title: 'Cyber Flow', artist: 'Future Bass', duration: '3:45', gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
  { id: '5', title: 'Holographic', artist: 'Ambient', duration: '5:01', gradient: 'linear-gradient(135deg, #fa709a, #fee140)' },
];

export default function MusicApp({ onClose, voiceController }: Props) {
  const [currentTrack, setCurrentTrack] = useState<Track>(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopAudio();
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const playAmbientSound = () => {
    const ctx = initAudio();
    
    oscillatorRef.current = ctx.createOscillator();
    gainNodeRef.current = ctx.createGain();
    
    oscillatorRef.current.type = 'sine';
    oscillatorRef.current.frequency.setValueAtTime(220, ctx.currentTime);
    
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.5, ctx.currentTime);
    lfoGain.gain.setValueAtTime(50, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(oscillatorRef.current.frequency);
    lfo.start();

    gainNodeRef.current.gain.setValueAtTime(0, ctx.currentTime);
    gainNodeRef.current.gain.linearRampToValueAtTime((volume / 100) * 0.1, ctx.currentTime + 0.5);
    
    oscillatorRef.current.connect(gainNodeRef.current);
    gainNodeRef.current.connect(ctx.destination);
    oscillatorRef.current.start();
  };

  const stopAudio = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.disconnect();
      gainNodeRef.current = null;
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    } else {
      playAmbientSound();
      progressIntervalRef.current = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            nextTrack();
            return 0;
          }
          return prev + 0.5;
        });
      }, 100);
      
      if (voiceController) {
        voiceController.speak(`Now playing ${currentTrack.title} by ${currentTrack.artist}`);
      }
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    setCurrentTrack(tracks[nextIndex]);
    setProgress(0);
    
    if (isPlaying) {
      stopAudio();
      setTimeout(() => {
        playAmbientSound();
      }, 100);
    }
  };

  const prevTrack = () => {
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
    setCurrentTrack(tracks[prevIndex]);
    setProgress(0);
    
    if (isPlaying) {
      stopAudio();
      setTimeout(() => {
        playAmbientSound();
      }, 100);
    }
  };

  const selectTrack = (track: Track) => {
    if (isPlaying) {
      stopAudio();
    }
    setCurrentTrack(track);
    setProgress(0);
    setIsPlaying(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime((newVolume / 100) * 0.1, audioContextRef.current.currentTime);
    }
  };

  return (
    <div className="app-window glass-panel music-app">
      <div className="app-header">
        <h2>Music</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="music-content">
        <div className="now-playing">
          <div className="album-art" style={{ background: currentTrack.gradient }}>
            <div className={`play-visual ${isPlaying ? 'playing' : ''}`}>
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
            </div>
          </div>
          
          <div className="track-info">
            <h3 className="track-title">{currentTrack.title}</h3>
            <p className="track-artist">{currentTrack.artist}</p>
          </div>

          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <div className="controls">
            <button className="control-button" onClick={prevTrack}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>
            
            <button className="play-button" onClick={togglePlay}>
              {isPlaying ? (
                <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            
            <button className="control-button" onClick={nextTrack}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>

          <div className="volume-control">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
            </svg>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
          </div>
        </div>

        <div className="track-list">
          <h4>Playlist</h4>
          {tracks.map(track => (
            <div 
              key={track.id}
              className={`track-item ${currentTrack.id === track.id ? 'active' : ''}`}
              onClick={() => selectTrack(track)}
            >
              <div className="track-thumb" style={{ background: track.gradient }} />
              <div className="track-details">
                <span className="track-name">{track.title}</span>
                <span className="track-meta">{track.artist} • {track.duration}</span>
              </div>
              {currentTrack.id === track.id && isPlaying && (
                <div className="mini-visual">
                  <div className="mini-bar" />
                  <div className="mini-bar" />
                  <div className="mini-bar" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
