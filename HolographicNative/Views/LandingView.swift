import SwiftUI

struct LandingView: View {
    var onStart: () -> Void

    var body: some View {
        VStack(spacing: 28) {
            Text("Vision Canvas")
                .font(.system(size: 42, weight: .semibold, design: .rounded))
                .foregroundStyle(.white)
            Text("A visionOS-inspired canvas for iPhone and iPad.")
                .font(.system(.title3, design: .rounded))
                .foregroundStyle(.white.opacity(0.8))
                .multilineTextAlignment(.center)
                .frame(maxWidth: 420)
            Button(action: onStart) {
                HStack(spacing: 10) {
                    Image(systemName: "sparkles")
                    Text("Enter Demo").fontWeight(.semibold)
                }
                .padding(.horizontal, 20).padding(.vertical, 12)
                .background(.ultraThinMaterial, in: Capsule())
                .overlay(Capsule().stroke(Color.white.opacity(0.18), lineWidth: 1))
            }
            .buttonStyle(.plain)
        }
        .padding(32)
        .background(RoundedRectangle(cornerRadius: 28, style: .continuous).fill(.ultraThinMaterial).overlay(RoundedRectangle(cornerRadius: 28, style: .continuous).stroke(Color.white.opacity(0.14), lineWidth: 1)))
        .padding()
    }
}
