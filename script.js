const background = document.getElementById("background");

async function getBackground() {
    const res = await fetch("https://api.thecatapi.com/v1/images/search");
    const data = await res.json();
    background.style.backgroundImage = "url(" + data[0].url + ")";
}

getBackground();