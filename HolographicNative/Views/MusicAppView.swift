import SwiftUI

struct MusicAppView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Now Playing").windowTitle()
            HStack(spacing: 14) {
                RoundedRectangle(cornerRadius: 12).fill(Color.white.opacity(0.08)).frame(width: 68, height: 68).overlay(Image(systemName: "music.note"))
                VStack(alignment: .leading, spacing: 6) {
                    Text("Your favorite track").font(.headline)
                    Text("Artist name").foregroundStyle(.secondary)
                }
                Spacer()
                Button(action: {}) { Image(systemName: "backward.fill") }
                Button(action: {}) { Image(systemName: "play.fill") }
                Button(action: {}) { Image(systemName: "forward.fill") }
            }.buttonStyle(.plain)
        }
    }
}
