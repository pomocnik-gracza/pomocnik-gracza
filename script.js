console.log("Pomocnik Gracza uruchomiony");

document.addEventListener("DOMContentLoaded", () => {
    const lectorTile = document.getElementById("lectorToggle");
    if (!lectorTile) return;

    if (!("speechSynthesis" in window)) {
        lectorTile.querySelector("p").innerText =
            "Twoja przeglądarka nie obsługuje lektora.";
        return;
    }

    let isPlaying = false;
    let utterance = null;
    let voicesReady = false;

    // 🔊 czekamy aż przeglądarka ZAŁADUJE głosy
    function loadVoices() {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            voicesReady = true;
        }
    }

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    lectorTile.addEventListener("click", () => {
        if (!voicesReady) {
            alert("Lektor jeszcze się ładuje. Spróbuj za sekundę.");
            return;
        }

        // ⏹ STOP
        if (isPlaying) {
            window.speechSynthesis.cancel();
            isPlaying = false;
            lectorTile.classList.remove("playing");
            lectorTile.querySelector("h3").innerText =
                "🎧 Posłuchaj zamiast czytać";
            return;
        }

        const article = document.querySelector(".post");
        if (!article) return;

        // kopiujemy artykuł i usuwamy kafel lektora
        const clone = article.cloneNode(true);
        const lectorClone = clone.querySelector("#lectorToggle");
        if (lectorClone) lectorClone.remove();

        const text = clone.innerText.trim();
        if (!text) return;

        utterance = new SpeechSynthesisUtterance(text);

        // 🎙 wybieramy POLSKI głos (jeśli jest)
        const voices = window.speechSynthesis.getVoices();
        const polishVoice = voices.find(v => v.lang === "pl-PL");
        if (polishVoice) utterance.voice = polishVoice;

        utterance.lang = "pl-PL";
        utterance.rate = 1;
        utterance.pitch = 1;

        utterance.onend = () => {
            isPlaying = false;
            lectorTile.classList.remove("playing");
            lectorTile.querySelector("h3").innerText =
                "🎧 Posłuchaj zamiast czytać";
        };

        window.speechSynthesis.cancel(); // reset
        window.speechSynthesis.speak(utterance);

        isPlaying = true;
        lectorTile.classList.add("playing");
        lectorTile.querySelector("h3").innerText =
            "⏸️ Zatrzymaj lektora";
    });
});
