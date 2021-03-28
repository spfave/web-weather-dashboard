// DOM SELECTORS
const inputCityEl = document.querySelector("#input-city");
const btnSearch = document.querySelector("#btn-search");
const btnSearchOpt = document.querySelector("#btn-search-options");
const searchHistoryEl = document.querySelector("#search-history");
const searchedCitiesEl = document.querySelector("#searched-cities");
const btnClearSearch = document.querySelector("#btn-clear-search");

const modalWthOpt = $("#modal-weather-search-options");
const btnFormWthOpt = document.querySelector("#form-weather-search-options");

const forecastCurrentEl = document.querySelector("#forecast-current");
const forecastCurrentCardEl = document.querySelector("#forecast-current-card");
const forecast5DayEl = document.querySelector("#forecast-5day");
const forecast5DayCardsEl = document.querySelector("#forecast-5day-cards");

// VARIABLES
const keyOpenWeather = "0bb338e53966913f3a5d9c70366f0e35";
let units;

// FUNCTIONS
// Handle getting city weather
const handleCityWeatherRequest = async (city) => {
  let cityFound;
  let cityWeather;

  //
  try {
    // Get City lat & long
    cityFound = await geocodeCity(city);
    // Get City weather data
    cityWeather = await getWeatherData(cityFound);
  } catch (error) {
    console.warn(error);
    return;
  }

  // Display weather results
  // console.log(cityWeather);
  displayForecastCurrent(cityFound.name, cityWeather.current);
  displayForecast5Day(cityWeather.daily);
};

// Evaluate latitude and longitude of city name
const geocodeCity = async (city) => {
  // Create request url
  const geocodeURL = new URL("http://api.openweathermap.org/geo/1.0/direct");
  const params = new URLSearchParams({
    q: city,
    limit: 2,
    appid: keyOpenWeather,
  }).toString();
  geocodeURL.search = params;

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
    const alertMsg = `No results found for ${city}`;
    showAlert(alertMsg, "warning");
    throw alertMsg;
  }

  const cityFound = data[0];
  saveCityName(cityFound.name);
  return cityFound;
  // return { lat: cityFound.lat, lon: cityFound.lon };
};

// Perform openweather API call
const getWeatherData = async (latlon) => {
  // Create request url
  const weatherURL = new URL("https://api.openweathermap.org/data/2.5/onecall");
  const params = new URLSearchParams({
    lat: latlon.lat,
    lon: latlon.lon,
    exclude: ["minutely", "hourly", "alerts"],
    units: units,
    appid: keyOpenWeather,
  }).toString();
  weatherURL.search = params;

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
  const wthrUnits = units === "imperial" ? unitName.imperial : unitName.metric;

  // Create current weather forecast card
  const wthrCurCard = document.createElement("div");
  wthrCurCard.classList.add("card");

  wthrCurCard.innerHTML = `
    <header class="card-header bg-info p-0 text-light">
      <div class="d-flex">
        <img src="http://openweathermap.org/img/wn/${
          weather.weather[0].icon
        }@2x.png" alt="weather condition icon">
        <div class="d-flex flex-column justify-content-center">
          <h4>${place}</h4>
          <p>${moment().format("dddd, MMMM Do, YYYY")}</p>
        </div>
      </div>
    </header>
    <div class="card-body">
      <p class="d-flex align-items-start">
        <span class="temperature">${weather.temp.toFixed(0)}</span>
        <span class="temp-unit">&deg;${wthrUnits.temp}</span>
      </p>
      <div class="d-table">
        <div>
          <p>Wind Speed:</p>
          <p>${weather.wind_speed.toFixed(1)} ${wthrUnits.windSpeed}</p>
        </div>
        <div>
          <p>Humidity:</p>
          <p>${weather.humidity}%</p>
        </div>
        <div>
          <p>UV Index:</p>
          <p id="uv-index">${weather.uvi.toFixed(1)}</p>
        </div>
      </div>
    </div>`;
  forecastCurrentCardEl.innerHTML = "";
  forecastCurrentCardEl.appendChild(wthrCurCard);
  forecastCurrentEl.hidden = false;
};

// Update future weather forecast cards
const displayForecast5Day = (weather) => {
  const wthrUnits = units === "imperial" ? unitName.imperial : unitName.metric;

  // Loop over first five entries daily weather forecast and create weather forecast card
  forecast5DayCardsEl.innerHTML = "";
  for (let day = 0; day < 5; day++) {
    const dayWthr = weather[day];

    const wthrFtrCard = document.createElement("div");
    wthrFtrCard.classList.add("card", "text-light", "bg-info");

    wthrFtrCard.innerHTML = `
      <header class="card-header p-0">
        <img src="http://openweathermap.org/img/wn/${
          dayWthr.weather[0].icon
        }.png" alt="weather condition icon">
        ${day === 0 ? "Tomorrow" : moment().add(day, "days").format("dddd")}
      </header>
      <div class="card-body">
        <div class="d-table">
          <div>
            <p>Temperature:</p>
            <p>${dayWthr.temp.day.toFixed(0)} &deg;${wthrUnits.temp}</p>
          </div>
          <div>
            <p>Wind Speed:</p>
            <p>${dayWthr.wind_speed.toFixed(1)} ${wthrUnits.windSpeed}</p>
          </div>
          <div>
            <p>Humidity:</p>
            <p>${dayWthr.humidity}%</p>
          </div>
        </div>
      </div>`;

    forecast5DayCardsEl.appendChild(wthrFtrCard);
  }

  forecast5DayEl.hidden = false;
};

