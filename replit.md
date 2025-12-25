# AI-Driven Multimodal Holographic Human-Computer Interaction System

## Project Overview
A premium holographic-style web application featuring contactless, gesture-based and voice-controlled human-computer interaction. This system demonstrates AI-driven multimodal interfaces using computer vision and natural language processing.

**Course**: B.Tech CSE AI ML DL  
**Domain**: Artificial Intelligence, Computer Vision, Human-Computer Interaction (HCI)

## Tech Stack
- **Frontend**: React 19 + TypeScript + Vite 7
- **Gesture Recognition**: MediaPipe Hands (AI-based hand tracking)
- **Voice Processing**: Web Speech API (recognition + synthesis)
- **UI**: Holographic-style simulation with glassmorphism effects

## Project Modules

### Module 1: Gesture Detection System
- Uses MediaPipe Hands for real-time hand tracking
- Detects pinch, point, and fist gestures
- Supports both left and right hands
- 30 FPS gesture recognition

### Module 2: Voice Command System
- Web Speech API for voice recognition
- Natural language command processing
- Text-to-speech for AI responses
- Supports continuous listening mode

### Module 3: Holographic UI Simulation
- Floating 3D-like interface elements
- Glassmorphism design with depth blur
- 60fps smooth animations
- Cyan holographic color scheme

### Module 4: Interaction Engine
- Maps gesture inputs to UI actions
- Integrates voice commands with app control
- Pinch-to-select interaction model
- Multi-modal input fusion

### Module 5: System Dashboard
- Real-time system status monitoring
- Camera and voice toggle controls
- Performance metrics display
- Settings configuration

## Features

### Hand Registration (Security Gate)
- Shows holographic hand skeleton during registration
- Requires front/back of both hands (4 steps)
- After registration, all hand visuals are hidden
- Secure access control

### Gesture Controls
- Point finger to hover/select apps
- Thumb + index pinch (snap sound) to select
- Hold pinch 1s to open app
- Hold pinch 2s to close app
- Show both hands + open/close fists 3x to toggle camera

### Voice Commands
- "Open assistant/weather/calculator/notes/music"
- "Close" or "exit" to close current app
- Natural language AI responses

### Apps (5 Applications)
1. **Assistant** - Jarvis-style AI that talks back
2. **Weather** - Auto-detects location, speaks results
3. **Calculator** - Gesture + voice input support
4. **Notes** - Voice dictation with local storage
5. **Music** - Play/pause with controls, ambient sound generator

## Project Structure
```
src/
  components/
    HandRegistration.tsx/.css   - Hand registration flow
    MainInterface.tsx/.css      - Main app container
    Dock.tsx/.css               - Floating dock with 5 apps
    StatusBar.tsx/.css          - System status indicators
    apps/
      AssistantApp.tsx          - AI assistant
      WeatherApp.tsx            - Weather with geolocation
      CalculatorApp.tsx         - Calculator
      NotesApp.tsx              - Notes with dictation
      MusicApp.tsx              - Music player
      DashboardApp.tsx          - System dashboard
      AppStyles.css             - Shared app styles
      DashboardStyles.css       - Dashboard styles
  services/
    gestureController.ts        - MediaPipe hand gesture detection
    voiceController.ts          - Web Speech API integration
  types/
    index.ts                    - TypeScript interfaces
  styles/
    global.css                  - Global styles and CSS variables
  App.tsx                       - Main application component
  main.tsx                      - Entry point
```

## Running the App
```bash
npx vite --host 0.0.0.0 --port 5000
```

## Browser Requirements
- Camera access (for hand tracking via MediaPipe)
- Microphone access (for voice commands)
- Modern browser with WebRTC support
- Location access (for weather feature)

## Advantages
- Contactless interaction (suitable for healthcare, defense, labs)
- Enhanced accessibility for users with physical limitations
- Futuristic holographic-like interface
- Reduces dependency on physical devices
- Real-time AI-driven recognition

## Future Scope
- Integration with AR/VR hardware
- Real hologram projection devices
- AI-powered virtual assistant avatar
- IoT-enabled smart environment integration

## References
- OpenCV Documentation
- MediaPipe Hands Documentation
- Google Speech API Documentation
- Research papers on Holographic UI & AI-based Interaction
