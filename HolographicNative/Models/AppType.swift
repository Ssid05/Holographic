import Foundation

enum AppType: String, CaseIterable, Identifiable {
    case dashboard
    case weather
    case notes
    case music
    case calculator
    case assistant

    var id: String { rawValue }

    var title: String {
        switch self {
        case .dashboard: return "Dashboard"
        case .weather: return "Weather"
        case .notes: return "Notes"
        case .music: return "Music"
        case .calculator: return "Calculator"
        case .assistant: return "Assistant"
        }
    }

    var symbol: String {
        switch self {
        case .dashboard: return "chart.bar"
        case .weather: return "cloud.sun"
        case .notes: return "note.text"
        case .music: return "music.note"
        case .calculator: return "plus.forwardslash.minus"
        case .assistant: return "sparkles"
        }
    }

    var preferredSize: CGSize {
        switch self {
        case .dashboard: return CGSize(width: 360, height: 240)
        case .weather: return CGSize(width: 320, height: 220)
        case .notes: return CGSize(width: 320, height: 260)
        case .music: return CGSize(width: 320, height: 200)
        case .calculator: return CGSize(width: 300, height: 360)
        case .assistant: return CGSize(width: 360, height: 260)
        }
    }
}
