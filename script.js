// Gallery content and interactions are kept together so categories and lightbox
// navigation always use the same source of truth.
const images = [
  {
    title: "Where the forest breathes",
    description: "A quiet walk beneath the evergreens.",
    category: "Nature",
    alt: "Sunlight finding its way through a quiet evergreen forest",
    src: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "The last light",
    description: "Golden hour settles over the hills.",
    category: "Nature",
    alt: "Warm evening light across a rolling mountain landscape",
    src: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "Into the wild",
    description: "A glimpse of the world, untouched.",
    category: "Nature",
    alt: "A green valley and distant mountains beneath a bright sky",
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "A curious friend",
    description: "A little wonder in the wilderness.",
    category: "Animals",
    alt: "A fox looking curiously toward the camera in its natural habitat",
    src: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "Made for the sunshine",
    description: "A happy pause in the afternoon.",
    category: "Animals",
    alt: "A friendly dog enjoying a sunny day outdoors",
    src: "https://images.unsplash.com/photo-1551717743-49959800b1f6?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "Quiet company",
    description: "A gentle moment, perfectly still.",
    category: "Animals",
    alt: "A close-up portrait of a wild animal in soft natural light",
    src: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "The city never sleeps",
    description: "A thousand stories in the skyline.",
    category: "Cities",
    alt: "A dramatic view of city buildings reaching into the sky",
    src: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "Lines of a city",
    description: "Architecture with room to breathe.",
    category: "Cities",
    alt: "Modern urban architecture viewed from below",
    src: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "After the rain",
    description: "The familiar streets, made new.",
    category: "Cities",
    alt: "City street and buildings glowing in the evening",
    src: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "Somewhere, slowly",
    description: "A winding road and nowhere to be.",
    category: "Travel",
    alt: "A scenic mountain road stretching toward the horizon",
    src: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "A lake to ourselves",
    description: "Still water, big-sky kind of day.",
    category: "Travel",
    alt: "A still alpine lake reflecting mountains and open sky",
    src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=85"
  },
  {
    title: "The long way home",
    description: "A little further is always worth it.",
    category: "Travel",
    alt: "A peaceful mountain lake surrounded by forest",
    src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=900&q=85"
  }
];

const gallery = document.querySelector("#gallery-grid");
const filters = document.querySelector(".filter-list");
const resultsCount = document.querySelector("#results-count");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox.querySelector(".lightbox-image");
const lightboxTitle = lightbox.querySelector("#lightbox-title");
const lightboxCategory = lightbox.querySelector("#lightbox-category");
const lightboxPosition = lightbox.querySelector(".lightbox-position");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");

let activeFilter = "All";
let visibleImages = [...images];
let activeImageIndex = 0;
let previouslyFocusedElement = null;
let lightboxCloseTimer = null;

function renderGallery() {
  visibleImages = activeFilter === "All"
    ? [...images]
    : images.filter((image) => image.category === activeFilter);

  gallery.replaceChildren(...visibleImages.map((image, index) => {
    const card = document.createElement("article");
    card.className = "gallery-card";
    card.style.animationDelay = `${Math.min(index * 35, 210)}ms`;

    const trigger = document.createElement("button");
    trigger.className = "gallery-card__trigger";
    trigger.type = "button";
    trigger.setAttribute("aria-label", `View image: ${image.title}, ${image.category}`);
    trigger.dataset.imageIndex = String(index);

    const img = document.createElement("img");
    img.className = "gallery-card__image";
    img.src = image.src;
    img.alt = image.alt;
    img.loading = "lazy";
    img.decoding = "async";

    const overlay = document.createElement("span");
    overlay.className = "gallery-card__overlay";
    const category = document.createElement("span");
    category.className = "gallery-card__category";
    category.textContent = image.category;
    const title = document.createElement("span");
    title.className = "gallery-card__overlay-title";
    title.textContent = image.title;
    const view = document.createElement("span");
    view.className = "gallery-card__view";
    view.setAttribute("aria-hidden", "true");
    view.textContent = "↗";

    overlay.append(category, title, view);
    trigger.append(img, overlay);

    const details = document.createElement("div");
    details.className = "gallery-card__details";
    const heading = document.createElement("h3");
    heading.className = "gallery-card__title";
    heading.textContent = image.title;
    const description = document.createElement("p");
    description.className = "gallery-card__description";
    description.textContent = image.description;
    details.append(heading, description);
    card.append(trigger, details);
    return card;
  }));

  const count = visibleImages.length;
  resultsCount.textContent = `${count} photograph${count === 1 ? "" : "s"}`;
}

function setFilter(category) {
  activeFilter = category;
  filters.querySelectorAll(".filter-button").forEach((button) => {
    const isSelected = button.dataset.filter === category;
    button.classList.toggle("is-active", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
  renderGallery();
}

function updateLightbox() {
  const image = visibleImages[activeImageIndex];
  if (!image) return;

  lightboxImage.src = image.src.replace("w=900", "w=1800");
  lightboxImage.alt = image.alt;
  lightboxTitle.textContent = image.title;
  lightboxCategory.textContent = image.category;
  lightboxPosition.textContent = `${String(activeImageIndex + 1).padStart(2, "0")} / ${String(visibleImages.length).padStart(2, "0")}`;
}

function openLightbox(index) {
  window.clearTimeout(lightboxCloseTimer);
  activeImageIndex = index;
  previouslyFocusedElement = document.activeElement;
  updateLightbox();
  lightbox.classList.remove("is-closing");
  lightbox.hidden = false;
  document.body.classList.add("is-locked");
  lightbox.querySelector(".lightbox-close").focus();
  window.setTimeout(() => lightbox.classList.add("is-open"), 0);
}

function closeLightbox() {
  if (lightbox.hidden || lightbox.classList.contains("is-closing")) return;
  lightbox.classList.remove("is-open");
  lightbox.classList.add("is-closing");
  lightboxCloseTimer = window.setTimeout(() => {
    lightbox.hidden = true;
    lightbox.classList.remove("is-closing");
    document.body.classList.remove("is-locked");
    lightboxImage.src = "";
    if (previouslyFocusedElement instanceof HTMLElement) previouslyFocusedElement.focus();
  }, 220);
}

function stepLightbox(direction) {
  if (visibleImages.length < 2) return;
  activeImageIndex = (activeImageIndex + direction + visibleImages.length) % visibleImages.length;
  updateLightbox();
}

filters.addEventListener("click", (event) => {
  const button = event.target.closest(".filter-button");
  if (button) setFilter(button.dataset.filter);
});

gallery.addEventListener("click", (event) => {
  const trigger = event.target.closest(".gallery-card__trigger");
  if (trigger) openLightbox(Number(trigger.dataset.imageIndex));
});

lightbox.addEventListener("click", (event) => {
  if (event.target.closest("[data-close]")) closeLightbox();
  if (event.target.closest(".lightbox-arrow--previous")) stepLightbox(-1);
  if (event.target.closest(".lightbox-arrow--next")) stepLightbox(1);
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.hidden) {
    if (lightbox.classList.contains("is-closing")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") stepLightbox(-1);
    if (event.key === "ArrowRight") stepLightbox(1);
    if (event.key === "Tab") {
      const focusableElements = [...lightbox.querySelectorAll("button:not([disabled])")];
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
    return;
  }

  if (event.key === "Escape" && navigation.classList.contains("is-open")) {
    navigation.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    menuToggle.focus();
  }
});

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
  navigation.classList.toggle("is-open", !isOpen);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    navigation.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  }
});

document.querySelector("#current-year").textContent = String(new Date().getFullYear());
renderGallery();
