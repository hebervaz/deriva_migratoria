/* =========================================================
   VARIABLES PARA MEDIR EL GESTO DEL USUARIO
   ========================================================= */

// Última posición del cursor
let lastX = null;
let lastY = null;

// Último tiempo registrado
let lastTime = null;

// Velocidad calculada del cursor
let cursorSpeed = 0;


/* =========================================================
   REFERENCIAS AL ENTORNO
   ========================================================= */

// Contenedor principal del espacio
const space = document.getElementById("space");

// Sonido ambiente (ave tecnológica / dron)
const sound = document.getElementById("ambientSound");


/* =========================================================
   CREACIÓN DEL CAMPO DE PULSACIONES
   ========================================================= */

const pulses = [];
const PULSE_COUNT = 10; // cantidad total del campo

for (let i = 0; i < PULSE_COUNT; i++) {

  // Crear elemento visual
  const pulse = document.createElement("div");
  pulse.classList.add("pulse");

  // Posición aleatoria en pantalla
  pulse.x = Math.random() * window.innerWidth;
  pulse.y = Math.random() * window.innerHeight;

  pulse.style.left = pulse.x + "px";
  pulse.style.top = pulse.y + "px";

  /* -----------------------------------------
     INTENSIDAD DEL CAMPO
     Algunas pulsaciones reaccionan más,
     otras solo acompañan (entorno ≠ evento)
     ----------------------------------------- */

  const intensity = Math.random();

  if (intensity < 0.6) {
    pulse.dataset.type = "weak";   // pulsación débil
  } else {
    pulse.dataset.type = "strong"; // pulsación sensible
  }

  /* -----------------------------------------
     VARIACIONES VISUALES ORGÁNICAS
     Ninguna pulsación es idéntica
     ----------------------------------------- */

  const size = 180 + Math.random() * 120;
  const blur = 18 + Math.random() * 10;
  const opacity = 0.35 + Math.random() * 0.25;
  const duration = 5 + Math.random() * 4;

  pulse.style.width = size + "px";
  pulse.style.height = size + "px";
  pulse.style.filter = `blur(${blur}px)`;
  pulse.style.opacity = opacity;
  pulse.style.animationDuration = `${duration}s`;

  // Insertar en el espacio
  space.appendChild(pulse);
  pulses.push(pulse);
}


/* =========================================================
   ACTIVACIÓN DEL SONIDO (TRAS PRIMER GESTO)
   ========================================================= */

let soundStarted = false;


/* =========================================================
   INTERACCIÓN PRINCIPAL: MAGNETORRECEPCIÓN
   ========================================================= */

document.addEventListener("mousemove", (e) => {

  /* -----------------------------------------
     Activar sonido solo una vez
     (restricción de navegadores)
     ----------------------------------------- */

  if (!soundStarted) {
    sound.volume = 0.25;
    sound.play().catch(() => {});
    soundStarted = true;
  }

  /* -----------------------------------------
     Calcular velocidad del gesto
     ----------------------------------------- */

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

  /* -----------------------------------------
     Reacción del campo al cuerpo
     ----------------------------------------- */

  pulses.forEach(pulse => {

    const dx = e.clientX - pulse.x;
    const dy = e.clientY - pulse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // ---- CAMPO CERCANO ----
    if (dist < 260) {

      // Movimiento lento → estabilidad
      if (cursorSpeed < 0.8) {
        pulse.style.filter = "blur(18px)";
        pulse.style.opacity = "0.6";
        pulse.style.transform = "scale(1.25)";
        sound.volume = 0.22;

      // Movimiento rápido → desorganización
      } else {
        pulse.style.filter = "blur(35px)";
        pulse.style.opacity = "0.3";
        pulse.style.transform = "scale(1.9)";
        sound.volume = 0.15;
      }

    }

    // ---- CAMPO LEJANO ----
    else {
      pulse.style.filter = "blur(22px)";
      pulse.style.opacity = "0.45";
      pulse.style.transform = "scale(1)";
      sound.volume = 0.25;
    }

  });

});