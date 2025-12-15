const cards = document.querySelectorAll(".card");
const overlay = document.getElementById("overlay");
const gallery = document.querySelector(".gallery");
const restartCard = document.querySelector(".card.restart");

let activeCard = null;

/* ============================
   FLIP DE TARJETAS (NO restart)
   ============================ */

cards.forEach(card => {
  card.addEventListener("click", (e) => {
    if (card.classList.contains("restart")) return;

    e.stopPropagation();
    if (activeCard) return;

    activeCard = card;
    card.classList.add("active");
    overlay.classList.add("active");
  });
});

/* ============================
   CERRAR TARJETA
   ============================ */

overlay.addEventListener("click", closeCard);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCard();
});

function closeCard() {
  if (!activeCard) return;

  activeCard.classList.remove("active");
  overlay.classList.remove("active");
  activeCard = null;
}

/* ============================
   CURSOR PUNTO
   ============================ */

const dot = document.createElement("div");
dot.classList.add("cursor-dot");
document.body.appendChild(dot);

document.addEventListener("mousemove", (e) => {
  dot.style.left = e.clientX + "px";
  dot.style.top = e.clientY + "px";
});

/* ============================
   REINICIO → MIGRACIÓN
   ============================ */

if (restartCard) {
  restartCard.addEventListener("click", (e) => {
    e.stopPropagation();

    gallery.classList.add("migrate");

    setTimeout(() => {
      window.location.href = "main.html";
    }, 1200);
  });
}

/* =========================================================
   SONIDO AMBIENTE DIAGRAMA (AUTOMÁTICO + FADE IN)
   ========================================================= */

   const diagramSound = document.getElementById("diagramSound");
   let diagramSoundStarted = false;
   
   function startDiagramSound() {
     if (diagramSoundStarted) return;
   
     diagramSoundStarted = true;
     diagramSound.volume = 0.2;
     diagramSound.play().catch(() => {});
   
     // Fade-in suave
     let vol = 0;
     const fade = setInterval(() => {
       vol += 0.005;
       diagramSound.volume = Math.min(vol, 0.12); // volumen final
       if (vol >= 0.12) clearInterval(fade);
     }, 60);
   }
   
   /* ---------------------------------------------------------
      Si el audio ya fue desbloqueado en index/main,
      arranca automáticamente
   --------------------------------------------------------- */
   
   if (sessionStorage.getItem("audioUnlocked") === "true") {
     startDiagramSound();
   } else {
     document.addEventListener("mousemove", startDiagramSound, { once: true });
     document.addEventListener("click", startDiagramSound, { once: true });
     document.addEventListener("keydown", startDiagramSound, { once: true });
   }

   /* =========================================================
      RESET AL VOLVER DESDE OTRA PÁGINA (BFCache)
      ========================================================= */
   
      window.addEventListener("pageshow", (event) => {
        if (event.persisted) {
          ambientSound.pause();
          ambientSound.currentTime = 0;
        }
      });
   