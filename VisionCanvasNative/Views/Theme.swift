import SwiftUI

struct GradientBackground: View {
    var body: some View {
        LinearGradient(colors: [Color(red: 0.06, green: 0.07, blue: 0.10), Color(red: 0.05, green: 0.09, blue: 0.16), Color(red: 0.09, green: 0.12, blue: 0.21)], startPoint: .topLeading, endPoint: .bottomTrailing)
    }
}

struct GlassPanel<Content: View>: View {
    let content: Content
    init(@ViewBuilder content: () -> Content) { self.content = content() }
    var body: some View {
        content
            .padding(16)
            .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 20, style: .continuous))
            .overlay(RoundedRectangle(cornerRadius: 20, style: .continuous).stroke(Color.white.opacity(0.12), lineWidth: 1))
    }
}

struct WindowTitleStyle: ViewModifier {
    func body(content: Content) -> some View {
        content.font(.system(.title3, design: .rounded).weight(.semibold)).foregroundStyle(.primary)
    }
}

extension View { func windowTitle() -> some View { modifier(WindowTitleStyle()) } }
