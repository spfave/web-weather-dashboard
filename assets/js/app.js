// DOM SELECTORS
inputCityEl = document.querySelector("#input-city");
btnSearch = document.querySelector("#btn-search");
savedCitiesEl = document.querySelector("#saved-cities");

// VARIABLES
const keyOpenWeather = "0bb338e53966913f3a5d9c70366f0e35";

// FUNCTIONS
// Handle getting city weather
const getCityWeather = (city) => {
  console.log(city);
};

// Evaluate latitude and longitude of city name
const geocodeCity = () => {
  // http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
  let geocodeURL = "http://api.openweathermap.org/geo/1.0/direct?";
};

// Perform openweather API call
const getWeatherData = () => {
  // https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lng}&exclude=minutely,hourly,alerts&appid={API key}
  let weatherURL = "https://api.openweathermap.org/data/2.5/onecall?";
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
  const inputCity = inputCityEl.value.toLowerCase();

  // if non-empty string - get city weather
  if (inputCity) {
    getCityWeather(inputCity);
  }
};

// Handle city search from list of saved cities
const handleSavedCitySearch = (event) => {
  // Get selected city name
  const selectCity = event.target.textContent.toLowerCase();

  // Get city weather
  getCityWeather(selectCity);
};

// EVENT LISTENERS
// Text entry search
btnSearch.addEventListener("click", handleCitySearch);

// Saved city search
savedCitiesEl.addEventListener("click", handleSavedCitySearch);
