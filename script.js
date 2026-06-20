const roomButtons = document.querySelectorAll("[data-open-room]");
const roomPanels = document.querySelectorAll("[data-room]");
const navPills = document.querySelectorAll(".nav-pill");
const roomObjects = document.querySelectorAll(".room-object");
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-text");
const tableNotes = document.querySelector("#table-notes");

const openRoom = (roomName) => {
  roomPanels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.room === roomName);
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

roomObjects.forEach((object) => {
  object.addEventListener("click", () => {
    roomObjects.forEach((item) => {
      if (item !== object) {
        item.classList.remove("is-open");
      }
    });

    object.classList.toggle("is-open");
  });

  object.addEventListener("blur", () => {
    object.classList.remove("is-open");
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
