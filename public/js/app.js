const weatherApi = "/weather";
const weatherForm = document.querySelector("form");
const searchInput = document.querySelector("input");

const weatherIcon = document.querySelector(".weatherIcon i");
const weatherCondition = document.querySelector(".weatherCondition");
const tempElement = document.querySelector(".temperature span");
const locationElement = document.querySelector(".place");
const dateElement = document.querySelector(".date");

const DEGREE_SYMBOL = String.fromCharCode(176);
const MONTH_OPTIONS = { month: "long" };
const currentDate = new Date();
// const monthName = currentDate.toLocaleString("en-US", MONTH_OPTIONS);
// dateElement.textContent = `${currentDate.getDate()}, ${monthName}`;

weatherForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = searchInput.value.trim();
  if (!city) return;

  setLoadingState();
  showData(city);
});

if ("geolocation" in navigator) {
  setLoadingState();
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const geoApiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

      fetch(geoApiUrl)
        .then((response) => response.json())
        .then((data) => {
          const city = data?.address?.city || data?.address?.town || data?.address?.village;
          if (city) {
            showData(city);
          } else {
            console.error("City not found in location data.");
            locationElement.textContent = "Location unavailable.";
          }
        })
        .catch((error) => {
          console.error("Error fetching location data:", error);
        });
    },
    (error) => {
      console.error("Error getting location:", error.message);
    }
  );
} else {
  console.error("Geolocation is not available in this browser.");
}

function setLoadingState() {
  locationElement.textContent = "Loading...";
  weatherIcon.className = "";
  tempElement.textContent = "";
  weatherCondition.textContent = "";
}

function showData(city) {
  getWeatherData(city, (result) => {
    console.log(result);
    if (result?.cod == 200) {
      const description = result.weather[0].description;
      const weatherClass = getIcon(description);

      weatherIcon.className = weatherClass;
      locationElement.textContent = result.name;
      tempElement.textContent = `${(result.main.temp - 273.5).toFixed(2)}${DEGREE_SYMBOL}`;
      weatherCondition.textContent = description.toUpperCase();
    } else {
      locationElement.textContent = "City not found.";
    }
  });
}
function getIcon(description) {
  const desc = description.toLowerCase();

  if (desc.includes("rain")) return "wi wi-day-rain";
  if (desc.includes("fog")) return "wi wi-day-fog";
  if (desc.includes("cloud")) return "wi wi-day-cloudy";
  if (desc.includes("clear")) return "wi wi-day-sunny";
  if (desc.includes("snow")) return "wi wi-day-snow";

  return "wi wi-day-cloudy";
}

function updateDateTime() {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  dateElement.textContent = now.toLocaleString("en-US", options);
}

updateDateTime();
setInterval(updateDateTime, 1000);

function getWeatherData(city, callback) {
  const locationApi = `${weatherApi}?address=${encodeURIComponent(city)}`;
  fetch(locationApi)
    .then((response) => response.json())
    .then(callback)
    .catch((error) => {
      console.error("Error fetching weather data:", error);
      locationElement.textContent = "Weather data unavailable.";
    });
}
