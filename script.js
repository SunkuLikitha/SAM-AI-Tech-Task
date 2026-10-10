document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".primary-navigation");

  if (menuToggle && navigation) {
    const closeMenu = () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
      navigation.classList.remove("is-open");
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
      navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        closeMenu();
        menuToggle.focus();
      }
    });
  }

  const fallbackImage = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600"><rect width="900" height="600" fill="#e8ece3"/><circle cx="450" cy="260" r="64" fill="#4e684e"/><text x="450" y="281" text-anchor="middle" font-family="Georgia,serif" font-size="58" fill="#ffffff">B</text><text x="450" y="390" text-anchor="middle" font-family="Arial,sans-serif" font-size="30" fill="#435643">BlogSpace</text></svg>'
  )}`;

  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      if (image.dataset.fallbackApplied) return;
      image.dataset.fallbackApplied = "true";
      image.src = fallbackImage;
    });
  });

  const searchInput = document.querySelector("#blog-search");
  const filterButtons = Array.from(document.querySelectorAll(".filter-button"));
  const articleCards = Array.from(document.querySelectorAll("#blog-grid .article-card"));
  const emptyState = document.querySelector("#empty-state");
  const resultsCount = document.querySelector("#results-count");

  if (searchInput && filterButtons.length && articleCards.length && emptyState && resultsCount) {
    let activeCategory = "All";
    const updateArticles = () => {
      const query = searchInput.value.trim().toLocaleLowerCase();
      let visibleCount = 0;

      articleCards.forEach((card) => {
        const matchesCategory = activeCategory === "All" || card.dataset.category === activeCategory;
        const matchesQuery = `${card.querySelector("h3")?.textContent ?? ""} ${card.querySelector(".card-content > p:not(.card-meta):not(.author-line)")?.textContent ?? ""}`.toLocaleLowerCase().includes(query);
        const isVisible = matchesCategory && matchesQuery;
        card.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
      });

      emptyState.hidden = visibleCount !== 0;
      resultsCount.textContent = `Showing ${visibleCount} ${visibleCount === 1 ? "article" : "articles"}`;
    };

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        activeCategory = button.dataset.filter ?? "All";
        filterButtons.forEach((filterButton) => {
          const isActive = filterButton === button;
          filterButton.classList.toggle("is-active", isActive);
          filterButton.setAttribute("aria-pressed", String(isActive));
        });
        updateArticles();
      });
    });

    searchInput.addEventListener("input", updateArticles);

    const clearFilters = document.querySelector("#clear-filters");
    if (clearFilters) {
      clearFilters.addEventListener("click", () => {
        searchInput.value = "";
        activeCategory = "All";
        const allButton = filterButtons.find((button) => button.dataset.filter === "All");
        if (allButton) allButton.click();
        else updateArticles();
        searchInput.focus();
      });
    }

    const requestedCategory = new URLSearchParams(window.location.search).get("category");
    const requestedButton = filterButtons.find((button) => button.dataset.filter === requestedCategory);
    if (requestedButton) requestedButton.click();
    else updateArticles();
  }

  const blogGrid = document.querySelector("#blog-grid");
  const articleDialog = document.querySelector("#article-dialog");
  if (blogGrid && articleDialog instanceof HTMLDialogElement) {
    const closeButton = articleDialog.querySelector(".dialog-close");
    const dialogImage = articleDialog.querySelector(".dialog-image");
    const dialogCategory = articleDialog.querySelector(".dialog-category");
    const dialogMeta = articleDialog.querySelector(".dialog-meta");
    const dialogTitle = articleDialog.querySelector("#dialog-title");
    const dialogDescription = articleDialog.querySelector(".dialog-description");
    const dialogAuthor = articleDialog.querySelector(".dialog-author");

    blogGrid.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest("a[href^='#']");
      const card = link?.closest(".article-card");
      if (!link || !(card instanceof HTMLElement) || link.getAttribute("href") !== `#${card.id}`) return;

      event.preventDefault();
      const image = card.querySelector(".card-image img");
      const category = card.dataset.category;
      const title = card.querySelector("h3")?.textContent?.trim();
      const description = card.querySelector(".card-content > p:not(.card-meta):not(.author-line)")?.textContent?.trim();
      const author = card.querySelector(".author-line")?.textContent?.trim();
      const meta = card.querySelector(".card-meta")?.textContent?.trim();
      if (!image || !category || !title || !description || !author || !meta ||
          !dialogImage || !dialogCategory || !dialogMeta || !dialogTitle || !dialogDescription || !dialogAuthor) return;

      dialogImage.src = image.currentSrc || image.src;
      dialogImage.alt = image.alt;
      dialogCategory.textContent = category;
      dialogMeta.textContent = meta;
      dialogTitle.textContent = title;
      dialogDescription.textContent = description;
      dialogAuthor.textContent = author;
      articleDialog.showModal();
    });

    closeButton?.addEventListener("click", () => articleDialog.close());
    articleDialog.addEventListener("click", (event) => {
      if (event.target === articleDialog) articleDialog.close();
    });
  }

  const contactForm = document.querySelector("#contact-form");
  if (contactForm instanceof HTMLFormElement) {
    const fields = [
      { input: contactForm.elements.namedItem("name"), errorId: "name-error", requiredMessage: "Please enter your name.", invalidMessage: "Please enter at least 2 characters." },
      { input: contactForm.elements.namedItem("email"), errorId: "email-error", requiredMessage: "Please enter your email address.", invalidMessage: "Please enter a valid email address." },
      { input: contactForm.elements.namedItem("subject"), errorId: "subject-error", requiredMessage: "Please enter a subject.", invalidMessage: "Please enter a subject." },
      { input: contactForm.elements.namedItem("message"), errorId: "message-error", requiredMessage: "Please enter a message.", invalidMessage: "Your message must be at least 10 characters." }
    ];
    const feedback = document.querySelector("#contact-feedback");

    const validateField = (field) => {
      const input = field.input;
      const error = document.getElementById(field.errorId);
      if (!(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) || !error) return true;
      let message = "";
      if (!input.value.trim()) message = field.requiredMessage;
      else if (!input.validity.valid) message = field.invalidMessage;
      input.setAttribute("aria-invalid", String(Boolean(message)));
      error.textContent = message;
      return !message;
    };

    fields.forEach((field) => {
      if (field.input instanceof HTMLInputElement || field.input instanceof HTMLTextAreaElement) {
        field.input.addEventListener("blur", () => validateField(field));
        field.input.addEventListener("input", () => {
          if (field.input.hasAttribute("aria-invalid")) validateField(field);
        });
      }
    });

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const isValid = fields.map(validateField).every(Boolean);
      if (!feedback) return;
      if (!isValid) {
        feedback.textContent = "Please correct the highlighted fields and try again.";
        feedback.classList.add("is-error");
        const firstInvalid = fields.find((field) => field.input instanceof HTMLElement && field.input.getAttribute("aria-invalid") === "true");
        if (firstInvalid?.input instanceof HTMLElement) firstInvalid.input.focus();
        return;
      }
      feedback.textContent = "Thanks for your note! This demo has validated your message, but does not send or store it.";
      feedback.classList.remove("is-error");
      contactForm.reset();
      fields.forEach((field) => {
        if (field.input instanceof HTMLInputElement || field.input instanceof HTMLTextAreaElement) {
          field.input.removeAttribute("aria-invalid");
          const error = document.getElementById(field.errorId);
          if (error) error.textContent = "";
        }
      });
    });
  }

  document.querySelectorAll(".newsletter-form").forEach((form) => {
    if (!(form instanceof HTMLFormElement)) return;
    const emailInput = form.querySelector('input[type="email"]');
    const feedback = form.querySelector(".form-feedback");
    if (!(emailInput instanceof HTMLInputElement) || !feedback) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!emailInput.value.trim() || !emailInput.validity.valid) {
        feedback.textContent = emailInput.value.trim() ? "Please enter a valid email address." : "Please enter your email address.";
        feedback.classList.add("is-error");
        emailInput.setAttribute("aria-invalid", "true");
        emailInput.focus();
        return;
      }
      feedback.textContent = "Thanks for subscribing! This demo doesn't add you to a mailing list.";
      feedback.classList.remove("is-error");
      emailInput.removeAttribute("aria-invalid");
      form.reset();
    });
  });
});
