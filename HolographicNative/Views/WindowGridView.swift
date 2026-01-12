import SwiftUI

struct WindowGridView: View {
    let windows: [AppWindow]
    let onClose: (AppType) -> Void

    private let columns = [GridItem(.adaptive(minimum: 280, maximum: 420), spacing: 16, alignment: .top)]

    var body: some View {
        ScrollView(showsIndicators: false) {
            LazyVGrid(columns: columns, spacing: 16) {
                ForEach(windows) { window in
                    AppWindowContainer(kind: window.kind) { onClose(window.kind) }
                }
            }
            .padding(.horizontal, 24)
            .padding(.vertical, 8)
        }
    }
}

private struct AppWindowContainer: View {
    let kind: AppType
    let onClose: () -> Void

    @ViewBuilder
    var body: some View {
        GlassPanel {
            HStack {
                Text(kind.title).windowTitle()
                Spacer()
                Button(action: onClose) {
                    Image(systemName: "xmark").font(.system(size: 14, weight: .semibold)).foregroundStyle(.primary.opacity(0.7)).padding(6).background(.ultraThinMaterial, in: Circle())
                }.buttonStyle(.plain)
            }.padding(.bottom, 4)

            switch kind {
            case .weather: WeatherAppView()
            case .notes: NotesAppView()
            case .music: MusicAppView()
            case .dashboard: DashboardAppView()
            case .calculator: CalculatorAppView()
            case .assistant: AssistantAppView()
            }
        }
    }
}
