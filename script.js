const focusButtons = document.querySelectorAll("[data-focus-room]");
const navPills = document.querySelectorAll(".nav-pill");
const houseShell = document.querySelector(".house-shell");
const houseCamera = document.querySelector(".house-camera");
const hotspots = document.querySelectorAll(".room-hotspot");
const doorGlow = document.querySelector(".door-glow");
const roomName = document.querySelector("#room-name");
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-text");
const houseNotes = document.querySelector("#house-notes");

const roomLabels = {
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

const focusRoom = (room) => {
  houseCamera.dataset.currentRoom = room;
  houseShell.classList.toggle("is-focused", room !== "home");
  roomName.textContent = roomLabels[room] || roomLabels.home;

  navPills.forEach((pill) => {
    pill.classList.toggle("is-active", pill.dataset.focusRoom === room);
  });

  hotspots.forEach((hotspot) => {
    hotspot.classList.toggle("is-open", hotspot.dataset.focusRoom === room);
  });

  const [x, y] = glowPoints[room] || glowPoints.home;
  doorGlow.style.setProperty("--glow-x", x);
  doorGlow.style.setProperty("--glow-y", y);
  doorGlow.classList.toggle("is-visible", room !== "home");
};

focusButtons.forEach((button) => {
  button.addEventListener("click", () => {
    focusRoom(button.dataset.focusRoom);
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
