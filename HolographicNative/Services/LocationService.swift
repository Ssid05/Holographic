import CoreLocation

enum LocationServiceError: Error {
    case denied
    case restricted
    case failed
}

final class LocationService: NSObject, CLLocationManagerDelegate {
    private let manager = CLLocationManager()
    private var continuation: CheckedContinuation<CLLocation, Error>?

    override init() {
        super.init()
        manager.delegate = self
    }

    func requestOnce() async throws -> CLLocation {
        if CLLocationManager.authorizationStatus() == .notDetermined {
            manager.requestWhenInUseAuthorization()
        }
        manager.startUpdatingLocation()
        return try await withCheckedThrowingContinuation { continuation in
            self.continuation = continuation
        }
    }

    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        if status == .denied || status == .restricted {
            continuation?.resume(throwing: LocationServiceError.denied)
            continuation = nil
            manager.stopUpdatingLocation()
        }
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.first else { return }
        continuation?.resume(returning: location)
        continuation = nil
        manager.stopUpdatingLocation()
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        continuation?.resume(throwing: error)
        continuation = nil
        manager.stopUpdatingLocation()
    }
}

extension CLLocation {
    func snapped(to target: CLLocation, withinMeters radius: CLLocationDistance) -> CLLocation {
        let distance = self.distance(from: target)
        return distance <= radius ? target : self
    }
}
