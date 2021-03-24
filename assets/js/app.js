// DOM SELECTORS
inputCityEl = document.querySelector("#input-city");
btnSearch = document.querySelector("#btn-search");
savedCitiesEl = document.querySelector("#saved-cities");

// VARIABLES
const keyOpenWeather = "0bb338e53966913f3a5d9c70366f0e35";

// FUNCTIONS
// Handle getting city weather
const handleCityWeatherRequest = async (city) => {
  let cityWeather;

  //
  try {
    // Get City lat & long
    const cityLatLon = await geocodeCity(city);
    // Get City weather data
    cityWeather = await getWeatherData(cityLatLon);
  } catch (error) {
    console.warn(error);
    return;
  }

  // Display weather results
  // console.log(cityWeather);
  displayForecastCurrent(city, cityWeather.current);
  displayForecast5Day(cityWeather.daily);
};

// Evaluate latitude and longitude of city name
const geocodeCity = async (city) => {
  // Create request url
  let geocodeURL = "http://api.openweathermap.org/geo/1.0/direct?";
  geocodeURL += `q=${city.toLowerCase()}`;
  geocodeURL += `&limit=2&appid=${keyOpenWeather}`;

  // Call OpenWeather Geocoding API
  const response = await fetch(geocodeURL);

  // if bad response - throw error and console log in calling function catch
  // else - convert response to JSON
  if (!response.ok) {
    throw response.json();
  }
  const data = await response.json();

  // if no data returned - indicate no results found
  // else - return lat & long for city
  if (!data.length) {
    throw `No results found for ${city}`;
  }
  const cityFound = data[0];
  return { lat: cityFound.lat, lon: cityFound.lon };
};

// Perform openweather API call
const getWeatherData = async (latlon) => {
  // Create request url
  let weatherURL = "https://api.openweathermap.org/data/2.5/onecall?";
  weatherURL += `lat=${latlon.lat}&lon=${latlon.lon}`;
  weatherURL += `&exclude=minutely,hourly,alerts&units=imperial&appid=${keyOpenWeather}`;

  // Call OpenWeather one call API
  const response = await fetch(weatherURL);

  // if bad response - throw error and console log in calling function catch
  // else - convert response to JSON and return
  if (!response.ok) {
    throw response.json();
  }
  return await response.json();
};

// Update current weather forecast card
const displayForecastCurrent = (place, weather) => {
  console.log(place);
  console.log(weather);
};

// Update future weather forecast cards
const displayForecast5Day = (weather) => {};

// Save city name to local storage
const saveCityName = () => {};

// Render list of city names
const displayCityNames = () => {};

// Add city to list of searched cities
const displayCityName = () => {};

// Load city names from storage
const loadCityNames = () => {};

// Handle city search from form entry
const handleCitySearch = () => {
  // Get input city name
  const inputCity = inputCityEl.value;

  // if non-empty string - get city weather
  if (inputCity) {
    // inputCityEl.value = "";
    handleCityWeatherRequest(inputCity);
  }
};

// Handle city search from list of saved cities
const handleSavedCitySearch = (event) => {
  // Get selected city name
  const selectCity = event.target.textContent;

  // Get city weather
  handleCityWeatherRequest(selectCity);
};

// EVENT LISTENERS
// Text entry search
btnSearch.addEventListener("click", handleCitySearch);

// Saved city search
savedCitiesEl.addEventListener("click", handleSavedCitySearch);
