import SwiftUI

struct GlassBackground: ViewModifier {
    var cornerRadius: CGFloat = 22
    var glow: Bool = true
    var shadowOpacity: Double = 0.22

    func body(content: Content) -> some View {
        content
            .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: cornerRadius, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                    .strokeBorder(LinearGradient(colors: [Color.white.opacity(0.35), Color.white.opacity(0.08)], startPoint: .topLeading, endPoint: .bottomTrailing), lineWidth: 1)
            )
            .shadow(color: Color.blue.opacity(glow ? shadowOpacity : 0), radius: glow ? 22 : 0, x: 0, y: 14)
            .shadow(color: Color.black.opacity(0.15), radius: 18, x: 0, y: 10)
    }
}

extension View {
    func glassCard(cornerRadius: CGFloat = 22, glow: Bool = true, shadowOpacity: Double = 0.22) -> some View {
        modifier(GlassBackground(cornerRadius: cornerRadius, glow: glow, shadowOpacity: shadowOpacity))
    }
}
