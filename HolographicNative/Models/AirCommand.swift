import Foundation

enum AirGesture: String {
    case pinch = "Pinch"
    case openPalm = "Open Palm"
    case unknown = "Unknown"

    var label: String { rawValue }

    var mappedCommand: AirCommand? {
        switch self {
        case .pinch: return .select
        case .openPalm: return .toggleMode
        case .unknown: return nil
        }
    }
}

enum AirCommand {
    case select
    case toggleMode
    case resetWorkspace

    var description: String {
        switch self {
        case .select: return "Select"
        case .toggleMode: return "Toggle Mode"
        case .resetWorkspace: return "Reset Workspace"
        }
    }
}
