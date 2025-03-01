const apiKey = "cd3472c7b3f638f8f14157d32457577b"; 
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const unitToggle = document.getElementById("unit-toggle");
const forecastContainer = document.getElementById("forecast-container");

let isCelsius = true;

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
        fetchForecast(city);
    }
});

unitToggle.addEventListener("click", () => {
    if (isCelsius) {
        convertToFahrenheit();
        unitToggle.textContent = "Convert to °C";
    } else {
        convertToCelsius();
        unitToggle.textContent = "Convert to °F";
    }
    isCelsius = !isCelsius;
});

async function fetchWeather(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();

        if (response.ok) {
            cityName.textContent = data.name;
            temperature.textContent = `Temperature: ${data.main.temp}°C`;
            description.textContent = `Condition: ${data.weather[0].description}`;
            humidity.textContent = `Humidity: ${data.main.humidity}%`;
            windSpeed.textContent = `Wind Speed: ${data.wind.speed} km/h`;
        } else {
            alert("City not found!");
        }
    } catch (error) {
        alert("Failed to fetch weather data.");
    }
}

async function fetchForecast(city) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
        );
        const data = await response.json();

        if (response.ok) {
            forecastContainer.innerHTML = "";
            const forecastList = data.list.filter((item, index) => index % 8 === 0);

            forecastList.forEach((item) => {
                const forecastItem = document.createElement("div");
                forecastItem.classList.add("forecast-item");
                forecastItem.innerHTML = `
                    <p>${new Date(item.dt * 1000).toLocaleDateString()}</p>
                    <p>${item.main.temp}°C</p>
                    <p>${item.weather[0].description}</p>
                `;
                forecastContainer.appendChild(forecastItem);
            });
        } else {
            alert("Failed to fetch forecast.");
        }
    } catch (error) {
        alert("Failed to fetch forecast data.");
    }
}

function convertToFahrenheit() {
    let tempC = parseFloat(temperature.textContent.split(" ")[1]);
    let tempF = (tempC * 9/5) + 32;
    temperature.textContent = `Temperature: ${tempF.toFixed(2)}°F`;
}

function convertToCelsius() {
    let tempF = parseFloat(temperature.textContent.split(" ")[1]);
    let tempC = (tempF - 32) * 5/9;
    temperature.textContent = `Temperature: ${tempC.toFixed(2)}°C`;
}
