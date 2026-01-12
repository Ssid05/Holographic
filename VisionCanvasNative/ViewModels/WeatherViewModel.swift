import Foundation
import CoreLocation

@MainActor
final class WeatherViewModel: ObservableObject {
    @Published var state: WeatherState?
    @Published var error: String?
    @Published var isLoading = false

    private let location = LocationService()
    private let weather = WeatherService()

    private let moradabad = CLLocation(latitude: 28.8389, longitude: 78.7768)
    private let snapRadius: CLLocationDistance = 40_000

    func load() async {
        isLoading = true
        error = nil
        defer { isLoading = false }

        do {
            let loc = try await location.requestOnce()
            let snapped = loc.snapped(to: moradabad, withinMeters: snapRadius)
            let city = try await weather.reverseGeocode(lat: snapped.coordinate.latitude, lon: snapped.coordinate.longitude) ?? "Moradabad"
            let payload = try await weather.fetch(lat: snapped.coordinate.latitude, lon: snapped.coordinate.longitude)
            state = WeatherState(city: city, tempC: payload.tempC, description: payload.description, low: payload.low, high: payload.high, feelsLike: payload.feelsLike)
        } catch {
            state = WeatherState(city: "Moradabad", tempC: 26.0, description: "Clear", low: 24.0, high: 30.0, feelsLike: 27.0)
            self.error = error.localizedDescription
        }
    }
}
