import SwiftUI

struct WeatherAppView: View {
    @StateObject private var vm = WeatherViewModel()

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            if vm.isLoading {
                ProgressView("Fetching weather…")
            } else if let state = vm.state {
                Text(state.city).font(.system(.title2, design: .rounded).weight(.semibold))
                Text("\(Int(state.tempC))°").font(.system(size: 56, weight: .semibold, design: .rounded))
                Text(state.description).foregroundStyle(.primary.opacity(0.8))
                Text("Feels \(Int(state.feelsLike))°, \(Int(state.low))°–\(Int(state.high))°").foregroundStyle(.primary.opacity(0.7))
            } else if let error = vm.error {
                Text(error).foregroundStyle(.red)
            }
            Button { Task { await vm.load() } } label: {
                Label("Refresh", systemImage: "arrow.clockwise")
                    .font(.system(.callout, design: .rounded).weight(.semibold))
                    .padding(.horizontal, 12).padding(.vertical, 8)
                    .background(.ultraThinMaterial, in: Capsule())
            }.buttonStyle(.plain)
        }
        .task { await vm.load() }
    }
}
