const EXPERIENCE = {
  name: "Any",
  reasons: [
    "Porque contigo hasta los días normales se sienten especiales.",
    "Porque tu sonrisa tiene una forma muy bonita de arreglar mi mundo.",
    "Porque puedo ser completamente yo cuando estoy contigo.",
    "Porque tu manera de ser hace más bonito todo lo que te rodea.",
    "Porque cada momento contigo termina convirtiéndose en uno de mis recuerdos favoritos."
  ]
};

const body = document.body;
const opening = document.querySelector("#opening");
const terminalLine = document.querySelector("#terminalLine");
const beginButton = document.querySelector("#beginButton");
const flowers = [...document.querySelectorAll(".flower")];
const progress = document.querySelector("#discoveryProgress");
const discoverCopy = document.querySelector("#discoverCopy");
const memoryDialog = document.querySelector("#memoryDialog");
const dialogKicker = document.querySelector("#dialogKicker");
const dialogMessage = document.querySelector("#dialogMessage");
const dialogClose = document.querySelector("#dialogClose");
const dialogNext = document.querySelector("#dialogNext");
const letterButton = document.querySelector("#letterButton");
const letterDialog = document.querySelector("#letterDialog");
const letterClose = document.querySelector("#letterClose");
const soundButton = document.querySelector("#soundButton");
const discovered = new Set();
const isTouchViewport = window.matchMedia("(pointer: coarse)");

const terminalSteps = [
  { text: "> Inicializando sorpresa para Any…", wait: 330 },
  { text: "\n> Buscando la flor más bonita…", wait: 400 },
  { text: "\n> Coincidencia encontrada: Any ✦", wait: 350 },
  { text: "\n> Jardín listo para florecer.", wait: 0 }
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function resetViewport() {
  window.scrollTo(0, 0);
  document.documentElement.scrollLeft = 0;
  document.documentElement.scrollTop = 0;
  body.scrollLeft = 0;
  body.scrollTop = 0;
}

function showCenteredDialog(dialog) {
  resetViewport();
  dialog.showModal();
  requestAnimationFrame(resetViewport);
}

async function typeTerminal() {
  terminalLine.textContent = "";
  for (const step of terminalSteps) {
    for (const character of step.text) {
      terminalLine.textContent += character;
      await wait(character === "\n" ? 120 : 24 + Math.random() * 24);
    }
    await wait(step.wait);
  }
  beginButton.disabled = false;
}

function createShootingStar() {
  const star = document.createElement("div");
  star.className = "shooting-star";
  star.style.top = Math.random() * 58 + "%";
  star.style.left = -12 - Math.random() * 8 + "%";
  star.style.animationDelay = "0s";
  star.style.animationDuration = 2.2 + Math.random() * 1.5 + "s";
  document.querySelector(".shooting-stars").appendChild(star);
  window.setTimeout(() => star.remove(), 4300);
}

function buildProgress() {
  progress.innerHTML = "";
  flowers.forEach((_, index) => {
    const dot = document.createElement("i");
    dot.dataset.index = index;
    progress.appendChild(dot);
  });
}

function decorateFlowers() {
  flowers.forEach((flower, index) => {
    flower.dataset.reason = index;
    flower.tabIndex = 0;
    flower.setAttribute("role", "button");
    flower.setAttribute("aria-label", `Descubrir la razón ${index + 1}`);
    flower.addEventListener("pointerdown", () => requestAnimationFrame(resetViewport));
    flower.addEventListener("click", () => {
      flower.blur();
      resetViewport();
      openReason(index);
    });
    flower.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openReason(index);
      }
    });
  });
}

function openReason(index) {
  resetViewport();
  discovered.add(index);
  flowers[index].classList.add("is-discovered");
  progress.children[index]?.classList.add("is-on");
  dialogKicker.textContent = `RAZÓN ${String(index + 1).padStart(2, "0")} · PARA ${EXPERIENCE.name.toUpperCase()}`;
  dialogMessage.textContent = EXPERIENCE.reasons[index];
  dialogNext.textContent = discovered.size === flowers.length ? "Leer mi carta" : "Descubrir otra flor";
  showCenteredDialog(memoryDialog);
  updateJourney();
  if (navigator.vibrate) navigator.vibrate(28);
}

