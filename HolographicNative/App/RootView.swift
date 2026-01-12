import SwiftUI

struct RootView: View {
    var body: some View {
        MainInterfaceView()
    }
}

#Preview {
    RootView().environmentObject(AppViewModel())
}
