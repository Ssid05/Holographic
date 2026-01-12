from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Optional

import requests

MORADABAD = (28.8389, 78.7768)


@dataclass
class Weather:
    location: str
    temperature: float
    description: str


def _open_meteo(lat: float, lon: float) -> Optional[Weather]:
    url = (
        "https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}&current=temperature_2m,weather_code&timezone=auto"
    )
    resp = requests.get(url, timeout=8)
    resp.raise_for_status()
    data = resp.json()
    current = data.get("current", {})
    temp = float(current.get("temperature_2m", 0.0))
    code = int(current.get("weather_code", 0))
    desc = _code_to_desc(code)
    return Weather(location="Auto", temperature=temp, description=desc)


def _geocode(city: str) -> Optional[tuple[float, float]]:
    url = f"https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1"
    resp = requests.get(url, timeout=8)
    resp.raise_for_status()
    data = resp.json()
    results = data.get("results") or []
    if not results:
        return None
    first = results[0]
    return float(first.get("latitude", MORADABAD[0])), float(first.get("longitude", MORADABAD[1]))


def fetch_weather(city: str | None = None) -> Weather:
    # Try requested city, then Moradabad fallback, then static.
    try:
        latlon = MORADABAD
        if city:
            maybe = _geocode(city)
            if maybe:
                latlon = maybe
        weather = _open_meteo(*latlon)
        if weather:
            loc_name = city or "Moradabad"
            return Weather(location=loc_name, temperature=weather.temperature, description=weather.description)
    except Exception:
        pass
    return Weather(location="Moradabad (offline)", temperature=26.0, description="Clear")


def _code_to_desc(code: int) -> str:
    mapping = {
        0: "Clear",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        53: "Drizzle",
        55: "Dense drizzle",
        61: "Slight rain",
        63: "Rain",
        65: "Heavy rain",
        80: "Rain showers",
        95: "Thunderstorm",
    }
    return mapping.get(code, "Weather")
