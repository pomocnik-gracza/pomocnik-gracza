console.log("Pomocnik Gracza uruchomiony");

// === LEKTOR ARTYKUŁU ===
document.addEventListener("DOMContentLoaded", () => {
    const lectorTile = document.getElementById("lectorToggle");

    // jeśli nie jesteśmy na stronie artykułu – nic nie robimy
    if (!lectorTile) return;

    if (!("speechSynthesis" in window)) {
        lectorTile.querySelector("p").innerText =
            "Twoja przeglądarka nie obsługuje lektora.";
        return;
    }

    let isPlaying = false;
    let utterance = null;

    lectorTile.addEventListener("click", () => {
        // 🔁 STOP
        if (isPlaying) {
            window.speechSynthesis.cancel();
            isPlaying = false;

            lectorTile.classList.remove("playing");
            lectorTile.querySelector("h3").innerText =
                "🎧 Posłuchaj zamiast czytać";
            return;
        }

        // ▶️ START
        const article = document.querySelector(".post");

        if (!article) return;

        // usuwamy tekst kafla lektora z czytania
        const clone = article.cloneNode(true);
        const lectorClone = clone.querySelector("#lectorToggle");
        if (lectorClone) lectorClone.remove();

        const text = clone.innerText.trim();

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

        window.speechSynthesis.cancel(); // bezpieczeństwo
        window.speechSynthesis.speak(utterance);

        isPlaying = true;
        lectorTile.classList.add("playing");
        lectorTile.querySelector("h3").innerText =
            "⏸️ Zatrzymaj lektora";
    });
});

