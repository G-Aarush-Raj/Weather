const express = require("express");
const hbs = require("hbs");
const path = require("path");

const app = express();
const fetchWeatherData = require("../utils/weatherData");

const PORT = process.env.PORT || 3000;

// Define paths
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsDirectoryPath = path.join(__dirname, "../templates/views");
const partialsDirectoryPath = path.join(__dirname, "../templates/partials");

// Setup Handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsDirectoryPath);
hbs.registerPartials(partialsDirectoryPath);

// Serve static assets
app.use(express.static(publicDirectoryPath));

// Routes
app.get("/", (req, res) => {
  res.render("index", { title: "Weather" });
});

app.get("/weather", (req, res) => {
  const userAddress = req.query.address;

  if (!userAddress) {
    return res.send("Address is required");
  }

  fetchWeatherData(userAddress, (error, weatherResponse) => {
    if (error) {
      return res.send(error);
    }

    res.send(weatherResponse);
  });
});

app.get("*", (req, res) => {
  res.render("404", { title: "Page not found" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
