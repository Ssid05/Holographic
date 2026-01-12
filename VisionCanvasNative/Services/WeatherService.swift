import Foundation

struct WeatherPayload {
    let tempC: Double
    let feelsLike: Double
    let low: Double
    let high: Double
    let description: String
}

final class WeatherService {
    func fetch(lat: Double, lon: Double) async throws -> WeatherPayload {
        let urlString = "https://api.open-meteo.com/v1/forecast?latitude=\(lat)&longitude=\(lon)&current=temperature_2m,apparent_temperature,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto"
        guard let url = URL(string: urlString) else { throw URLError(.badURL) }
        let (data, response) = try await URLSession.shared.data(from: url)
        guard let http = response as? HTTPURLResponse, http.statusCode == 200 else {
            throw URLError(.badServerResponse)
        }
        let decoded = try JSONDecoder().decode(ForecastResponse.self, from: data)
        let current = decoded.current
        let low = decoded.daily.temperature_2m_min.first ?? current.temperature_2m
        let high = decoded.daily.temperature_2m_max.first ?? current.temperature_2m
        let description = Self.description(for: current.weather_code)
        return WeatherPayload(tempC: current.temperature_2m, feelsLike: current.apparent_temperature, low: low, high: high, description: description)
    }

    func reverseGeocode(lat: Double, lon: Double) async throws -> String? {
        if let city = try await reverseGeocodeViaOpenMeteo(lat: lat, lon: lon) {
            return city
        }
        return try await reverseGeocodeViaNominatim(lat: lat, lon: lon)
    }

    private func reverseGeocodeViaOpenMeteo(lat: Double, lon: Double) async throws -> String? {
        let urlString = "https://geocoding-api.open-meteo.com/v1/reverse?latitude=\(lat)&longitude=\(lon)&count=1&language=en"
        guard let url = URL(string: urlString) else { throw URLError(.badURL) }
        let (data, response) = try await URLSession.shared.data(from: url)
        guard let http = response as? HTTPURLResponse, http.statusCode == 200 else { throw URLError(.badServerResponse) }
        let decoded = try JSONDecoder().decode(OpenMeteoReverseResponse.self, from: data)
        return decoded.results.first?.name
    }

    private func reverseGeocodeViaNominatim(lat: Double, lon: Double) async throws -> String? {
        var components = URLComponents(string: "https://nominatim.openstreetmap.org/reverse")
        components?.queryItems = [
            URLQueryItem(name: "format", value: "json"),
            URLQueryItem(name: "lat", value: String(lat)),
            URLQueryItem(name: "lon", value: String(lon)),
            URLQueryItem(name: "zoom", value: "10"),
            URLQueryItem(name: "addressdetails", value: "1")
        ]
        guard let url = components?.url else { throw URLError(.badURL) }
        var request = URLRequest(url: url)
        request.setValue("VisionCanvasNative/1.0", forHTTPHeaderField: "User-Agent")
        let (data, response) = try await URLSession.shared.data(for: request)
        guard let http = response as? HTTPURLResponse, http.statusCode == 200 else { throw URLError(.badServerResponse) }
        let decoded = try JSONDecoder().decode(NominatimReverseResponse.self, from: data)
        return decoded.address.city ?? decoded.address.town ?? decoded.address.village ?? decoded.address.county
    }

    private static func description(for code: Int) -> String {
        switch code {
        case 0: return "Clear"
        case 1, 2: return "Partly Cloudy"
        case 3: return "Cloudy"
        case 45, 48: return "Fog"
        case 51, 53, 55: return "Drizzle"
        case 56, 57: return "Freezing Drizzle"
        case 61, 63, 65: return "Rain"
        case 66, 67: return "Freezing Rain"
        case 71, 73, 75: return "Snow"
        case 77: return "Snow Grains"
        case 80, 81, 82: return "Showers"
        case 85, 86: return "Snow Showers"
        case 95: return "Thunderstorm"
        case 96, 99: return "Thunderstorm + Hail"
        default: return "Weather"
        }
    }
}

private struct ForecastResponse: Decodable { let current: Current; let daily: Daily }
private struct Current: Decodable { let temperature_2m: Double; let apparent_temperature: Double; let weather_code: Int }
private struct Daily: Decodable { let temperature_2m_max: [Double]; let temperature_2m_min: [Double] }
private struct OpenMeteoReverseResponse: Decodable { let results: [Place]; struct Place: Decodable { let name: String } }
private struct NominatimReverseResponse: Decodable { let address: Address; struct Address: Decodable { let city: String?; let town: String?; let village: String?; let county: String? } }
