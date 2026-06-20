const roomButtons = document.querySelectorAll("[data-room-target]");
const navPills = document.querySelectorAll(".nav-pill");
const houseShell = document.querySelector(".house-shell");
const roomScenes = document.querySelectorAll("[data-room]");
const roomClock = document.querySelector("#room-clock");
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-text");
const houseNotes = document.querySelector("#house-notes");
const character = document.querySelector("#character");
const characterFrames = document.querySelectorAll("[data-character-frame]");

let activeRoom = "home";
let isTransitioning = false;

const roomCharacterStates = {
  home: "lookingWindow",
  books: "reading",
  anime: "laptop",
  music: "tea",
  blog: "laptop",
  friends: "tea",
};

const setCharacterState = (state) => {
  character.dataset.characterState = state;

  characterFrames.forEach((frame) => {
    frame.classList.toggle("is-active", frame.dataset.characterFrame === state);
  });
};

const showRoom = (room) => {
  if (isTransitioning || room === activeRoom) {
    return;
  }

  isTransitioning = true;
  houseShell.classList.add("is-transitioning");

  window.setTimeout(() => {
    activeRoom = room;
    houseShell.dataset.activeRoom = activeRoom;
    setCharacterState(roomCharacterStates[activeRoom] || "lookingWindow");

    roomScenes.forEach((scene) => {
      scene.classList.toggle("is-active", scene.dataset.room === activeRoom);
    });

    navPills.forEach((pill) => {
      pill.classList.toggle("is-active", pill.dataset.roomTarget === activeRoom);
    });

    window.setTimeout(() => {
      houseShell.classList.remove("is-transitioning");
      isTransitioning = false;
    }, 300);
  }, 340);
};

roomButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showRoom(button.dataset.roomTarget);
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

const updateClock = () => {
  const now = new Date();
  const time = now.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

  roomClock.textContent = time;
  roomClock.dateTime = now.toISOString();
};

const updateTimeAtmosphere = () => {
  const hour = new Date().getHours();
  let timeOfDay = "night";

  if (hour >= 6 && hour < 17) {
    timeOfDay = "morning";
  } else if (hour >= 17 && hour < 23) {
    timeOfDay = "evening";
  }

  document.body.dataset.time = timeOfDay;
};

updateClock();
updateTimeAtmosphere();
window.setInterval(updateClock, 1000);
window.setInterval(updateTimeAtmosphere, 60000);
