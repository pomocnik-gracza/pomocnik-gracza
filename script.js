console.log("Pomocnik Gracza uruchomiony");

// === LEKTOR ARTYKUŁÓW I PORAD ===
document.addEventListener("DOMContentLoaded", () => {
    const lectorTile = document.getElementById("lectortoggle");
    if (!lectorTile) return;

    if (!("speechSynthesis" in window)) {
        console.warn("Brak wsparcia dla speechSynthesis");
        return;
    }

    let isPlaying = false;
    let utterance = null;

    lectorTile.addEventListener("click", () => {
        // STOP
        if (isPlaying) {
            window.speechSynthesis.cancel();
            isPlaying = false;
            lectorTile.classList.remove("playing");
            lectorTile.querySelector("h3").innerText =
                "🎧 Posłuchaj zamiast czytać";
            return;
        }

        // SZUKAMY CAŁEJ TREŚCI ARTYKUŁU
        const article = document.querySelector("article.post");
        if (!article) {
            console.warn("Nie znaleziono article.post");
            return;
        }

        // klonujemy, żeby usunąć kafel lektora z czytania
        const clone = article.cloneNode(true);
        const lectorClone = clone.querySelector("#lectorToggle");
        if (lectorClone) lectorClone.remove();

        const text = clone.innerText.trim();
        if (!text) {
            console.warn("Tekst artykułu jest pusty");
            return;
        }

        utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "pl-PL";
        utterance.rate = 1;
        utterance.pitch = 1;

        utterance.onend = () => {
            isPlaying = false;
            lectorTile.classList.remove("playing");
            lectorTile.querySelector("h3").innerText =
                "🎧 Posłuchaj zamiast czytać";
        };

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);

        isPlaying = true;
        lectorTile.classList.add("playing");
        lectorTile.querySelector("h3").innerText =
            "⏸️ Zatrzymaj lektora";
    });
});