// Render list of city names
const displayCityNames = () => {
  searchedCities = loadCityNames();

  // Render each city name to searched-cities list
  for (const city of searchedCities) {
    displayCityName(city);
  }
};

// Add city to list of searched cities
const displayCityName = (city) => {
  // Show searched cities history
  if (searchHistoryEl.hidden) searchHistoryEl.hidden = false;

  // Create list item and append to list
  const cityListItem = document.createElement("li");
  cityListItem.classList.add("list-group-item", "list-group-item-action");
  cityListItem.textContent = city;
  searchedCitiesEl.appendChild(cityListItem);
};

// Load city names from storage
const loadCityNames = () => {
  // load searched cities from local storage
  const searchedCities = localStorage.getItem("searchedCities");

  // if searchedCities does not exist - return empty list
  // else - return previously searched cities
  if (!searchedCities) {
    return [];
  }
  return JSON.parse(searchedCities);
};

// Save city name to local storage
const saveCityName = (city) => {
  searchedCities = loadCityNames();

  // if city name already included in saved list end function execution
  // else - add city name to saved list of searched cities and display
  if (searchedCities.includes(city)) return;
  searchedCities.push(city);
  displayCityName(city);

  // Save updated searched cities list to local storage
  localStorage.setItem("searchedCities", JSON.stringify(searchedCities));
};

// Load weather search options from storage
const loadWeatherSearchOptions = () => {
  units = localStorage.getItem("units");

  // if units does not exist - set starting units to imperial
  if (!units) {
    units = "imperial";
  }
};

// Save weather search option to storage
const saveWeatherSearchOptions = (unitsSelected) => {
  localStorage.setItem("units", unitsSelected);
};

// Show alert
const showAlert = (message, alertType) => {
  // Create alert div
  const alert = document.createElement("div");
  alert.className = `alert alert-${alertType} text-center mt-4`;
  alert.innerHTML = `<p>${message}</p>`;

  // Insert alert div in DOM
  const forecastEl = document.querySelector("#forecast");
  forecastEl.insertBefore(alert, forecastCurrentEl);

  // Timeout alert message after 1 second
  setTimeout(() => {
    document.querySelector(".alert").remove();
  }, 2000);
};

// Handle city search from form entry
const handleCitySearch = () => {
  // Get input city name
  const inputCity = inputCityEl.value.toLowerCase();

  // if non-empty string - get city weather
  if (inputCity) {
    inputCityEl.value = "";
    handleCityWeatherRequest(inputCity);
  } else {
    showAlert("Enter a city name to get weather", "warning");
  }
};

// Handle city search from list of saved cities
const handleSavedCitySearch = (event) => {
  // Get selected city name
  const selectCity = event.target.textContent
    .toLowerCase()
    .replace(/[^a-z]/i, "");

  // Get city weather
  handleCityWeatherRequest(selectCity);
};

// Clear searched cities history and hide list
const clearSearchedCities = () => {
  searchHistoryEl.hidden = true;
  localStorage.removeItem("searchedCities");
  searchedCitiesEl.innerHTML = "";
};

// Show weather search options
const showWeatherSearchOptions = () => {
  // Show modal
  modalWthOpt.modal("show");

  // Show current set search units in modal
  document.querySelector(
    `input[name="radios-units"][value="${units}"]`
  ).checked = true;
};

// Set weather search options
const setWeatherSearchOptions = (event) => {
  event.preventDefault();

  // Get value of units selected and save to storage
  units = document.querySelector('input[name="radios-units"]:checked').value;
  saveWeatherSearchOptions(units);

  // Hide modal
  modalWthOpt.modal("hide");
};

// EVENT LISTENERS
// Text entry search
btnSearch.addEventListener("click", handleCitySearch);
inputCityEl.addEventListener("keyup", (event) => {
  if (event.key === "Enter") handleCitySearch();
});

// Saved city search
searchedCitiesEl.addEventListener("click", handleSavedCitySearch);

// Clear city search history
btnClearSearch.addEventListener("click", clearSearchedCities);

// Open/Set weather search options
btnSearchOpt.addEventListener("click", showWeatherSearchOptions);
btnFormWthOpt.addEventListener("submit", setWeatherSearchOptions);

// WEBPAGE EXECUTION
displayCityNames();
loadWeatherSearchOptions();
