# Holo AI Web

## Overview
A premium Apple Vision Pro-inspired web application with gesture and voice controls. Features a touchless interface that works using camera-based hand gestures and voice commands (Jarvis-style).

## Tech Stack
- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Hand Tracking**: MediaPipe Hands
- **Voice**: Web Speech API (recognition + synthesis)

## Features

### Hand Registration (Security Gate)
- Shows holographic hand skeleton during registration
- Requires front/back of both hands
- After registration, all hand visuals are hidden

### Gesture Controls
- Point finger to hover/select apps
- Thumb + index pinch (snap sound) to select
- Hold pinch 1s to open app
- Hold pinch 2s to close app
- Show both hands + open/close fists 3x to toggle camera

### Voice Commands
- "Open assistant/weather/calculator/notes/music"
- "Close" to exit current app
- Natural language responses

### Apps (5 Total)
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
    apps/
      AssistantApp.tsx          - AI assistant
      WeatherApp.tsx            - Weather with geolocation
      CalculatorApp.tsx         - Calculator
      NotesApp.tsx              - Notes with dictation
      MusicApp.tsx              - Music player
      AppStyles.css             - Shared app styles
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

## Design System
- **Colors**: Dark futuristic with soft gradients
- **UI**: Glassmorphism, depth blur, 60fps animations
- **Typography**: SF Pro Display / system fonts
- **Dock**: Floating Apple-style dock at bottom

## Running the App
The application starts with `npx vite --host 0.0.0.0 --port 5000`

## Browser Requirements
- Camera access (for hand tracking)
- Microphone access (for voice commands)
- Modern browser with WebRTC support
- Location access (for weather)
