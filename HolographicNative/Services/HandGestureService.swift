import AVFoundation
import Foundation
import Vision

final class HandGestureService: NSObject, ObservableObject {
    @Published var lastGesture: AirGesture? = nil
    @Published var confidence: Double = 0

    private let session = AVCaptureSession()
    private let sessionQueue = DispatchQueue(label: "hand-gesture-session")
    private let visionQueue = DispatchQueue(label: "hand-gesture-vision", qos: .userInitiated)
    private let request = VNDetectHumanHandPoseRequest()

    private var isConfigured = false
    private var isProcessingFrame = false

    func start() async {
        request.maximumHandCount = 1
        let authorized = await requestCameraAccess()
        guard authorized else { return }
        guard configureSessionIfNeeded() else { return }
        session.startRunning()
    }

    func stop() {
        session.stopRunning()
    }

    private func requestCameraAccess() async -> Bool {
        switch AVCaptureDevice.authorizationStatus(for: .video) {
        case .authorized:
            return true
        case .notDetermined:
            return await withCheckedContinuation { continuation in
                AVCaptureDevice.requestAccess(for: .video) { granted in
                    continuation.resume(returning: granted)
                }
            }
        default:
            return false
        }
    }

    private func configureSessionIfNeeded() -> Bool {
        guard !isConfigured else { return session.inputs.isEmpty == false }

        var configured = false
        sessionQueue.sync {
            session.beginConfiguration()
            defer { session.commitConfiguration() }
            session.sessionPreset = .medium

            guard let device = AVCaptureDevice.default(.builtInWideAngleCamera, for: .video, position: .front),
                  let input = try? AVCaptureDeviceInput(device: device),
                  session.canAddInput(input) else {
                return
            }
            session.addInput(input)

            let output = AVCaptureVideoDataOutput()
            output.alwaysDiscardsLateVideoFrames = true
            output.setSampleBufferDelegate(self, queue: visionQueue)
            guard session.canAddOutput(output) else { return }
            session.addOutput(output)

            if let connection = output.connection(with: .video), connection.isVideoOrientationSupported {
                connection.videoOrientation = .portrait
            }

            configured = true
        }

        if configured { isConfigured = true }
        return configured
    }
}

extension HandGestureService: AVCaptureVideoDataOutputSampleBufferDelegate {
    func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
        guard !isProcessingFrame else { return }
        isProcessingFrame = true
        defer { isProcessingFrame = false }

        guard let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return }
        let handler = VNImageRequestHandler(cvPixelBuffer: pixelBuffer, orientation: .up, options: [:])
        do {
            try handler.perform([request])
            guard let observation = request.results?.first else { return }
            handleObservation(observation)
        } catch {
            return
        }
    }

    private func handleObservation(_ observation: VNHumanHandPoseObservation) {
        let gesture = classify(observation)
        guard gesture != .unknown else { return }
        let confidence = min(observation.confidence, 1.0)

        DispatchQueue.main.async {
            self.lastGesture = gesture
            self.confidence = Double(confidence)
        }
    }

    private func classify(_ observation: VNHumanHandPoseObservation) -> AirGesture {
        guard let thumbTip = try? observation.recognizedPoint(.thumbTip),
              let indexTip = try? observation.recognizedPoint(.indexTip),
              thumbTip.confidence > 0.35,
              indexTip.confidence > 0.35 else { return .unknown }

        let pinchDistance = hypot(thumbTip.location.x - indexTip.location.x, thumbTip.location.y - indexTip.location.y)
        if pinchDistance < 0.08 { return .pinch }

        guard let wrist = try? observation.recognizedPoint(.wrist),
              let middleTip = try? observation.recognizedPoint(.middleTip),
              let ringTip = try? observation.recognizedPoint(.ringTip),
              let littleTip = try? observation.recognizedPoint(.littleTip) else { return .unknown }

        let tips = [thumbTip, indexTip, middleTip, ringTip, littleTip]
        let averageSpread = tips.map { tip in
            hypot(tip.location.x - wrist.location.x, tip.location.y - wrist.location.y)
        }.reduce(0, +) / Double(tips.count)

        if averageSpread > 0.35 { return .openPalm }
        return .unknown
    }
}
