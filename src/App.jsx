import React, { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

const App = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const lastCity = localStorage.getItem('lastCity');
    if (lastCity) {
      setCity(lastCity);
      fetchWeatherForCity(lastCity);
    }
  }, []);

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

  const fetchWeatherForCity = async (cityName) => {
    setError(null);
    setWeatherData(null);
    try {
      const { lat, lon } = await fetchCoordinates(cityName);
      await fetchWeatherData(lat, lon);
      localStorage.setItem('lastCity', cityName);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await fetchWeatherForCity(city);
  };

  return (
    <div className="center">
      <h1>Not your Tropical</h1> 
      <h1>Weather App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
          style={{ width: "100%", maxWidth: "300px", fontSize: "16px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}
        />
        <button type="submit" style={{ fontSize: "20px", padding: "10px 20px", margin: "10px 0", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px" }}>Get Weather</button>
      </form>
      {error && <p>{error}</p>}
      {weatherData ? (
        <div>
          <h2>{weatherData.name}</h2>
          <p>Temperature: {Math.round(weatherData.main.temp - 273.15)}°C</p>
          <p>Weather: {weatherData.weather[0].description}</p>
        </div>
      ) : (
        !error && <p></p>
      )}
    </div>
  );
}

export default App;
