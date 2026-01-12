import SwiftUI
import RealityKit

#if os(visionOS)
struct VisionSpaceView: View {
    @EnvironmentObject private var model: AppViewModel
    @StateObject private var motion = MotionParallaxManager()
    @State private var locationLabel: String = "Moradabad"
    @State private var isCalm: Bool = false

    var body: some View {
        RealityView { content in
            content.entities.removeAll()

            let root = Entity()
            root.name = "root"
            content.add(root)

            // Subtle ambient + directional light to lift glass surfaces.
            let ambient = Entity()
            ambient.components.set(LightComponent(color: .white.withAlphaComponent(0.6), intensity: 250, type: .ambient))
            root.addChild(ambient)

            let keyLight = Entity()
            keyLight.components.set(LightComponent(color: .white.withAlphaComponent(0.85), intensity: 800, type: .directional))
            keyLight.transform.rotation = simd_quatf(angle: .pi / 5, axis: [0, 1, 0])
            root.addChild(keyLight)

            // Status bar attachment at top.
            let status = AttachmentEntity(id: "status")
            status.position = [0, 1.2, -1.2]
            root.addChild(status)

            // Window stack centered.
            let windows = AttachmentEntity(id: "windows")
            windows.position = [0, 0.1, -1.1]
            root.addChild(windows)

            // Dock slightly forward and low.
            let dock = AttachmentEntity(id: "dock")
            dock.position = [0, -0.45, -1.0]
            dock.transform.scale = [1.05, 1.05, 1.05]
            root.addChild(dock)
        } attachments: {
            Attachment(id: "status") {
                StatusBarView(onEnd: model.endDemo,
                              onToggleDemo: model.toggleDemoMode,
                              strongEffects: model.boostEffects,
                              location: locationLabel)
                .padding(.horizontal, 8)
                .frame(width: 800)
            }
            Attachment(id: "windows") {
                SpatialPanelStack(isCalm: isCalm)
                    .environmentObject(model)
            }
            Attachment(id: "dock") {
                DockView(parallax: motion)
                    .environmentObject(model)
            }
        }
        .gesture(
            SpatialTapGesture().onEnded { _ in
                model.handleAirCommand(.select)
            }
        )
        .simultaneousGesture(
            LongPressGesture(minimumDuration: 0.4).onEnded { _ in
                model.handleAirCommand(.toggleMode)
                isCalm.toggle()
                if isCalm { motion.stop() } else { motion.start(intensity: 12) }
            }
        )
        .simultaneousGesture(
            MagnificationGesture().onEnded { value in
                if value > 1.8 { model.handleAirCommand(.resetWorkspace) }
            }
        )
        .task { await preloadLocationLabel() }
        .onAppear { motion.start(intensity: 12) }
        .onDisappear { motion.stop() }
    }

    private func preloadLocationLabel() async {
        let service = WeatherService()
        if let city = try? await service.reverseGeocode(lat: 28.8389, lon: 78.7768) {
            locationLabel = city
        }
    }
}

private struct SpatialPanelStack: View {
    @EnvironmentObject private var model: AppViewModel
    let isCalm: Bool

    var body: some View {
        ZStack {
            ForEach(model.activeWindowsSorted()) { window in
                FloatingWindow(window: window,
                               boost: model.boostEffects && !isCalm,
                               parallax: MotionParallaxManager(),
                               onClose: { model.closeWindow(id: window.id) },
                               onFocus: { model.focusWindow(id: window.id) },
                               onMinimize: { model.minimizeWindow(id: window.id) },
                               onDrag: { translation in model.moveWindow(id: window.id, by: translation) })
                .frame(width: window.size.width, height: window.size.height)
                .offset(x: window.position.x - 180, y: window.position.y - 140)
                .zIndex(Double(window.zIndex))
                .glassShadow()
            }
        }
        .frame(width: 960, height: 760)
        .padding(12)
        .background(.thinMaterial, in: RoundedRectangle(cornerRadius: 28, style: .continuous))
        .opacity(isCalm ? 0.88 : 1)
        .animation(.spring(response: 0.5, dampingFraction: 0.82), value: isCalm)
    }
}

private extension View {
    func glassShadow() -> some View {
        shadow(color: .white.opacity(0.18), radius: 18, y: 12)
            .shadow(color: .black.opacity(0.3), radius: 22, y: 18)
    }
}
#endif
