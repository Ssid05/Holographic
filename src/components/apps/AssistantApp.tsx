import { useState, useEffect, useRef } from 'react';
import { VoiceController } from '../../services/voiceController';
import './AppStyles.css';

interface Props {
  onClose: () => void;
  voiceController: VoiceController | null;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  text: string;
}

export default function AssistantApp({ onClose, voiceController }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', type: 'assistant', text: "Hello! I'm your AI assistant. How can I help you today?" }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (voiceController) {
      voiceController.speak("Hello! I'm your AI assistant. How can I help you today?");
    }
  }, []);

  const processCommand = async (text: string) => {
    const lowerText = text.toLowerCase();
    let response = '';

    if (lowerText.includes('time')) {
      const now = new Date();
      response = `The current time is ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}.`;
    } else if (lowerText.includes('date') || lowerText.includes('today')) {
      const now = new Date();
      response = `Today is ${now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}.`;
    } else if (lowerText.includes('hello') || lowerText.includes('hi')) {
      response = "Hello! It's great to talk with you. What can I do for you?";
    } else if (lowerText.includes('how are you')) {
      response = "I'm functioning optimally, thank you for asking! How can I assist you?";
    } else if (lowerText.includes('name')) {
      response = "I'm Holo AI, your personal assistant powered by advanced voice and gesture recognition.";
    } else if (lowerText.includes('weather')) {
      response = "You can check the weather by opening the Weather app. Would you like me to help with something else?";
    } else if (lowerText.includes('joke')) {
      const jokes = [
        "Why do programmers prefer dark mode? Because light attracts bugs!",
        "Why did the AI go to therapy? It had too many deep issues.",
        "I told my computer I needed a break, and now it won't stop sending me vacation ads."
      ];
      response = jokes[Math.floor(Math.random() * jokes.length)];
    } else if (lowerText.includes('thank')) {
      response = "You're welcome! Is there anything else I can help with?";
    } else {
      response = "I understand you said: '" + text + "'. How can I help you with that?";
    }

    setMessages(prev => [...prev, { id: Date.now().toString(), type: 'assistant', text: response }]);
    
    if (voiceController) {
      await voiceController.speak(response);
    }
  };

  const handleVoiceInput = () => {
    if (!voiceController) return;
    
    if (isListening) {
      voiceController.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      const originalCallback = (voiceController as any).callback;
      (voiceController as any).callback = (text: string) => {
        setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', text }]);
        setIsListening(false);
        voiceController.stopListening();
        (voiceController as any).callback = originalCallback;
        processCommand(text);
      };
      voiceController.startListening();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', text: inputText }]);
    processCommand(inputText);
    setInputText('');
  };

  return (
    <div className="app-window glass-panel">
      <div className="app-header">
        <h2>Assistant</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="assistant-content">
        <div className="messages-container">
          {messages.map(msg => (
            <div key={msg.id} className={`message ${msg.type}`}>
              <div className="message-bubble">{msg.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <form onSubmit={handleSubmit} className="input-form">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type a message..."
              className="text-input"
            />
            <button type="submit" className="send-button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </form>
          
          <button 
            className={`voice-button ${isListening ? 'listening' : ''}`} 
            onClick={handleVoiceInput}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
            </svg>
            {isListening && <span className="listening-indicator">Listening...</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
