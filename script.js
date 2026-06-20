const sectionButtons = document.querySelectorAll("[data-section]");
const navPills = document.querySelectorAll(".nav-pill");
const houseShell = document.querySelector(".house-shell");
const panels = document.querySelectorAll("[data-panel]");
const hotspots = document.querySelectorAll(".room-hotspot");
const doorGlow = document.querySelector(".door-glow");
const roomName = document.querySelector("#room-name");
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-text");
const houseNotes = document.querySelector("#house-notes");
const character = document.querySelector("#character");
const characterFrames = document.querySelectorAll("[data-character-frame]");

let activeSection = "home";

const sectionLabels = {
  home: "дом",
  books: "библиотека",
  anime: "аниме-комната",
  music: "музыкальный уголок",
  blog: "кабинет",
  friends: "гостиная друзей",
};

const glowPoints = {
  home: ["50%", "50%"],
  books: ["17%", "54%"],
  anime: ["37%", "54%"],
  music: ["56%", "54%"],
  blog: ["74%", "52%"],
  friends: ["88%", "57%"],
};

const setActiveSection = (section) => {
  activeSection = section;
  const isHome = activeSection === "home";

  houseShell.classList.toggle("is-section-open", !isHome);
  roomName.textContent = sectionLabels[activeSection] || sectionLabels.home;

  navPills.forEach((pill) => {
    pill.classList.toggle("is-active", pill.dataset.section === activeSection);
  });

  panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panel === activeSection);
  });

  hotspots.forEach((hotspot) => {
    hotspot.classList.toggle("is-open", hotspot.dataset.section === activeSection);
  });

  const [x, y] = glowPoints[activeSection] || glowPoints.home;
  doorGlow.style.setProperty("--glow-x", x);
  doorGlow.style.setProperty("--glow-y", y);
  doorGlow.classList.toggle("is-visible", !isHome);
};

sectionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveSection(button.dataset.section);
  });
});

noteForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = noteInput.value.trim();

  if (!text) {
    noteInput.focus();
    return;
  }

  const note = document.createElement("span");
  note.textContent = text;
  houseNotes.append(note);
  noteInput.value = "";
  noteInput.focus();
});

const characterStates = ["reading", "tea", "laptop", "lookingWindow"];
let characterTimer;

const setCharacterState = (state) => {
  character.dataset.characterState = state;

  characterFrames.forEach((frame) => {
    frame.classList.toggle("is-active", frame.dataset.characterFrame === state);
  });
};

const scheduleCharacterIdle = () => {
  const nextDelay = 15000 + Math.random() * 15000;

  characterTimer = window.setTimeout(() => {
    const currentState = character.dataset.characterState;
    const nextStates = characterStates.filter((state) => state !== currentState);
    const nextState = nextStates[Math.floor(Math.random() * nextStates.length)];

    setCharacterState(nextState);
    scheduleCharacterIdle();
  }, nextDelay);
};

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  scheduleCharacterIdle();
}

window.addEventListener("beforeunload", () => {
  window.clearTimeout(characterTimer);
});
