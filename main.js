/* =========================================================
   VARIABLES DE GESTO
   ========================================================= */

   let lastX = null;
   let lastY = null;
   let lastTime = null;
   let cursorSpeed = 0;

   /* =========================================================
   ESTADO DE ESTABILIZACIÓN
   ========================================================= */

    let slowStartTime = null;
    let stabilized = false;

    // tiempo requerido en milisegundos
    const REQUIRED_SLOW_TIME = 6000;
   
   
   /* =========================================================
      REFERENCIAS
      ========================================================= */
   
   const space = document.getElementById("space");
   const ambientSound = document.getElementById("ambientSound");
   
   
   /* =========================================================
      CREACIÓN DEL CAMPO (PULSACIONES)
      ========================================================= */
   
   const pulses = [];
   const PULSE_COUNT = 10;
   
   for (let i = 0; i < PULSE_COUNT; i++) {
     const pulse = document.createElement("div");
     pulse.classList.add("pulse");
   
     pulse.x = Math.random() * window.innerWidth;
     pulse.y = Math.random() * window.innerHeight;
   
     pulse.style.left = pulse.x + "px";
     pulse.style.top = pulse.y + "px";
   
     // Intensidad perceptiva
     pulse.dataset.type = Math.random() < 0.6 ? "weak" : "strong";
   
     const size = 180 + Math.random() * 120;
     const blur = 18 + Math.random() * 10;
     const opacity = 0.35 + Math.random() * 0.25;
     const duration = 5 + Math.random() * 4;
   
     pulse.style.width = size + "px";
     pulse.style.height = size + "px";
     pulse.style.filter = `blur(${blur}px)`;
     pulse.style.opacity = opacity;
     pulse.style.animationDuration = `${duration}s`;
   
     space.appendChild(pulse);
     pulses.push(pulse);
   }
   
   
   /* =========================================================
      ACTIVACIÓN + FADE IN DEL SONIDO
      ========================================================= */
   
      function startAmbientSound() {
        if (!ambientSound.paused) return;
      
        ambientSound.volume = 0;
        ambientSound.play().catch(() => {});
        sessionStorage.setItem("audioUnlocked", "true");
      
        let vol = 0;
        const fade = setInterval(() => {
          vol += 0.005;
          ambientSound.volume = Math.min(vol, 0.15);
          if (vol >= 0.15) clearInterval(fade);
        }, 60);
      }
   
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
      MAGNETORRECEPCIÓN: SONIDO + CAMPO
      ========================================================= */
   
   document.addEventListener("mousemove", (e) => {
   
     // ---- velocidad del gesto ----
     const now = performance.now();
   
     if (lastX !== null && lastTime !== null) {
       const dx = e.clientX - lastX;
       const dy = e.clientY - lastY;
       const dt = now - lastTime;
       cursorSpeed = Math.sqrt(dx * dx + dy * dy) / dt;
     }
   
     lastX = e.clientX;
     lastY = e.clientY;
     lastTime = now;

    /* =========================================================
   DETECCIÓN DE NAVEGACIÓN CONSCIENTE
   ========================================================= */

    if (!stabilized) {

        if (cursorSpeed < 0.30) {
    
        // inicia o continúa el conteo
        if (!slowStartTime) {
            slowStartTime = now;
        }
    
        // ¿ya pasó el tiempo necesario?
        if (now - slowStartTime >= REQUIRED_SLOW_TIME) {
            stabilized = true;
            triggerStabilization();
        }
    
        } else {
        // si acelera, se pierde el estado
        slowStartTime = null;
        }
    }
   
     // ---- sonido según velocidad ----
     let targetVolume;
   
     if (cursorSpeed < 0.25) {
       // orientación / calma
       targetVolume = 0.15;
     } else if (cursorSpeed < 0.8) {
       // neutro
       targetVolume = 0.1;
     } else {
       // desorientación
       targetVolume = 0.04;
     }

    // --- suciedad sonora (micro inestabilidad) ---
    if (cursorSpeed > 0.8) {
        const noise = (Math.random() - 0.5) * 0.02;
        targetVolume += noise;
    } 
   
     ambientSound.volume += (targetVolume - ambientSound.volume) * 0.08;
   
     // ---- reacción visual del campo ----
     pulses.forEach(pulse => {
       const dx = e.clientX - pulse.x;
       const dy = e.clientY - pulse.y;
       const dist = Math.sqrt(dx * dx + dy * dy);
   
       if (dist < 260) {
         if (cursorSpeed < 0.8) {
           pulse.style.filter = "blur(18px)";
           pulse.style.opacity = "0.6";
           pulse.style.transform = "scale(1.2)";
         } else {
           pulse.style.filter = "blur(35px)";
           pulse.style.opacity = "0.3";
           pulse.style.transform = "scale(1.8)";
         }
        } else {
            pulse.style.filter = "blur(35px)";
            pulse.style.opacity = "0.3";
          
            // --- desfase perceptivo ---
            const jitterX = (Math.random() - 0.5) * 8;
            const jitterY = (Math.random() - 0.5) * 8;
          
            pulse.style.transform = `translate(${jitterX}px, ${jitterY}px) scale(1.8)`;
          }
     });
   });

   function triggerStabilization() {

    // sonido se vuelve estable
    ambientSound.volume = 0.12;
  
    // el campo se calma visualmente
    pulses.forEach(pulse => {
      pulse.style.filter = "blur(18px)";
      pulse.style.opacity = "0.6";
      pulse.style.transform = "scale(1)";
    });
  
    setTimeout(() => {

        if (ambientSound) {
          ambientSound.pause();
          ambientSound.currentTime = 0;
        }
      
        window.location.href = "diagrama.html";
      
      }, 1200);
  }