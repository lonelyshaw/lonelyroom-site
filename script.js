const roomButtons = document.querySelectorAll("[data-room-target]");
const navPills = document.querySelectorAll(".nav-pill");
const houseShell = document.querySelector(".house-shell");
const roomScenes = document.querySelectorAll("[data-room]");
const contentRooms = document.querySelectorAll("[data-content-room]");

let activeRoom = "home";
let isTransitioning = false;

const showRoom = (room) => {
  if (isTransitioning || room === activeRoom) {
    return;
  }

  isTransitioning = true;
  houseShell.classList.add("is-transitioning");

  window.setTimeout(() => {
    activeRoom = room;
    houseShell.dataset.activeRoom = activeRoom;

    roomScenes.forEach((scene) => {
      scene.classList.toggle("is-active", scene.dataset.room === activeRoom);
    });

    contentRooms.forEach((content) => {
      content.classList.toggle("is-active", content.dataset.contentRoom === activeRoom);
    });

    navPills.forEach((pill) => {
      pill.classList.toggle("is-active", pill.dataset.roomTarget === activeRoom);
    });

    window.setTimeout(() => {
      houseShell.classList.remove("is-transitioning");
      isTransitioning = false;
    }, 300);
  }, 320);
};

roomButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showRoom(button.dataset.roomTarget);
  });
});

document.addEventListener("click", (event) => {
  const statusButton = event.target.closest("[data-toggle-status]");
  const playlistButton = event.target.closest("[data-playlist]");
  const trackButton = event.target.closest("[data-play-track]");

  if (statusButton) {
    const card = statusButton.closest("[data-book-card]");
    card.classList.toggle("is-done");
    statusButton.textContent = card.classList.contains("is-done") ? "прочитано" : "читаю сейчас";
  }

  if (playlistButton) {
    document.querySelectorAll("[data-playlist]").forEach((button) => button.classList.remove("is-active"));
    playlistButton.classList.add("is-active");
  }

  if (trackButton) {
    const card = trackButton.closest(".track-card");
    card.classList.toggle("is-playing");
    trackButton.textContent = card.classList.contains("is-playing") ? "Ⅱ" : "▶";
  }
});

const addNote = (type, text) => {
  const list = document.querySelector(`[data-note-list="${type}"]`);
  const note = document.createElement("p");
  note.textContent = text;
  list.prepend(note);
};

document.querySelectorAll("[data-note-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const type = form.dataset.noteForm;
    const textarea = form.elements.note;
    const text = textarea.value.trim();

    if (!text) {
      textarea.focus();
      return;
    }

    addNote(type, text);
    textarea.value = "";
  });
});

document.querySelector("[data-add-book]").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = event.currentTarget.elements.title;
  const title = input.value.trim();

  if (!title) {
    input.focus();
    return;
  }

  const item = document.createElement("article");
  item.className = "book-card";
  item.dataset.bookCard = "";
  item.innerHTML = `<div><strong>${title}</strong><span>личная полка</span></div><button type="button" data-toggle-status>читаю сейчас</button>`;
  document.querySelector("#reading-list").prepend(item);
  input.value = "";
});

document.querySelector("[data-add-anime]").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = event.currentTarget.elements.title;
  const title = input.value.trim();

  if (!title) {
    input.focus();
    return;
  }

  const item = document.createElement("article");
  item.className = "anime-item";
  item.innerHTML = `<strong>${title}</strong><span>добавлено в хочу посмотреть</span>`;
  document.querySelector('[data-anime-list="wishlist"]').append(item);
  input.value = "";
});

document.querySelector("[data-add-track]").addEventListener("click", () => {
  const item = document.createElement("article");
  item.className = "track-card";
  item.innerHTML = '<button type="button" data-play-track>▶</button><div><strong>New Rain Song</strong><span>новый трек</span></div><span>03:00</span>';
  document.querySelector("#track-list").prepend(item);
});

document.querySelector("[data-add-entry]").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = event.currentTarget.elements.title;
  const title = input.value.trim();

  if (!title) {
    input.focus();
    return;
  }

  const entry = document.createElement("article");
  entry.className = "blog-entry";
  entry.innerHTML = `<time>сегодня</time><strong>${title}</strong><p>Новая запись из комнаты Lonelyroom.</p>`;
  document.querySelector("#entry-list").prepend(entry);
  input.value = "";
});

document.querySelector("[data-add-friend-message]").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = event.currentTarget.elements.message;
  const text = input.value.trim();

  if (!text) {
    input.focus();
    return;
  }

  const message = document.createElement("article");
  message.innerHTML = `<strong>гость</strong><p>${text}</p>`;
  document.querySelector("#guestbook").prepend(message);

  const note = document.createElement("span");
  note.textContent = text;
  document.querySelector("#visitor-notes").prepend(note);
  input.value = "";
});
