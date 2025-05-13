const request = require("request");

const OPEN_WEATHER_API = {
  BASE_URL: "https://api.openweathermap.org/data/2.5/weather?q=",
  API_KEY: "a504f77f57821ceda6362686fd80f3d5",
};

const fetchWeatherData = (location, callback) => {
  const apiUrl =
    OPEN_WEATHER_API.BASE_URL +
    encodeURIComponent(location) +
    "&APPID=" +
    OPEN_WEATHER_API.API_KEY;

  console.log(apiUrl);

  request({ url: apiUrl, json: true }, (err, response) => {
    if (err) {
      callback(true, "Unable to fetch data. Please try again. " + err);
    } else {
      callback(false, response?.body);
    }
  });
};

module.exports = fetchWeatherData;
