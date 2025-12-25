import { useState, useEffect } from 'react';
import { VoiceController } from '../../services/voiceController';
import './AppStyles.css';

interface Props {
  onClose: () => void;
  voiceController: VoiceController | null;
}

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  wind: number;
  feelsLike: number;
}

export default function WeatherApp({ onClose, voiceController }: Props) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLocationAndWeather();
  }, []);

  const getLocationAndWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=auto`
      );
      
      if (!response.ok) throw new Error('Weather data unavailable');
      
      const data = await response.json();
      
      const locationResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const locationData = await locationResponse.json();
      
      const weatherData: WeatherData = {
        location: locationData.address?.city || locationData.address?.town || locationData.address?.village || 'Your Location',
        temperature: Math.round(data.current.temperature_2m),
        condition: getWeatherCondition(data.current.weather_code),
        humidity: data.current.relative_humidity_2m,
        wind: Math.round(data.current.wind_speed_10m),
        feelsLike: Math.round(data.current.apparent_temperature)
      };
      
      setWeather(weatherData);
      
      if (voiceController) {
        const speech = `Current weather in ${weatherData.location}: ${weatherData.temperature} degrees Celsius, ${weatherData.condition}. It feels like ${weatherData.feelsLike} degrees.`;
        voiceController.speak(speech);
      }
    } catch (err: any) {
      if (err.code === 1) {
        setError('Location access denied. Please enable location services.');
      } else {
        setError('Unable to get weather data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getWeatherCondition = (code: number): string => {
    const conditions: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      80: 'Rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      95: 'Thunderstorm',
    };
    return conditions[code] || 'Unknown';
  };

  const getWeatherIcon = (condition: string): string => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) return '☀️';
    if (lowerCondition.includes('cloud')) return '☁️';
    if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) return '🌧️';
    if (lowerCondition.includes('snow')) return '❄️';
    if (lowerCondition.includes('thunder')) return '⛈️';
    if (lowerCondition.includes('fog')) return '🌫️';
    return '🌤️';
  };

  return (
    <div className="app-window glass-panel">
      <div className="app-header">
        <h2>Weather</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="weather-content">
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Getting your location...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <p>{error}</p>
            <button className="glass-button" onClick={getLocationAndWeather}>
              Try Again
            </button>
          </div>
        )}

        {weather && !loading && (
          <div className="weather-display fade-in">
            <div className="weather-location">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{weather.location}</span>
            </div>

            <div className="weather-main">
              <span className="weather-icon">{getWeatherIcon(weather.condition)}</span>
              <div className="temperature-display">
                <span className="temperature">{weather.temperature}°</span>
                <span className="condition">{weather.condition}</span>
              </div>
            </div>

            <div className="weather-details">
              <div className="detail-item">
                <span className="detail-label">Feels Like</span>
                <span className="detail-value">{weather.feelsLike}°</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Humidity</span>
                <span className="detail-value">{weather.humidity}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Wind</span>
                <span className="detail-value">{weather.wind} km/h</span>
              </div>
            </div>

            <button className="glass-button refresh-button" onClick={getLocationAndWeather}>
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
