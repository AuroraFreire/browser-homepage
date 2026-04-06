const background = document.getElementById("background");
const timeEl = document.getElementById("time");
const weatherEl = document.getElementById("weather");
const pokeinput = document.getElementById("pokeinput");
const pokebtn = document.getElementById("pokebtn");
const pokenresult = document.getElementById("pokenresult");

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

async function searchPokemon() {
    const name = pokeinput.value.trim().toLowerCase();
    if (!name) return;
    pokenresult.innerHTML = "<p>loading...</p>";
    try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon/" + name);
        if (!res.ok) throw new Error("not found");
        const data = await res.json();
        const sprite = data.sprites.front_default;
        const hp = data.stats[0].base_stat;
        const types = data.types.map(t => t.type.name).join(", ");
        pokenresult.innerHTML =
            "<img src='" + sprite + "' alt='" + data.name + "' />" +
            "<p><b>" + data.name.toUpperCase() + "</b></p>" +
            "<p>Type: " + types + "</p>" +
            "<p>HP: " + hp + "</p>";
    } catch (err) {
        pokenresult.innerHTML = "<p>pokemon not found :(</p>";
    }
}

getBackground();
initWeather();
pokebtn.addEventListener("click", searchPokemon);
pokeinput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchPokemon();
});

setInterval(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    timeEl.innerText = hours + ":" + minutes + ":" + seconds;
}, 1000);