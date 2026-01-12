import SwiftUI

struct CalculatorAppView: View {
    @State private var display: String = "0"
    @State private var lastValue: Double = 0
    @State private var pendingOp: Operation?
    @State private var justEvaluated = false

    var body: some View {
        VStack(spacing: 12) {
            Text("Calculator").windowTitle()
            Spacer()
            HStack {
                Spacer()
                Text(display)
                    .font(.system(size: 48, weight: .medium, design: .rounded))
                    .foregroundStyle(.primary)
                    .lineLimit(1)
                    .minimumScaleFactor(0.5)
            }
            .padding(20)
            .background(.thinMaterial, in: RoundedRectangle(cornerRadius: 18, style: .continuous))

            VStack(spacing: 10) {
                HStack(spacing: 10) { makeButton("C", role: .destructive) { clear() }; makeButton("±") { toggleSign() }; makeButton("%") { percent() }; makeOpButton(.divide) }
                HStack(spacing: 10) { makeDigitRow(["7","8","9"], op: .multiply) }
                HStack(spacing: 10) { makeDigitRow(["4","5","6"], op: .subtract) }
                HStack(spacing: 10) { makeDigitRow(["1","2","3"], op: .add) }
                HStack(spacing: 10) {
                    makeButton("0", width: 140) { appendDigit("0") }
                    makeButton(".") { appendDot() }
                    makeOpButton(.equals)
                }
            }
        }
    }

    private func makeDigitRow(_ digits: [String], op: Operation) -> some View {
        HStack(spacing: 10) {
            ForEach(digits, id: \.self) { d in makeButton(d) { appendDigit(d) } }
            makeOpButton(op)
        }
    }

    private func makeButton(_ label: String, width: CGFloat = 60, role: ButtonRole? = nil, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(label)
                .font(.system(.title2, design: .rounded).weight(.medium))
                .frame(width: width, height: 60)
                .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
        }
        .buttonStyle(.plain)
        .foregroundStyle(role == .destructive ? Color.red : Color.primary)
    }

    private func makeOpButton(_ op: Operation) -> some View {
        makeButton(op.symbol, role: op == .equals ? nil : nil) { handleOp(op) }
    }

    // MARK: - Logic

    private func appendDigit(_ digit: String) {
        if justEvaluated || display == "0" { display = digit } else { display.append(digit) }
        justEvaluated = false
    }

    private func appendDot() {
        if justEvaluated { display = "0"; justEvaluated = false }
        if !display.contains(".") { display.append(".") }
    }

    private func toggleSign() { if display != "0" { display = display.hasPrefix("-") ? String(display.dropFirst()) : "-" + display } }
    private func percent() { if let v = Double(display) { display = format(v / 100) } }
    private func clear() { display = "0"; lastValue = 0; pendingOp = nil; justEvaluated = false }

    private func handleOp(_ op: Operation) {
        if op == .equals { evaluateIfNeeded() ; pendingOp = nil ; return }
        if let current = Double(display) { if pendingOp != nil { evaluateIfNeeded() } else { lastValue = current } }
        pendingOp = op
        justEvaluated = true
    }

    private func evaluateIfNeeded() {
        guard let op = pendingOp, let current = Double(display) else { return }
        let result: Double
        switch op {
        case .add: result = lastValue + current
        case .subtract: result = lastValue - current
        case .multiply: result = lastValue * current
        case .divide: result = current == 0 ? 0 : lastValue / current
        case .equals: result = current
        }
        display = format(result)
        lastValue = result
        justEvaluated = true
    }

    private func format(_ value: Double) -> String {
        let formatter = NumberFormatter()
        formatter.maximumFractionDigits = 6
        formatter.minimumFractionDigits = 0
        formatter.numberStyle = .decimal
        return formatter.string(from: NSNumber(value: value)) ?? "0"
    }

    private enum Operation: String { case add, subtract, multiply, divide, equals
        var symbol: String { switch self { case .add: return "+"; case .subtract: return "-"; case .multiply: return "×"; case .divide: return "÷"; case .equals: return "=" } }
    }
}
