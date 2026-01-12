import SwiftUI

struct WindowChrome: View {
    let title: String
    let app: AppType
    let onClose: () -> Void
    let onMinimize: () -> Void
    let onFocus: () -> Void

    var body: some View {
        HStack(spacing: 10) {
            Circle().fill(Color.red.opacity(0.85)).frame(width: 12, height: 12).onTapGesture { onClose() }
            Circle().fill(Color.yellow.opacity(0.85)).frame(width: 12, height: 12).onTapGesture { onMinimize() }
            Circle().fill(Color.green.opacity(0.85)).frame(width: 12, height: 12).onTapGesture { onFocus() }
            Divider().frame(height: 12).opacity(0.3)
            Label(title, systemImage: app.symbol)
                .font(.system(.subheadline, design: .rounded).weight(.semibold))
                .foregroundStyle(.primary)
            Spacer()
            Text(app.title)
                .font(.caption.weight(.semibold))
                .foregroundStyle(.secondary)
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 10)
        .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
        .overlay(RoundedRectangle(cornerRadius: 16, style: .continuous).stroke(Color.white.opacity(0.14), lineWidth: 1))
    }
}
