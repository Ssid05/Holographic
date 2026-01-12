import SwiftUI

struct StatusBarView: View {
    var onEnd: () -> Void
    var onToggleDemo: () -> Void
    var strongEffects: Bool
    var location: String

    var body: some View {
        HStack(spacing: 12) {
            HStack(spacing: 8) {
                Image(systemName: "sparkles")
                Text("Vision Canvas")
            }
            .font(.system(.subheadline, design: .rounded).weight(.semibold))
            .padding(.horizontal, 12)
            .padding(.vertical, 9)
            .glassCard(cornerRadius: 14, glow: strongEffects, shadowOpacity: 0.14)

            Spacer(minLength: 8)

            HStack(spacing: 12) {
                Label("\(Date(), formatter: Self.timeFormatter)", systemImage: "clock")
                Label(location, systemImage: "location.fill")
                Button(action: onToggleDemo) {
                    Label(strongEffects ? "Demo Mode" : "Calm Mode", systemImage: strongEffects ? "aqi.medium" : "circle.grid.cross")
                }
                .buttonStyle(.borderedProminent)
                .tint(strongEffects ? .blue : .gray)
                Button(action: onEnd) {
                    Label("End", systemImage: "xmark.circle.fill")
                }
                .buttonStyle(.bordered)
            }
            .labelStyle(.titleAndIcon)
            .font(.system(.subheadline, design: .rounded).weight(.semibold))
            .padding(.horizontal, 12)
            .padding(.vertical, 9)
            .glassCard(cornerRadius: 14, glow: strongEffects, shadowOpacity: 0.12)
        }
        .frame(maxWidth: .infinity)
        .foregroundStyle(.primary)
        .padding(.horizontal, 12)
        .padding(.top, 8)
    }

    private static let timeFormatter: DateFormatter = {
        let df = DateFormatter()
        df.dateFormat = "HH:mm"
        return df
    }()
}
