console.log("Pomocnik Gracza uruchomiony");

// === LEKTOR ARTYKUŁÓW I PORAD (WERSJA ODPORNA) ===
document.addEventListener("DOMContentLoaded", () => {
    if (!("speechSynthesis" in window)) {
        console.warn("Przeglądarka nie obsługuje lektora");
        return;
    }

    let currentUtterance = null;
    let isPlaying = false;

    // obsługujemy WSZYSTKIE kafle lektora
    const lectorTiles = document.querySelectorAll(".lector-tile");

    lectorTiles.forEach((tile) => {
        tile.addEventListener("click", () => {
            // STOP – jeśli coś już czyta
            if (isPlaying) {
                window.speechSynthesis.cancel();
                isPlaying = false;
                currentUtterance = null;

                document
                    .querySelectorAll(".lector-tile.playing")
                    .forEach(t => {
                        t.classList.remove("playing");
                        const h3 = t.querySelector("h3");
                        if (h3) h3.innerText = "🎧 Posłuchaj zamiast czytać";
                    });

                return;
            }

            // szukamy NAJBLIŻSZEGO artykułu
            const article = tile.closest("article");
            if (!article) {
                console.warn("Nie znaleziono <article>");
                return;
            }

            // klonujemy artykuł, żeby usunąć kafel lektora
            const clone = article.cloneNode(true);
            clone.querySelectorAll(".lector-tile").forEach(el => el.remove());

            // usuwamy link powrotu (żeby go nie czytało)
            clone.querySelectorAll("a.back-link").forEach(el => el.remove());

            const text = clone.innerText.trim();
            if (!text) {
                console.warn("Brak tekstu do czytania");
                return;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = "pl-PL";
            utterance.rate = 1;
            utterance.pitch = 1;

            utterance.onend = () => {
                isPlaying = false;
                currentUtterance = null;
                tile.classList.remove("playing");
                const h3 = tile.querySelector("h3");
                if (h3) h3.innerText = "🎧 Posłuchaj zamiast czytać";
            };

            // reset i start
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);

            isPlaying = true;
            currentUtterance = utterance;
            tile.classList.add("playing");

            const h3 = tile.querySelector("h3");
            if (h3) h3.innerText = "⏸️ Zatrzymaj lektora";
        });
    });
});// ====== LEKTOR: klik w kafelek "Posłuchaj zamiast czytać" ======
(() => {
  const tile = document.getElementById("lectorToggle"); // UWAGA: musi pasować do HTML
  const article = document.querySelector("article.post");

  // jeśli nie ma kafelka albo nie ma artykułu – nic nie rób
  if (!tile || !article) return;

  // sprawdź wsparcie przeglądarki
  const hasSpeech = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  if (!hasSpeech) {
    console.warn("Brak wsparcia TTS (speechSynthesis) w tej przeglądarce.");
    return;
  }

  // funkcja: wyciąga tekst z artykułu (bez kafelka lektora)
  const getArticleText = () => {
    // bierzemy sensowną treść z nagłówków/akapitów/list
    const nodes = article.querySelectorAll("h2, h3, h4, p, li");
    const parts = [];

    nodes.forEach((n) => {
      // pomijamy tekst z kafelka
      if (n.closest("#lectorToggle")) return;

      const t = (n.textContent || "").replace(/\s+/g, " ").trim();
      if (t.length > 0) parts.push(t);
    });

    return parts.join(". ");
  };

  const speakAll = () => {
    const text = getArticleText();

    if (!text) {
      console.warn("Nie znaleziono tekstu do czytania w artykule.");
      return;
    }

    // zatrzymaj poprzednie czytanie (jeśli było)
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "pl-PL"; // wymuszenie języka
    utter.rate = 1.0;
    utter.pitch = 1.0;

    window.speechSynthesis.speak(utter);
  };

  // klik myszą
  tile.addEventListener("click", speakAll);

  // enter/space z klawiatury (bo role="button" i tabindex)
  tile.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      speakAll();
    }
  });
})();


