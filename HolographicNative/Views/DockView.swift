import SwiftUI

struct DockView: View {
    @EnvironmentObject private var model: AppViewModel
    var parallax: MotionParallaxManager?

    var body: some View {
        HStack(spacing: 12) {
            ForEach(model.dockApps) { app in
                Button { model.open(app: app) } label: {
                    VStack(spacing: 6) {
                        Image(systemName: app.symbol)
                            .font(.system(size: 22, weight: .semibold))
                        Text(app.title)
                            .font(.caption)
                            .foregroundStyle(.primary.opacity(0.8))
                    }
                    .padding(10)
                    .frame(width: 78, height: 78)
                    .glassCard(cornerRadius: 18, glow: model.boostEffects, shadowOpacity: 0.18)
                }
                .buttonStyle(.plain)
            }
        }
        .padding(.horizontal, 24)
        .padding(.vertical, 14)
        .background(
            Capsule(style: .continuous)
                .fill(.ultraThinMaterial)
                .overlay(Capsule(style: .continuous).stroke(Color.white.opacity(0.12), lineWidth: 1))
                .shadow(color: Color.black.opacity(0.18), radius: 18, x: 0, y: 10)
        )
        .frame(maxWidth: 460)
        .padding(.bottom, 20)
        .padding(.top, 6)
        .parallax(parallax ?? MotionParallaxManager(), depth: 0.05)
    }
}
