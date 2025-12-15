/* =========================================================
   REFERENCIAS
   ========================================================= */

   const anomaly = document.getElementById("anomaly");
   const ambientSound = document.getElementById("ambientSound");
   const clickSound = document.getElementById("hoverSound");
   const field = document.getElementById("field");
   
   
   /* =========================================================
      CURSOR CUSTOM
      ========================================================= */
   
   const cursor = document.createElement("div");
   cursor.style.width = "20px";
   cursor.style.height = "20px";
   cursor.style.border = "1px solid rgba(255,255,255,0.6)";
   cursor.style.borderRadius = "50%";
   cursor.style.position = "absolute";
   cursor.style.pointerEvents = "none";
   cursor.style.transition = "transform 0.1s ease";
   document.body.appendChild(cursor);
   
   document.addEventListener("mousemove", (e) => {
     cursor.style.left = e.clientX - 10 + "px";
     cursor.style.top = e.clientY - 10 + "px";
   });
   
   
   /* =========================================================
      SONIDO AMBIENTAL – ACTIVACIÓN + FADE IN
      ========================================================= */
   
   /*
     Esta función:
     - se llama muchas veces
     - SOLO hace algo si el audio está pausado
   */
   function startAmbientSound() {
     if (!ambientSound.paused) return; // protección clave
   
     ambientSound.volume = 0;
     ambientSound.play().catch(() => {});
   
     // Fade-in orgánico
     let vol = 0;
     const fade = setInterval(() => {
       vol += 0.01;
       ambientSound.volume = Math.min(vol, 0.30);
   
       if (vol >= 0.30) clearInterval(fade);
     }, 60);
   }
   
   /*
     Cualquier gesto desbloquea el audio.
     No usamos once:true porque el if ya protege.
   */
   document.addEventListener("mousemove", startAmbientSound);
   document.addEventListener("click", startAmbientSound);
   document.addEventListener("keydown", startAmbientSound);
   
   
   /* =========================================================
      RESET AL VOLVER DESDE OTRA PÁGINA (BFCache)
      ========================================================= */
   
   window.addEventListener("pageshow", (event) => {
     if (event.persisted) {
       ambientSound.pause();
       ambientSound.currentTime = 0;
     }
   });
   
   
   /* =========================================================
      INTERACCIÓN CON LA ANOMALÍA
      ========================================================= */
   
   anomaly.addEventListener("mouseenter", () => {
     cursor.style.transform = "scale(1.5)";
   });
   
   anomaly.addEventListener("mouseleave", () => {
     cursor.style.transform = "scale(1)";
   });
   
   
   /* =========================================================
      CLICK → SONIDO PUNTUAL + ONDA + TRANSICIÓN
      ========================================================= */
   
   anomaly.addEventListener("click", () => {
   
     /* ---- sonido puntual ---- */
     clickSound.currentTime = 0;
     clickSound.volume = 0.35;
     clickSound.play().catch(() => {});
   
     /* ---- ducking del ambiente ---- */
     ambientSound.volume = 0.12;
   
     /* ---- onda visual ---- */
     const wave = document.createElement("div");
     wave.classList.add("wave");
   
     const rect = anomaly.getBoundingClientRect();
     wave.style.left = rect.left + rect.width / 2 - 15 + "px";
     wave.style.top = rect.top + rect.height / 2 - 15 + "px";
   
     document.body.appendChild(wave);
   
     /* ---- sacudida del campo ---- */
     field.classList.add("shake");
   
     /* ---- transición ---- */
     setTimeout(() => {
       window.location.href = "main.html";
     }, 1500);
   });