function updateJourney() {
  const remaining = flowers.length - discovered.size;
  if (remaining > 1) {
    discoverCopy.textContent = `Aún quedan ${remaining} flores por descubrir`;
  } else if (remaining === 1) {
    discoverCopy.textContent = "Queda una última flor guardando un secreto";
  } else {
    discoverCopy.textContent = "Has hecho florecer todo el jardín";
    letterButton.hidden = false;
    releasePetals(26);
  }
}

function focusNextFlower() {
  const nextIndex = flowers.findIndex((_, index) => !discovered.has(index));
  if (nextIndex >= 0) {
    memoryDialog.close();
    if (!isTouchViewport.matches) {
      flowers[nextIndex].focus({ preventScroll: true });
    }
    requestAnimationFrame(resetViewport);
  } else {
    memoryDialog.close();
    showCenteredDialog(letterDialog);
  }
}

function releasePetals(amount = 18) {
  for (let index = 0; index < amount; index += 1) {
    window.setTimeout(() => {
      const petal = document.createElement("i");
      petal.className = "petal";
      petal.style.left = Math.random() * 100 + "vw";
      petal.style.setProperty("--fall", 4.8 + Math.random() * 4 + "s");
      petal.style.setProperty("--drift", -80 + Math.random() * 160 + "px");
      document.body.appendChild(petal);
      window.setTimeout(() => petal.remove(), 9000);
    }, index * 110);
  }
}

beginButton.addEventListener("click", async () => {
  await setAmbience(true);
  body.classList.remove("not-loaded");
  body.classList.add("experience-started");
  opening.classList.add("is-gone");
  createShootingStar();
  await wait(3300);
  body.classList.add("experience-ready");
  releasePetals(9);
});

dialogClose.addEventListener("click", () => memoryDialog.close());
dialogNext.addEventListener("click", focusNextFlower);
letterButton.addEventListener("click", () => {
  showCenteredDialog(letterDialog);
  releasePetals(22);
});
letterClose.addEventListener("click", () => letterDialog.close());

[memoryDialog, letterDialog].forEach((dialog) => {
  dialog.addEventListener("close", () => requestAnimationFrame(resetViewport));
  dialog.addEventListener("click", (event) => {
    const box = dialog.getBoundingClientRect();
    const outside = event.clientX < box.left || event.clientX > box.right ||
      event.clientY < box.top || event.clientY > box.bottom;
    if (outside) dialog.close();
  });
});

window.addEventListener("resize", resetViewport);
window.visualViewport?.addEventListener("resize", resetViewport);

let audioContext;
let ambienceTimer;
let ambienceOn = false;

function playChime(frequency, delay = 0) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime + delay);
  gain.gain.exponentialRampToValueAtTime(0.045, audioContext.currentTime + delay + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + delay + 1.7);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start(audioContext.currentTime + delay);
  oscillator.stop(audioContext.currentTime + delay + 1.8);
}

function playAmbiencePhrase() {
  [261.63, 329.63, 392].forEach((frequency, index) => playChime(frequency, index * 0.28));
}

async function setAmbience(enabled) {
  ambienceOn = enabled;
  soundButton.setAttribute("aria-pressed", String(ambienceOn));
  soundButton.querySelector(".sound-label").textContent = ambienceOn ? "Sonando" : "Sonido";
  if (ambienceOn) {
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
    await audioContext.resume();
    window.clearInterval(ambienceTimer);
    playAmbiencePhrase();
    ambienceTimer = window.setInterval(playAmbiencePhrase, 5200);
  } else {
    window.clearInterval(ambienceTimer);
  }
}

soundButton.addEventListener("click", async () => {
  await setAmbience(!ambienceOn);
});

window.setInterval(() => {
  if (body.classList.contains("experience-started") && Math.random() > 0.35) {
    createShootingStar();
  }
}, 3900);

buildProgress();
decorateFlowers();
window.setTimeout(typeTerminal, 450);
