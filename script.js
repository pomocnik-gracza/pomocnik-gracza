// Minimalny JS – podstawowy start
console.log("Pomocnik Gracza uruchomiony");

// === LEKTOR ARTYKUŁU ===
const lectorTile = document.getElementById("lectorToggle");

if (lectorTile && "speechSynthesis" in window) {
    let isPlaying = false;
    let utterance;

    lectorTile.addEventListener("click", () => {
        if (!isPlaying) {
            const article = document.querySelector(".post");
            const text = article.innerText;

            utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = "pl-PL";
            utterance.rate = 1;
            utterance.pitch = 1;

            speechSynthesis.speak(utterance);
            isPlaying = true;

            lectorTile.classList.add("playing");
            lectorTile.querySelector("h3").innerText = "⏸️ Zatrzymaj lektora";
        } else {
            speechSynthesis.cancel();
            isPlaying = false;

            lectorTile.classList.remove("playing");
            lectorTile.querySelector("h3").innerText = "🎧 Posłuchaj zamiast czytać";
        }
    });
}
