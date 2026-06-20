const roomButtons = document.querySelectorAll("[data-open-room]");
const roomScreens = document.querySelectorAll("[data-room]");
const navPills = document.querySelectorAll(".nav-pill");
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-text");
const tableNotes = document.querySelector("#table-notes");

const openRoom = (roomName) => {
  roomScreens.forEach((screen) => {
    screen.classList.toggle("is-active", screen.dataset.room === roomName);
  });

  navPills.forEach((pill) => {
    pill.classList.toggle("is-active", pill.dataset.openRoom === roomName);
  });
};

roomButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openRoom(button.dataset.openRoom);
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
  tableNotes.append(note);
  noteInput.value = "";
  noteInput.focus();
});
