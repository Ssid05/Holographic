import SwiftUI

struct AssistantAppView: View {
    @State private var prompt: String = ""
    @State private var response: String = "Ask me anything about your space."

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Assistant").windowTitle()
            TextField("Ask a question...", text: $prompt)
                .textFieldStyle(.roundedBorder)
                .onSubmit { respond() }
            Button("Send") { respond() }
                .buttonStyle(.borderedProminent)
            Text(response)
                .font(.body)
                .foregroundStyle(.secondary)
                .padding(12)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 14, style: .continuous))
        }
    }

    private func respond() {
        guard prompt.isEmpty == false else { return }
        response = "Pretend response to: \(prompt)"
        prompt = ""
    }
}
