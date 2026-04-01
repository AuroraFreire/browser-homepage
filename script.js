const background = document.getElementById("background");
const timeEl = document.getElementById("time");

async function getBackground() {
    const res = await fetch("https://api.thecatapi.com/v1/images/search");
    const data = await res.json();
    background.style.backgroundImage = "url(" + data[0].url + ")";
}

getBackground();

setInterval(() => {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    timeEl.innerText = hours + ":" + minutes + ":" + seconds;
}, 1000);