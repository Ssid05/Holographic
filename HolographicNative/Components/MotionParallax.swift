import SwiftUI
import CoreMotion

final class MotionParallaxManager: ObservableObject {
    @Published var offset: CGSize = .zero
    private let manager = CMMotionManager()

    func start(intensity: CGFloat = 18) {
        guard manager.isDeviceMotionAvailable else { return }
        manager.deviceMotionUpdateInterval = 1.0 / 60.0
        manager.startDeviceMotionUpdates(to: .main) { [weak self] motion, _ in
            guard let motion else { return }
            let roll = motion.attitude.roll
            let pitch = motion.attitude.pitch
            let x = CGFloat(roll) * intensity
            let y = CGFloat(pitch) * intensity
            self?.offset = CGSize(width: x, height: y)
        }
    }

    func stop() { manager.stopDeviceMotionUpdates() }
}

struct ParallaxEffect: ViewModifier {
    @ObservedObject var manager: MotionParallaxManager
    var depth: CGFloat

    func body(content: Content) -> some View {
        content.offset(x: manager.offset.width * depth, y: manager.offset.height * depth)
    }
}

extension View {
    func parallax(_ manager: MotionParallaxManager, depth: CGFloat = 1) -> some View {
        modifier(ParallaxEffect(manager: manager, depth: depth))
    }
}
