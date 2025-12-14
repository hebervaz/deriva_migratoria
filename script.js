const anomaly = document.getElementById("anomaly");
const sound = document.getElementById("hoverSound");

// Cursor custom simple
const cursor = document.createElement("div");
cursor.style.width = "20px";
cursor.style.height = "20px";
cursor.style.border = "1px solid rgba(255,255,255,0.6)";
cursor.style.borderRadius = "50%";
cursor.style.position = "absolute";
cursor.style.pointerEvents = "none";
cursor.style.transition = "transform 0.1s ease";
document.body.appendChild(cursor);

// Movimiento del cursor
document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX - 10 + "px";
  cursor.style.top = e.clientY - 10 + "px";
});

// Hover: sonido y cambio sutil
anomaly.addEventListener("mouseenter", () => {
  sound.volume = 0.2;
  sound.currentTime = 0;
  sound.play();
  cursor.style.transform = "scale(1.5)";
});

anomaly.addEventListener("mouseleave", () => {
  cursor.style.transform = "scale(1)";
});

// Click → transición
anomaly.addEventListener("click", () => {
    // Crear onda
    const wave = document.createElement("div");
    wave.classList.add("wave");
  
    // Posicionar la onda en el centro de la anomalía
    const rect = anomaly.getBoundingClientRect();
    wave.style.left = rect.left + rect.width / 2 - 15 + "px";
    wave.style.top = rect.top + rect.height / 2 - 15 + "px";
  
    document.body.appendChild(wave);
  
    // Sacudir el campo
    const field = document.getElementById("field");
    field.classList.add("shake");
  
    // Opcional: bajar sonido o agregar otro después
    if (sound) {
      sound.volume = 0.1;
    }
  
    // Transición a la siguiente página
    setTimeout(() => {
      window.location.href = "main.html";
    }, 1500);
  });