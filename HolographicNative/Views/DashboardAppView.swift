import SwiftUI

struct DashboardAppView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Dashboard").windowTitle()
            HStack(spacing: 12) {
                StatCard(title: "Focus", value: "68%", color: .blue)
                StatCard(title: "Energy", value: "82%", color: .green)
                StatCard(title: "Flow", value: "74%", color: .purple)
            }
        }
    }
}

private struct StatCard: View {
    let title: String
    let value: String
    let color: Color
    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title).foregroundStyle(.secondary).font(.caption)
            Text(value).font(.system(.title2, design: .rounded).weight(.semibold))
        }
        .padding(12)
        .frame(maxWidth: .infinity)
        .background(color.opacity(0.18), in: RoundedRectangle(cornerRadius: 14, style: .continuous))
    }
}
