const mediaCards = document.querySelectorAll(".media-card");
const doorCards = document.querySelectorAll("[data-door]");
const navLinks = document.querySelectorAll(".nav-link");

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

const updateActiveLink = () => {
  const currentHash = window.location.hash || "#home";

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === currentHash);
  });
};

window.addEventListener("hashchange", updateActiveLink);
updateActiveLink();
