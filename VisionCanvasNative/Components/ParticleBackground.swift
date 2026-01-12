import SwiftUI

struct ParticleBackground: View {
    struct Particle: Identifiable {
        let id = UUID()
        let origin: CGPoint
        let radius: CGFloat
        let speed: CGFloat
        let opacity: Double
        let hue: Double
    }

    private let particles: [Particle]
    private let animate: Bool

    init(count: Int = 60, animate: Bool = true) {
        self.animate = animate
        self.particles = (0..<count).map { _ in
            Particle(
                origin: CGPoint(x: CGFloat.random(in: 0...1), y: CGFloat.random(in: 0...1)),
                radius: CGFloat.random(in: 1.0...3.5),
                speed: CGFloat.random(in: 6...14),
                opacity: Double.random(in: 0.15...0.45),
                hue: Double.random(in: 200/360...225/360)
            )
        }
    }

    var body: some View {
        TimelineView(.animation) { timeline in
            Canvas { context, size in
                let time = timeline.date.timeIntervalSinceReferenceDate
                for particle in particles {
                    var position = particle.origin
                    if animate {
                        let driftX = sin(time * Double(particle.speed) + Double(particle.id.uuidString.hashValue % 7)) * 0.004
                        let driftY = cos(time * Double(particle.speed) + Double(particle.id.uuidString.hashValue % 5)) * 0.003
                        position.x = (position.x + driftX).truncatingRemainder(dividingBy: 1)
                        position.y = (position.y + driftY).truncatingRemainder(dividingBy: 1)
                    }
                    let point = CGPoint(x: position.x * size.width, y: position.y * size.height)
                    var circle = Path(ellipseIn: CGRect(origin: point, size: CGSize(width: particle.radius, height: particle.radius)))
                    context.addFilter(.blur(radius: particle.radius * 0.9))
                    context.opacity = particle.opacity
                    context.fill(circle, with: .radialGradient(Gradient(colors: [Color(hue: particle.hue, saturation: 0.4, brightness: 1.0), .clear]), center: point, startRadius: 0, endRadius: particle.radius * 3.2))
                }
            }
        }
        .ignoresSafeArea()
        .allowsHitTesting(false)
    }
}
