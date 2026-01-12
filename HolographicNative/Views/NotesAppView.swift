import SwiftUI

struct NotesAppView: View {
    @AppStorage("notes.text") private var notes: String = ""

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Quick Notes").windowTitle()
            TextEditor(text: $notes)
                .frame(minHeight: 160)
                .padding(10)
                .background(Color.white.opacity(0.04), in: RoundedRectangle(cornerRadius: 14, style: .continuous))
                .overlay(RoundedRectangle(cornerRadius: 14, style: .continuous).stroke(Color.white.opacity(0.08)))
        }
    }
}
