import SwiftUI
import Combine

struct MainInterfaceView: View {
    @EnvironmentObject private var model: AppViewModel
    @StateObject private var motion = MotionParallaxManager()
    @StateObject private var handTracker = HandGestureService()
    @State private var locationLabel: String = "Moradabad"

    var body: some View {
        ZStack(alignment: .topTrailing) {
            GradientBackground().ignoresSafeArea()
            ParticleBackground(animate: model.boostEffects)

            VStack(spacing: 0) {
                StatusBarView(onEnd: model.endDemo, onToggleDemo: model.toggleDemoMode, strongEffects: model.boostEffects, location: locationLabel)
                    .padding(.top, 6)

                GeometryReader { geo in
                    ZStack {
                        ForEach(model.activeWindowsSorted()) { window in
                            FloatingWindow(window: window,
                                           boost: model.boostEffects,
                                           parallax: motion,
                                           onClose: { model.closeWindow(id: window.id) },
                                           onFocus: { model.focusWindow(id: window.id) },
                                           onMinimize: { model.minimizeWindow(id: window.id) },
                                           onDrag: { translation in model.moveWindow(id: window.id, by: translation) })
                            .frame(width: window.size.width, height: window.size.height)
                            .position(x: window.position.x, y: window.position.y)
                            .zIndex(Double(window.zIndex))
                        }
                    }
                    .onAppear {
                        model.updateCanvasSize(geo.size)
                        motion.start(intensity: model.boostEffects ? 16 : 7)
                    }
                    .onChange(of: geo.size) { _, newValue in
                        model.updateCanvasSize(newValue)
                    }
                }
                .padding(.horizontal, 12)

                DockView(parallax: motion)
                    .padding(.bottom, 6)
            }
            .padding(.horizontal, 8)
        }
        .task { await preloadLocationLabel() }
        .task { await handTracker.start() }
        .onDisappear { handTracker.stop() }
        .onReceive(handTracker.$lastGesture.compactMap { $0?.mappedCommand }) { command in
            model.handleAirCommand(command)
        }
        .overlay(alignment: .topTrailing) {
            if let gesture = handTracker.lastGesture, gesture != .unknown {
                AirGestureBadge(title: gesture.label, confidence: handTracker.confidence)
                    .padding(.top, 10)
                    .padding(.trailing, 10)
            }
        }
    }

    private func preloadLocationLabel() async {
        let service = WeatherService()
        if let city = try? await service.reverseGeocode(lat: 28.8389, lon: 78.7768) {
            locationLabel = city
        }
    }
}

private struct AirGestureBadge: View {
    let title: String
    let confidence: Double

    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: "hand.point.up.left")
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.subheadline.weight(.semibold))
                Text("Confidence \(Int(confidence * 100))%")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(.ultraThinMaterial, in: Capsule())
        .shadow(color: .black.opacity(0.15), radius: 10, y: 4)
    }
}

private struct FloatingWindow: View {
    let window: WindowInstance
    let boost: Bool
    @ObservedObject var parallax: MotionParallaxManager
    let onClose: () -> Void
    let onFocus: () -> Void
    let onMinimize: () -> Void
    let onDrag: (CGSize) -> Void

    @State private var dragOffset: CGSize = .zero
    @State private var hover = false

    var body: some View {
        VStack(spacing: 12) {
            WindowChrome(title: window.app.title, app: window.app, onClose: onClose, onMinimize: onMinimize, onFocus: onFocus)
                .padding(.horizontal, 2)

            Group {
                switch window.app {
                case .dashboard: DashboardAppView()
                case .weather: WeatherAppView()
                case .notes: NotesAppView()
                case .music: MusicAppView()
                case .calculator: CalculatorAppView()
                case .assistant: AssistantAppView()
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
        }
        .padding(12)
        .glassCard(cornerRadius: 24, glow: boost)
        .overlay(
            RoundedRectangle(cornerRadius: 24, style: .continuous)
                .stroke(LinearGradient(colors: [Color.white.opacity(0.25), Color.blue.opacity(0.35)], startPoint: .topLeading, endPoint: .bottomTrailing), lineWidth: boost ? 1.2 : 0.6)
        )
        .scaleEffect(window.isMinimized ? 0.85 : 1, anchor: .topTrailing)
        .opacity(window.isMinimized ? 0.7 : 1)
        .offset(dragOffset)
        .offset(y: hover ? -6 : 6)
        .parallax(parallax, depth: boost ? 0.12 : 0.06)
        .gesture(
            DragGesture(minimumDistance: 0)
                .onChanged { value in
                    dragOffset = value.translation
                    onFocus()
                }
                .onEnded { value in
                    onDrag(value.translation)
                    dragOffset = .zero
                }
        )
        .onTapGesture { onFocus() }
        .onAppear {
            withAnimation(.easeInOut(duration: 6).repeatForever(autoreverses: true)) { hover.toggle() }
        }
        .animation(.spring(response: 0.48, dampingFraction: 0.82), value: window.isMinimized)
    }
}
