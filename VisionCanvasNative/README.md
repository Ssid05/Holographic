# VisionCanvas (Native SwiftUI)

A holographic, glassmorphism-inspired demo for iOS/iPadOS built in SwiftUI. It showcases floating windows (Dashboard, Weather, Notes, Music, Calculator, Assistant), a dock, status pill, particles, and optional boosted effects ready for a future visionOS target.

## Run
1. Open `VisionCanvas.xcodeproj` in Xcode 15+
2. Select an iOS Simulator (iPhone 15 Pro or iPad) and press **Run**
3. Optional: toggle **Demo Mode** in the top pill to increase holographic effects

## Features
- Glass panels with blur, glow, and depth shadows
- Floating windows you can drag, focus, minimize, close, and reopen from the dock
- Parallax motion offset (gracefully degrades if motion data unavailable)
- Particle background and breathing hover animation on windows
- Weather fetch via Open-Meteo with Moradabad fallback
- Lightweight Calculator, Notes, Music, Assistant placeholders, and Dashboard stats

## Structure
- `App/` entry point and app state
- `Models/` window + app metadata
- `ViewModels/` weather state handling
- `Services/` location and weather services
- `Components/` reusable chrome, glass, particles, parallax
- `Views/` app windows and canvas layout
- `Resources/` Info.plist
- `Assets.xcassets/` app icon placeholder
