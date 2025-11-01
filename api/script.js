// Replace with your RapidAPI key
const apiKey = "YOUR_RAPIDAPI_KEY_HERE"; 
const apiHost = "open-weather13.p.rapidapi.com";

async function getWeather() {
  const city = document.getElementById("cityInput").value;
  const resultDiv = document.getElementById("result");

  // Clear previous results
  resultDiv.innerHTML = "⏳ Loading...";

  try {
    // Step 1: Get latitude & longitude for the city using Geocoding API
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
    );
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      resultDiv.innerHTML = "❌ City not found!";
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // Step 2: Fetch 5-day forecast from RapidAPI
    const url = `https://${apiHost}/fivedaysforecast?latitude=${latitude}&longitude=${longitude}&lang=EN`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-host": apiHost,
        "x-rapidapi-key": apiKey,
      },
    });

    const data = await response.json();

    // Step 3: Display results
    let html = `<h3>${name}, ${country}</h3>`;
    html += "<h4>5-Day Forecast</h4><ul>";

    data.list.forEach((day) => {
      const date = new Date(day.dt * 1000).toLocaleDateString();
      html += `<li>
        <strong>${date}</strong>: ${day.weather[0].description}, 
        Temp: ${day.temp.day}°C
      </li>`;
    });

    html += "</ul>";
    resultDiv.innerHTML = html;

  } catch (error) {
    console.error(error);
    resultDiv.innerHTML = "⚠️ Error fetching weather data!";
  }
}

// Optional: Allow pressing Enter key to search
document.getElementById("cityInput").addEventListener("keypress", function(e){
  if(e.key === "Enter") getWeather();
});
