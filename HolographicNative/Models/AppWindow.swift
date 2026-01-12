import Foundation

struct AppWindow: Identifiable, Equatable {
    let id = UUID()
    let kind: AppType
}
