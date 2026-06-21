const roomButtons = document.querySelectorAll("[data-room-target]");
const navPills = document.querySelectorAll(".nav-pill");
const houseShell = document.querySelector(".house-shell");
const roomScenes = document.querySelectorAll("[data-room]");
const contentRooms = document.querySelectorAll("[data-content-room]");
const roomClock = document.querySelector("#room-clock");
const ambientToggle = document.querySelector("#ambient-toggle");
const ambientNotes = document.querySelector("#ambient-notes");

let activeRoom = "home";
let isTransitioning = false;
let audioContext;
let ambientGain;
let rainSource;
let humOscillator;

const AudioContextClass = window.AudioContext || window.webkitAudioContext;

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
  const info = document.createElement("div");
  const name = document.createElement("strong");
  const meta = document.createElement("span");
  const status = document.createElement("button");

  name.textContent = title;
  meta.textContent = "личная полка";
  status.type = "button";
  status.dataset.toggleStatus = "";
  status.textContent = "читаю сейчас";
  info.append(name, meta);
  item.append(info, status);
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
  const name = document.createElement("strong");
  const meta = document.createElement("span");

  name.textContent = title;
  meta.textContent = "добавлено в хочу посмотреть";
  item.append(name, meta);
  document.querySelector('[data-anime-list="wishlist"]').append(item);
  input.value = "";
});

document.querySelector("[data-add-track]").addEventListener("click", () => {
  const item = document.createElement("article");
  item.className = "track-card";
  const play = document.createElement("button");
  const info = document.createElement("div");
  const title = document.createElement("strong");
  const genre = document.createElement("span");
  const duration = document.createElement("span");

  play.type = "button";
  play.dataset.playTrack = "";
  play.textContent = "▶";
  title.textContent = "New Rain Song";
  genre.textContent = "новый трек";
  duration.textContent = "03:00";
  info.append(title, genre);
  item.append(play, info, duration);
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
  const date = document.createElement("time");
  const heading = document.createElement("strong");
  const text = document.createElement("p");

  date.textContent = "сегодня";
  heading.textContent = title;
  text.textContent = "Новая запись из комнаты Lonelyroom.";
  entry.append(date, heading, text);
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
  const author = document.createElement("strong");
  const body = document.createElement("p");

  author.textContent = "гость";
  body.textContent = text;
  message.append(author, body);
  document.querySelector("#guestbook").prepend(message);

  const note = document.createElement("span");
  note.textContent = text;
  document.querySelector("#visitor-notes").prepend(note);
  input.value = "";
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

const randomNoteTexts = [
  "проверь чай",
  "закрой окно позже",
  "оставить плед",
  "дождь стал тише",
  "написать пару строк",
  "добавить книгу",
  "включить музыку",
];

const addAmbientNote = () => {
  if (ambientNotes.children.length > 5) {
    ambientNotes.firstElementChild.remove();
  }

  const note = document.createElement("span");
  note.textContent = randomNoteTexts[Math.floor(Math.random() * randomNoteTexts.length)];
  ambientNotes.append(note);
};

const createNoiseBuffer = (context) => {
  const bufferSize = context.sampleRate * 2;
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i += 1) {
    data[i] = (Math.random() * 2 - 1) * 0.35;
  }

  return buffer;
};

const startAmbientSound = async () => {
  if (!AudioContextClass) {
    ambientToggle.textContent = "звук недоступен";
    return false;
  }

  audioContext = audioContext || new AudioContextClass();
  await audioContext.resume();

  ambientGain = audioContext.createGain();
  ambientGain.gain.value = 0.035;
  ambientGain.connect(audioContext.destination);

  const rainFilter = audioContext.createBiquadFilter();
  rainFilter.type = "lowpass";
  rainFilter.frequency.value = 1300;

  rainSource = audioContext.createBufferSource();
  rainSource.buffer = createNoiseBuffer(audioContext);
  rainSource.loop = true;
  rainSource.connect(rainFilter);
  rainFilter.connect(ambientGain);
  rainSource.start();

  humOscillator = audioContext.createOscillator();
  humOscillator.type = "sine";
  humOscillator.frequency.value = 92;

  const humGain = audioContext.createGain();
  humGain.gain.value = 0.012;
  humOscillator.connect(humGain);
  humGain.connect(ambientGain);
  humOscillator.start();
  return true;
};

const stopAmbientSound = () => {
  rainSource?.stop();
  humOscillator?.stop();
  rainSource = undefined;
  humOscillator = undefined;
  ambientGain?.disconnect();
  ambientGain = undefined;
};

ambientToggle.addEventListener("click", async () => {
  const isOn = ambientToggle.getAttribute("aria-pressed") === "true";

  if (isOn) {
    stopAmbientSound();
    ambientToggle.setAttribute("aria-pressed", "false");
    ambientToggle.textContent = "звук: выкл";
    return;
  }

  const started = await startAmbientSound();
  if (!started) {
    return;
  }

  ambientToggle.setAttribute("aria-pressed", "true");
  ambientToggle.textContent = "звук: дождь";
});

updateClock();
window.setInterval(updateClock, 1000);
window.setInterval(addAmbientNote, 18000);
