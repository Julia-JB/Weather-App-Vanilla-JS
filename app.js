function formatDate(time) {
  let day = time.split(", ")[0];
  let hours = time.split(", ")[2].slice(5, 10);

  return `Local time: ${day} ${hours}`;
}
function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let feelsLikeElement = document.querySelector("#feelsLike");
  let humidityElement = document.querySelector("#humidity");
  let windELement = document.querySelector("#wind");
  let iconElement = document.querySelector("#weather-icon");

  celsiusTemperature = Math.round(response.data.temperature.current);
  feelsLikeTemperature = Math.round(response.data.temperature.feels_like);
  windSpeed = Math.floor(response.data.wind.speed * 3.6);

  temperatureElement.innerHTML = celsiusTemperature;
  cityElement.innerHTML = `${response.data.city}`;
  descriptionElement.innerHTML = response.data.condition.description;
  feelsLikeElement.innerHTML = feelsLikeTemperature;
  humidityElement.innerHTML = response.data.temperature.humidity;
  windELement.innerHTML = windSpeed + " km/h";
  iconElement.setAttribute("src", response.data.condition.icon_url);
  iconElement.setAttribute("alt", response.data.condition.icon);

  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
}

function formatForecastDate(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();

  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecastCelsius(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row justify-content-between mt-4">`;

  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 7) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2 text-center forecast-card">
    <div class="weather-forecast-date">${formatForecastDate(
      forecastDay.time
    )}</div>
    
    <img
      class="weather-forecast-img"
      src=${forecastDay.condition.icon_url}
      alt=${forecastDay.condition.icon}
     
    />
    <div class="weather-forecast-temperatures">
      <span class="weather-forecast-maximum">${Math.round(
        forecastDay.temperature.maximum
      )}°</span>
      
      <span class="weather-forecast-minimum">${Math.round(
        forecastDay.temperature.minimum
      )}° </span>
    </div>
  </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;

  forecastElement.innerHTML = forecastHTML;

  celsiusMaxesArray = [];
  celsiusMinsArray = [];
  let forecastMax = document.querySelectorAll("span.weather-forecast-maximum");
  forecastMax.forEach((day) => {
    celsiusMaxesArray.push(parseInt(day.innerHTML));
  });

  let forecastMin = document.querySelectorAll("span.weather-forecast-minimum");
  forecastMin.forEach((day) => {
    celsiusMinsArray.push(parseInt(day.innerHTML));
  });
}

function displayLocalTime(response) {
  let dateElement = document.querySelector("#date");
  dateElement.innerHTML = formatDate(response.data.date_time_txt);
}
function search(city) {
  let apiKey = "202e46o709dd7b61a1effa0ftf78e03d";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}`;
  axios.get(apiUrl).then(displayTemperature);

  let apiKeyTime = "d993c440dd5041a1a3406e12cffe66d2";
  let timeUrl = `https://api.ipgeolocation.io/timezone?apiKey=${apiKeyTime}&location=${city}`;
  axios.get(timeUrl).then(displayLocalTime);

  let apiUrlForecast = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrlForecast).then(displayForecastCelsius);
}

function handleSubmit(event) {
  event.preventDefault();

  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function convertToFahrenheit(temp) {
  return Math.round(temp * 1.8 + 32);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();

  let temperatureElement = document.querySelector("#temperature");

  let fahrenheitTemperature = convertToFahrenheit(celsiusTemperature);
  temperatureElement.innerHTML = fahrenheitTemperature;

  let feelsLikeElement = document.querySelector("#feelsLike");
  feelsLikeElement.innerHTML = convertToFahrenheit(feelsLikeTemperature);

  let windElement = document.querySelector("#wind");
  windElement.innerHTML = Math.round(windSpeed / 1.609344) + " mph";

  let forecastMax = document.querySelectorAll("span.weather-forecast-maximum");
  forecastMax.forEach((day, index) => {
    day.innerHTML = convertToFahrenheit(celsiusMaxesArray[index]) + "°";
  });

  let forecastMin = document.querySelectorAll("span.weather-forecast-minimum");
  forecastMin.forEach((day, index) => {
    day.innerHTML = convertToFahrenheit(celsiusMinsArray[index]) + "°";
  });

  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = celsiusTemperature;

  let feelsLikeElement = document.querySelector("#feelsLike");
  feelsLikeElement.innerHTML = feelsLikeTemperature;

  let windElement = document.querySelector("#wind");
  windElement.innerHTML = windSpeed + " km/h";

  let forecastMax = document.querySelectorAll("span.weather-forecast-maximum");
  forecastMax.forEach((day, index) => {
    day.innerHTML = celsiusMaxesArray[index] + "°";
  });

  let forecastMin = document.querySelectorAll("span.weather-forecast-minimum");
  forecastMin.forEach((day, index) => {
    day.innerHTML = celsiusMinsArray[index] + "°";
  });
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
}

let celsiusMaxesArray = null;
let celsiusMinsArray = null;

let celsiusTemperature = null;
let feelsLikeTemperature = null;
let windSpeed = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheitLink");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsiusLink");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

search("Lynnwood");

/*
function formatDate(timestamp) {
let date = new Date(timestamp);
  let hours = date.getHours();

  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = date.getMinutes();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let day = date.getDay();

  let daysArr = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let dayWeek = daysArr[day];
  return `${dayWeek}, ${hours}:${minutes}`;
  }
*/
