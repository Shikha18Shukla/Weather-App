const apiKey = "c9dbd57ecf104b7184f64445251507";

let isCelsius = true;

document.getElementById("unitSwitch").addEventListener("change", () => {
  isCelsius = !isCelsius;
  const currentLocation = document.getElementById("location").textContent;
  if (currentLocation) {
    getWeather(currentLocation);
  }
});

function getWeather(forcedLocation = null) {
  const location = forcedLocation || document.getElementById("locationInput").value.trim();
  if (!location) return alert("Please enter a city name.");

  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3&aqi=no&alerts=no`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const tempC = data.current.temp_c;
      const tempF = data.current.temp_f;
      const condition = data.current.condition.text;
      const iconUrl = "https:" + data.current.condition.icon;

      document.getElementById("location").textContent = data.location.name;
      document.getElementById("temperature").textContent = isCelsius ? `${tempC} °C` : `${tempF} °F`;
      document.getElementById("condition").textContent = condition;
      document.getElementById("weatherIcon").src = iconUrl;

      updateVisuals(condition.toLowerCase());
      updateForecast(data.forecast.forecastday);
    })
    .catch(() => alert("City not found or API issue."));
}

function updateForecast(days) {
  const container = document.getElementById("forecastContainer");
  container.innerHTML = "";

  days.forEach((day, index) => {
    if (index === 0) return; // skip current day

    const date = new Date(day.date).toDateString().split(" ").slice(0, 3).join(" ");
    const icon = "https:" + day.day.condition.icon;
    const tempC = day.day.avgtemp_c;
    const tempF = day.day.avgtemp_f;

    const card = document.createElement("div");
    card.className = "forecast-card";
    card.innerHTML = `
      <h4>${date}</h4>
      <img src="${icon}" alt="icon" />
      <p>${isCelsius ? `${tempC} °C` : `${tempF} °F`}</p>
    `;
    container.appendChild(card);
  });
}

function updateVisuals(condition) {
  const overlay = document.querySelector(".overlay");
  const button = document.querySelector("button");

  let imageUrl = "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=1600&q=80";
  let btnClass = "default";

  overlay.className = "overlay";
  button.className = "";

  if (condition.includes("snow")) {
    overlay.classList.add("snowy");
    imageUrl = "https://images.unsplash.com/photo-1547044313-50e1b63c094e?auto=format&fit=crop&w=1600&q=80";
    btnClass = "snowy";
  } else if (condition.includes("heavy rain") || condition.includes("torrential")) {
    overlay.classList.add("rainy");
    imageUrl = "https://images.unsplash.com/photo-1527766833261-b09c3163a791?auto=format&fit=crop&w=1600&q=80";
    btnClass = "rainy";
  } else if (condition.includes("rain") || condition.includes("drizzle") || condition.includes("showers")) {
    overlay.classList.add("rainy");
    imageUrl = "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=80";
    btnClass = "rainy";
  } else if (condition.includes("cloud")) {
    overlay.classList.add("cloudy");
    imageUrl = "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?auto=format&fit=crop&w=1600&q=80";
    btnClass = "cloudy";
  } else if (condition.includes("sunny") || condition.includes("clear")) {
    overlay.classList.add("sunny");
    imageUrl = "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1600&q=80";
    btnClass = "sunny";
  }

  document.body.style.backgroundImage = `url('${imageUrl}')`;
  button.classList.add(btnClass);
}
