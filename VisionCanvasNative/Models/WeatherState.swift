import Foundation

struct WeatherState: Equatable {
    let city: String
    let tempC: Double
    let description: String
    let low: Double
    let high: Double
    let feelsLike: Double
}
