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
const musicDialog = document.querySelector("#musicDialog");
const musicClose = document.querySelector("#musicClose");
const musicContinue = document.querySelector("#musicContinue");
const musicPlayButton = document.querySelector("#musicPlayButton");
const musicPlayLabel = musicPlayButton.querySelector(".music-play-label");
const spotifyEmbed = document.querySelector("#spotifyEmbed");
const discovered = new Set();
const isTouchViewport = window.matchMedia("(pointer: coarse)");
const flowerHotspots = [];
let lastHotspotSync = 0;
let spotifyController;
let spotifyPlaying = false;

window.onSpotifyIframeApiReady = (IFrameAPI) => {
  IFrameAPI.createController(spotifyEmbed, {
    width: "100%",
    height: "152",
    uri: "spotify:track:35ttE4t8lQZA2vuCYDg4G7"
  }, (controller) => {
    spotifyController = controller;
    musicPlayButton.disabled = false;
    musicPlayLabel.textContent = "Reproducir M.A.I";
  });
};

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

function syncFlowerHotspots(timestamp = 0) {
  if (timestamp - lastHotspotSync >= 30) {
    flowerHotspots.forEach((hotspot, index) => {
      const center = flowers[index].querySelector(".flower__white-circle");
      const rect = center.getBoundingClientRect();
      const size = Math.max(72, Math.min(92, Math.max(rect.width, rect.height) * 1.85));
      const left = Math.max(0, Math.min(window.innerWidth - size, rect.left + rect.width / 2 - size / 2));
      const top = Math.max(0, Math.min(window.innerHeight - size, rect.top + rect.height / 2 - size / 2));

      hotspot.style.width = `${size}px`;
      hotspot.style.height = `${size}px`;
      hotspot.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    });
    lastHotspotSync = timestamp;
  }

  window.requestAnimationFrame(syncFlowerHotspots);
}

function setFlowerHotspotsEnabled(enabled) {
  flowerHotspots.forEach((hotspot, index) => {
    hotspot.disabled = !enabled || discovered.has(index);
  });
}

function decorateFlowers() {
  const hotspotLayer = document.createElement("div");
  hotspotLayer.className = "flower-hotspots";
  hotspotLayer.setAttribute("aria-label", "Flores con mensajes");
  body.appendChild(hotspotLayer);

  flowers.forEach((flower, index) => {
    flower.dataset.reason = index;
    flower.tabIndex = -1;
    flower.removeAttribute("role");
    flower.removeAttribute("aria-label");

    const hotspot = document.createElement("button");
    hotspot.type = "button";
    hotspot.className = "flower-hotspot";
    hotspot.disabled = true;
    hotspot.setAttribute("aria-label", `Descubrir la razón ${index + 1}`);
    hotspot.addEventListener("pointerdown", () => requestAnimationFrame(resetViewport));
    hotspot.addEventListener("pointerenter", () => flower.classList.add("is-hotspot-hovered"));
    hotspot.addEventListener("pointerleave", () => flower.classList.remove("is-hotspot-hovered"));
    hotspot.addEventListener("focus", () => flower.classList.add("is-hotspot-hovered"));
    hotspot.addEventListener("blur", () => flower.classList.remove("is-hotspot-hovered"));
    hotspot.addEventListener("click", () => {
      resetViewport();
      openReason(index);
    });
    hotspotLayer.appendChild(hotspot);
    flowerHotspots.push(hotspot);
  });

  window.requestAnimationFrame(syncFlowerHotspots);
}

function openReason(index) {
  if (discovered.has(index)) return;
  resetViewport();
  discovered.add(index);
  flowers[index].classList.add("is-discovered");
  flowerHotspots[index].disabled = true;
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
      flowerHotspots[nextIndex].focus({ preventScroll: true });
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
  body.classList.remove("not-loaded");
  body.classList.add("experience-started");
  opening.classList.add("is-gone");
  createShootingStar();
  soundButton.classList.add("is-highlighted");
  showCenteredDialog(musicDialog);
  await wait(3300);
  body.classList.add("experience-ready");
  setFlowerHotspotsEnabled(true);
  releasePetals(9);
});

dialogClose.addEventListener("click", () => memoryDialog.close());
dialogNext.addEventListener("click", focusNextFlower);
letterButton.addEventListener("click", () => {
  showCenteredDialog(letterDialog);
  releasePetals(22);
});
letterClose.addEventListener("click", () => letterDialog.close());
musicClose.addEventListener("click", () => musicDialog.close());
musicContinue.addEventListener("click", () => musicDialog.close());
musicPlayButton.addEventListener("click", () => {
  if (!spotifyController) return;
  spotifyController.togglePlay();
  spotifyPlaying = !spotifyPlaying;
  musicPlayButton.querySelector("span[aria-hidden]").textContent = spotifyPlaying ? "❚❚" : "▶";
  musicPlayLabel.textContent = spotifyPlaying ? "Pausar M.A.I" : "Reproducir M.A.I";
  soundButton.classList.toggle("is-highlighted", spotifyPlaying);
});
soundButton.addEventListener("click", () => {
  soundButton.classList.remove("is-highlighted");
  showCenteredDialog(musicDialog);
});

[memoryDialog, letterDialog, musicDialog].forEach((dialog) => {
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

window.setInterval(() => {
  if (body.classList.contains("experience-started") && Math.random() > 0.35) {
    createShootingStar();
  }
}, 3900);

buildProgress();
decorateFlowers();
window.setTimeout(typeTerminal, 450);
