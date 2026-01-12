import SwiftUI

struct WindowInstance: Identifiable, Equatable {
    let id: UUID
    let app: AppType
    var position: CGPoint
    var size: CGSize
    var zIndex: Int
    var isMinimized: Bool
}

@MainActor
final class AppViewModel: ObservableObject {
    @Published var demoMode: Bool = true
    @Published var boostEffects: Bool = true
    @Published private(set) var windows: [WindowInstance] = []

    private var zCounter: Int = 1
    private var canvasSize: CGSize = .zero
    private var lastAirCommandAt: Date?

    let dockApps: [AppType] = [.dashboard, .weather, .notes, .music, .calculator, .assistant]

    func updateCanvasSize(_ size: CGSize) {
        guard size.width > 0 && size.height > 0 else { return }
        canvasSize = size
        if windows.isEmpty {
            open(app: .dashboard)
            open(app: .weather)
        }
        clampWindowsToBounds()
    }

    func toggleDemoMode() { boostEffects.toggle() }

    func endDemo() { windows.removeAll() }

    func open(app: AppType) {
        if let existingIndex = windows.firstIndex(where: { $0.app == app }) {
            focusWindow(id: windows[existingIndex].id)
            windows[existingIndex].isMinimized = false
            return
        }

        let size = adjustedSize(for: app)
        let origin = defaultPosition(for: size)
        zCounter += 1
        let instance = WindowInstance(id: UUID(), app: app, position: origin, size: size, zIndex: zCounter, isMinimized: false)
        windows.append(instance)
    }

    func close(app: AppType) { windows.removeAll { $0.app == app } }
    func closeWindow(id: UUID) { windows.removeAll { $0.id == id } }

    func focusWindow(id: UUID) {
        guard let idx = windows.firstIndex(where: { $0.id == id }) else { return }
        zCounter += 1
        windows[idx].zIndex = zCounter
        windows[idx].isMinimized = false
    }

    func moveWindow(id: UUID, by translation: CGSize) {
        guard let idx = windows.firstIndex(where: { $0.id == id }) else { return }
        var win = windows[idx]
        win.position.x += translation.width
        win.position.y += translation.height
        win.position = clampedPosition(win.position, size: win.size)
        windows[idx] = win
    }

    func setPosition(id: UUID, to point: CGPoint) {
        guard let idx = windows.firstIndex(where: { $0.id == id }) else { return }
        windows[idx].position = clampedPosition(point, size: windows[idx].size)
    }

    func minimizeWindow(id: UUID) {
        guard let idx = windows.firstIndex(where: { $0.id == id }) else { return }
        windows[idx].isMinimized.toggle()
    }

    func activeWindowsSorted() -> [WindowInstance] {
        windows.sorted { $0.zIndex < $1.zIndex }
    }

    func handleAirCommand(_ command: AirCommand) {
        let now = Date()
        if let last = lastAirCommandAt, now.timeIntervalSince(last) < 1.2 { return }
        lastAirCommandAt = now

        switch command {
        case .select:
            open(app: .assistant)
        case .toggleMode:
            toggleDemoMode()
        case .resetWorkspace:
            resetWorkspace()
        }
    }

    func resetWorkspace() {
        windows.removeAll()
        zCounter = 1
        if canvasSize != .zero {
            open(app: .dashboard)
            open(app: .weather)
        }
    }

    // MARK: - Helpers

    private func defaultPosition(for size: CGSize) -> CGPoint {
        guard canvasSize != .zero else { return CGPoint(x: 120, y: 120) }
        let jitterX: CGFloat = [.random(in: -40...40), .random(in: -80...80)].randomElement() ?? 0
        let jitterY: CGFloat = [.random(in: -30...60), .random(in: -50...70)].randomElement() ?? 0
        let x = (canvasSize.width - size.width) / 2 + jitterX
        let y = (canvasSize.height - size.height) / 2 + jitterY
        return clampedPosition(CGPoint(x: x, y: y), size: size)
    }

    private func adjustedSize(for app: AppType) -> CGSize {
        guard canvasSize != .zero else { return app.preferredSize }
        let maxW = canvasSize.width * 0.82
        let maxH = canvasSize.height * 0.7
        return CGSize(width: min(app.preferredSize.width, maxW), height: min(app.preferredSize.height, maxH))
    }

    private func clampedPosition(_ position: CGPoint, size: CGSize) -> CGPoint {
        guard canvasSize != .zero else { return position }
        let minX: CGFloat = 16
        let minY: CGFloat = 80
        let maxX = max(minX, canvasSize.width - size.width - 16)
        let maxY = max(minY, canvasSize.height - size.height - 120)
        let x = min(max(position.x, minX), maxX)
        let y = min(max(position.y, minY), maxY)
        return CGPoint(x: x, y: y)
    }

    private func clampWindowsToBounds() {
        windows = windows.map { win in
            var copy = win
            let newSize = adjustedSize(for: copy.app)
            copy.size = newSize
            copy.position = clampedPosition(copy.position, size: newSize)
            return copy
        }
    }
}
