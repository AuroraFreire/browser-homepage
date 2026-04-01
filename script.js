const background = document.getElementById("background");
const timeEl = document.getElementById("time");
const weatherEl = document.getElementById("weather");

async function getBackground() {
    const res = await fetch("https://api.thecatapi.com/v1/images/search");
    const data = await res.json();
    background.style.backgroundImage = "url(" + data[0].url + ")";
}

async function getWeather(lat, lon) {
    try {
        const res = await fetch(
            "https://api.open-meteo.com/v1/forecast?latitude=" + lat + "&longitude=" + lon + "&current=temperature_2m,windspeed_10m&daily=precipitation_probability_max&timezone=auto"
        );
        const data = await res.json();
        const temp = data.current.temperature_2m;
        const wind = data.current.windspeed_10m;
        const precip = data.daily.precipitation_probability_max[0];
        weatherEl.innerText = precip + "%  " + temp + "°C  " + wind + "KPH";
    } catch (err) {
        console.error("weather fetch failed:", err);
        weatherEl.innerText = "weather unavailable";
    }
}

function initWeather() {
    if (navigator.geolocation) {
        const fallbackTimer = setTimeout(() => getWeather(38.62, -8.95), 100);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                clearTimeout(fallbackTimer);
                getWeather(pos.coords.latitude, pos.coords.longitude);
            },
            () => {
                clearTimeout(fallbackTimer);
                getWeather(38.62, -8.95);
            }
        );
    } else {
        getWeather(38.62, -8.95);
    }
}

getBackground();
initWeather();

setInterval(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    timeEl.innerText = hours + ":" + minutes + ":" + seconds;
}, 1000);