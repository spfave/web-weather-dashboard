// DOM SELECTORS
inputCityEl = document.querySelector("#input-city");
btnSearch = document.querySelector("#btn-search");
savedCitiesEl = document.querySelector("#saved-cities");

// VARIABLES
const keyOpenWeather = "0bb338e53966913f3a5d9c70366f0e35";

// FUNCTIONS
// Handle getting city weather
const getCityWeather = async (city) => {
  try {
    // Get City lat & long
    const cityLatLon = await geocodeCity(city);
    const cityWeather = await getWeatherData(cityLatLon);
    console.log(cityWeather);
  } catch (error) {
    console.warn(error);
  }
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
  // https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lng}&exclude=minutely,hourly,alerts&appid={API key}
  // Create request url
  let weatherURL = "https://api.openweathermap.org/data/2.5/onecall?";
  weatherURL += `lat=${latlon.lat}&lon=${latlon.lon}`;
  weatherURL += `&exclude=minutely,hourly,alerts&appid=${keyOpenWeather}`;

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
const displayForecastCurrent = () => {};

// Update future weather forecast cards
const displayForecast5Day = () => {};

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
    getCityWeather(inputCity);
  }
};

// Handle city search from list of saved cities
const handleSavedCitySearch = (event) => {
  // Get selected city name
  const selectCity = event.target.textContent;

  // Get city weather
  getCityWeather(selectCity);
};

// EVENT LISTENERS
// Text entry search
btnSearch.addEventListener("click", handleCitySearch);

// Saved city search
savedCitiesEl.addEventListener("click", handleSavedCitySearch);
