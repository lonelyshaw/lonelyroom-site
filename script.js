const mediaCards = document.querySelectorAll(".media-card");
const doorCards = document.querySelectorAll("[data-door]");
const navLinks = document.querySelectorAll(".nav-link");
const roomItems = document.querySelectorAll("[data-room-item]");
const friendForm = document.querySelector("#friend-form");
const friendInput = document.querySelector("#friend-nick");
const friendRoom = document.querySelector("#friend-room");
const friendName = document.querySelector("#friend-name");
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#friend-note");
const notesWall = document.querySelector("#friend-notes-wall");
const tableNotes = document.querySelector("#table-notes");

const setCardGlow = (card, event) => {
  const rect = card.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;

  card.style.setProperty("--glow-x", `${x}%`);
  card.style.setProperty("--glow-y", `${y}%`);
};

mediaCards.forEach((card) => {
  card.setAttribute("tabindex", "0");

  card.addEventListener("pointermove", (event) => {
    setCardGlow(card, event);
    card.classList.add("is-glowing");
  });

  card.addEventListener("pointerleave", () => {
    card.classList.remove("is-glowing");
  });

  card.addEventListener("click", () => {
    if (!window.matchMedia("(hover: none)").matches) {
      return;
    }

    mediaCards.forEach((item) => {
      if (item !== card) {
        item.classList.remove("is-open");
      }
    });

    card.classList.toggle("is-open");
  });
});

doorCards.forEach((door) => {
  door.addEventListener("pointerenter", () => {
    door.classList.add("is-lit");
  });

  door.addEventListener("pointerleave", () => {
    door.classList.remove("is-lit");
  });
});

roomItems.forEach((item) => {
  item.addEventListener("click", () => {
    roomItems.forEach((roomItem) => {
      if (roomItem !== item) {
        roomItem.classList.remove("is-active");
      }
    });

    item.classList.toggle("is-active");
  });

  item.addEventListener("blur", () => {
    item.classList.remove("is-active");
  });
});

const createNote = (text, index) => {
  const note = document.createElement("span");
  note.className = "visitor-note";
  note.textContent = text;
  note.style.transform = `rotate(${index % 2 === 0 ? "-3deg" : "4deg"})`;

  return note;
};

const clearDemoNotes = () => {
  notesWall?.querySelectorAll(".visitor-note").forEach((note) => note.remove());
  tableNotes?.replaceChildren();
};

friendForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const nick = friendInput.value.trim();

  if (!nick) {
    friendInput.focus();
    return;
  }

  friendName.textContent = nick;
  friendRoom.classList.remove("is-hidden");
  clearDemoNotes();
  noteInput.value = "";

  requestAnimationFrame(() => {
    friendRoom.scrollIntoView({ behavior: "smooth", block: "start" });
    noteInput.focus({ preventScroll: true });
  });
});

noteForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = noteInput.value.trim();

  if (!text) {
    noteInput.focus();
    return;
  }

  const notesCount = notesWall.querySelectorAll(".visitor-note").length + tableNotes.children.length;
  const note = createNote(text, notesCount);

  if (notesCount % 2 === 0) {
    notesWall.append(note);
  } else {
    tableNotes.append(note);
  }

  noteInput.value = "";
  noteInput.focus();
});

const updateActiveLink = () => {
  const currentHash = window.location.hash || "#home";

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === currentHash);
  });
};

window.addEventListener("hashchange", updateActiveLink);
updateActiveLink();
