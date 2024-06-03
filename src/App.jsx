import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  const fetchCoordinates = async (cityName) => {
    const API_KEY = '6fa6f0d37f1dfd059fc65c6758f539fd';
    const URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
    try {
      const response = await axios.get(URL);
      if (response.data.length > 0) {
        return { lat: response.data[0].lat, lon: response.data[0].lon };
      } else {
        throw new Error('Location not found');
      }
    } catch (error) {
      throw new Error('Error fetching location data: ' + error.message);
    }
  };

  const fetchWeatherData = async (lat, lon) => {
    const API_KEY = '6fa6f0d37f1dfd059fc65c6758f539fd';
    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    try {
      const response = await axios.get(URL);
      setWeatherData(response.data);
    } catch (error) {
      setError('Error fetching weather data: ' + error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setWeatherData(null);

    try {
      const { lat, lon } = await fetchCoordinates(city);
      await fetchWeatherData(lat, lon);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
        />
        <button type="submit">Get Weather</button>
      </form>
      {error && <p>{error}</p>}
      {weatherData ? (
        <div>
          <h2>{weatherData.name}</h2>
          <p>Temperature: {Math.round(weatherData.main.temp - 273.15)}°C</p>
          <p>Weather: {weatherData.weather[0].description}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
