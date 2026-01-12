import SwiftUI

@main
struct VisionCanvasApp: App {
    @StateObject private var appModel = AppViewModel()

    var body: some Scene {
#if os(visionOS)
        WindowGroup {
            VisionSpaceView()
                .environmentObject(appModel)
        }
        .windowStyle(.volumetric)
        .defaultSize(width: 1.4, height: 1.0, depth: 1.4, in: .meters)
#else
        WindowGroup {
            RootView()
                .environmentObject(appModel)
        }
#endif
    }
}
