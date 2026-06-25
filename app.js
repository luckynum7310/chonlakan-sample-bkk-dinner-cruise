import { assets } from "./assets.js";
import { content } from "./content.js";

const html = String.raw;
const app = document.querySelector("#app");
const initialLang = new URLSearchParams(location.search).get("lang") === "th" ? "th" : "en";
let lang = initialLang;
let menuOpen = false;
let dropdownOpen = "";
let activeOperatorCategory = "all";
let operatorCategoryMenuOpen = false;
let openOverlaySubmenu = "";
let activeLandmarkIndex = 0;
let landmarkTransitionLocked = false;

const operatorCategoryKeys = ["all", "dinner", "sunset", "modern", "classic", "romantic"];

function text(path) {
  return path.split(".").reduce((value, key) => value?.[key], content[lang]) ?? "";
}

function logo() {
  return html`<div class="logo" aria-label="${text("footer.brand")}"><img src="${assets.logo}" alt="" /></div>`;
}

function sectionHead(title, subtitle = "", action = "") {
  return html`
    <div class="section-head">
      <div>
        <h2>${title}</h2>
        ${subtitle ? `<p>${subtitle}</p>` : ""}
      </div>
      ${action ? `<a class="see-all" href="#">${action} <span aria-hidden="true">→</span></a>` : ""}
    </div>
  `;
}

function arrows(theme = "gray", target = "") {
  const useImageIcons = target === "landmarks";
  const previousDisabled = (target === "landmarks" && activeLandmarkIndex === 0) || target === "operators";
  return html`
    <div class="arrows arrows-${theme}">
      <button type="button" data-carousel-prev="${target}" aria-label="Previous" ${previousDisabled ? "disabled aria-disabled=\"true\"" : ""}>${useImageIcons ? `<img src="${assets.carouselArrowLeft}" alt="" />` : "&lsaquo;"}</button>
      <button type="button" data-carousel-next="${target}" aria-label="Next">${useImageIcons ? `<img src="${assets.carouselArrowRight}" alt="" />` : "&rsaquo;"}</button>
    </div>
  `;
}

function carouselScroll(name, theme = "gray") {
  return html`
    <div class="scroll-row ${theme === "white" ? "dark-scroll" : ""}">
      <span class="carousel-scrollbar" data-carousel-progress="${name}" role="scrollbar" tabindex="0" aria-label="Carousel scrollbar" aria-orientation="horizontal" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></span>
      ${arrows(theme, name)}
    </div>
  `;
}

function nav() {
  const nav = content[lang].nav;
  const categories = content[lang].operators.categories;
  const piers = content[lang].piers.submenu;
  return html`
    <header class="navbar ${menuOpen ? "menu-open" : ""}">
      <button class="menu-button ${menuOpen ? "is-open" : ""}" type="button" aria-label="Menu" aria-expanded="${menuOpen}" data-action="toggle-menu"><span></span><span></span><span></span></button>
      ${logo()}
      <nav class="nav-links" aria-label="Primary">
        <a class="active" href="#">${nav.home}</a>
        <div class="nav-dropdown">
          <button class="nav-dropdown-trigger ${dropdownOpen === "cruises" ? "focused" : ""}" type="button" data-action="toggle-dropdown" data-dropdown="cruises" aria-expanded="${dropdownOpen === "cruises"}">
            <span>${nav.cruises}</span><span class="chevron" aria-hidden="true"></span>
          </button>
          ${dropdownOpen === "cruises" ? html`
            <div class="desktop-dropdown" data-nav-dropdown>
              ${categories.map((item, index) => `<button type="button" data-operator-tab="${operatorCategoryKeys[index]}">${item}</button>`).join("")}
            </div>
          ` : ""}
        </div>
        <div class="nav-dropdown">
          <button class="nav-dropdown-trigger ${dropdownOpen === "piers" ? "focused" : ""}" type="button" data-action="toggle-dropdown" data-dropdown="piers" aria-expanded="${dropdownOpen === "piers"}">
            <span>${nav.piers}</span><span class="chevron" aria-hidden="true"></span>
          </button>
          ${dropdownOpen === "piers" ? html`
            <div class="desktop-dropdown" data-nav-dropdown>
              ${piers.map((item) => `<button type="button">${item}</button>`).join("")}
            </div>
          ` : ""}
        </div>
        <a href="#">${nav.practicalInfo}</a>
        <a href="#">${nav.event}</a>
        <a href="#">${nav.about}</a>
      </nav>
      <div class="nav-actions">
        <button class="language" type="button" data-action="toggle-lang">${content[lang].langLabel}</button>
        <a class="button solid desktop-cta" href="#">${nav.community}</a>
      </div>
      ${menuOpen ? overlayMenu() : ""}
    </header>
  `;
}

function overlayMenu() {
  const nav = content[lang].nav;
  const categories = content[lang].operators.categories;
  return html`
    <div class="overlay-menu" data-overlay-menu>
      <button class="overlay-item selected" type="button" data-action="close-menu">${nav.home}</button>
      <button class="overlay-item has-submenu ${openOverlaySubmenu === "cruises" ? "focused" : ""}" type="button" data-action="toggle-overlay-submenu" data-submenu="cruises">
        <span>${nav.cruises}</span><span class="chevron" aria-hidden="true"></span>
      </button>
      ${openOverlaySubmenu === "cruises" ? html`
        <div class="overlay-submenu">
          ${categories.map((item, index) => `<button type="button" data-operator-tab="${operatorCategoryKeys[index]}">${item}</button>`).join("")}
        </div>
      ` : ""}
      <button class="overlay-item has-submenu ${openOverlaySubmenu === "piers" ? "focused" : ""}" type="button" data-action="toggle-overlay-submenu" data-submenu="piers">
        <span>${nav.piers}</span><span class="chevron" aria-hidden="true"></span>
      </button>
      ${openOverlaySubmenu === "piers" ? html`
        <div class="overlay-submenu">
          ${content[lang].piers.submenu.map((item, index) => `<button class="${index === 0 ? "selected" : ""}" type="button">${item}</button>`).join("")}
        </div>
      ` : ""}
      <button class="overlay-item" type="button" data-action="close-menu">${nav.practicalInfo}</button>
      <button class="overlay-item" type="button" data-action="close-menu">${nav.event}</button>
      <button class="overlay-item" type="button" data-action="close-menu">${nav.about}</button>
      <a class="button solid overlay-cta" href="#">${nav.community}</a>
    </div>
  `;
}

function hero() {
  return html`
    <section class="hero">
      <img class="cover" src="${assets.hero}" alt="" />
      <div class="hero-overlay"></div>
      ${nav()}
      <div class="hero-copy">
        <h1>${text("hero.title")}</h1>
        <p>${text("hero.subtitle")}</p>
      </div>
    </section>
  `;
}

function landmarks() {
  const landmarkItems = content[lang].landmarks.items;
  const active = landmarkItems[activeLandmarkIndex];
  const orderedAssets = assets.landmarkStates.map((item, index) => ({ ...item, index }));
  const previewAssets = orderedAssets.slice(activeLandmarkIndex).concat(orderedAssets.slice(0, activeLandmarkIndex));
  return html`
    <section class="landmarks" data-active-landmark="${activeLandmarkIndex}" tabindex="0" aria-label="${text("landmarks.title")}">
      <img class="cover landmark-bg" src="${assets.landmarkStates[activeLandmarkIndex].bg}" alt="" />
      <div class="landmarks-overlay"></div>
      <div class="landmarks-inner">
        ${sectionHead(text("landmarks.title"), text("landmarks.subtitle"))}
        <div class="landmark-layout">
          <div class="landmark-content">
            <div class="timeline" aria-hidden="true">
              <span class="boat-dot"><img src="${assets.landmarkCatamaran}" alt="" /></span>
              <span class="timeline-dot dot-start"></span>
              ${landmarkItems.map((_, index) => `<span class="timeline-dot dot-${index}"></span>`).join("")}
            </div>
            <div class="landmark-copy">
              <h3 data-landmark-title>${active.title}</h3>
              <p data-landmark-description>${active.description}</p>
              <a class="button glass" href="#">${text("landmarks.cta")}</a>
            </div>
          </div>
          <div class="landmark-gallery" data-carousel="landmarks">
            ${previewAssets.map((item, position) => `<button class="landmark-card ${position === 0 ? "is-active" : ""} ${position === 1 ? "is-preview-next" : ""}" type="button" data-landmark-index="${item.index}" aria-label="${landmarkItems[item.index].title}" aria-current="${position === 0 ? "true" : "false"}" aria-disabled="${position === 1 ? "false" : "true"}" tabindex="${position === 1 ? "0" : "-1"}"><img src="${item.image}" alt="" /></button>`).join("")}
          </div>
        </div>
        ${arrows("white", "landmarks")}
      </div>
    </section>
  `;
}

function cruiseCard(card, index) {
  const labels = content[lang].operators.labels;
  const categoryIndex = operatorCategoryKeys.indexOf(card.category);
  const categoryLabel = content[lang].operators.categories[categoryIndex] || labels.dinner;
  const foods = card.foods || labels.foods || [];
  const src = assets.cruiseCards[index % assets.cruiseCards.length];
  return html`
    <a class="cruise-card" href="#" data-category="${card.category}">
      <img src="${src}" alt="" />
      <span class="badge category-badge">${categoryLabel}</span>
      <div class="card-shade"></div>
      <div class="cruise-card-body">
        <div class="rating-row"><span aria-hidden="true"></span>${card.rating || labels.rating}</div>
        <h3>${card.title}</h3>
        <span class="card-divider" aria-hidden="true"></span>
        <div class="spec-row">
          <span><strong>${labels.price}</strong>${card.price}</span>
          <span><strong>${labels.decks}</strong>${card.decks || labels.levels}</span>
        </div>
        <div class="chip-row">${foods.map((food) => `<span class="badge neutral-badge">${food}</span>`).join("")}</div>
        <span class="card-hover-cta">${labels.cta || "View details"}</span>
      </div>
    </a>
  `;
}

function operators() {
  const cards = content[lang].operators.cards;
  const visibleCards = activeOperatorCategory === "all" ? cards : cards.filter((card) => card.category === activeOperatorCategory);
  return html`
    <section class="section operators">
      ${sectionHead(text("operators.title"), "", text("operators.seeAll"))}
      <div class="operator-category">
        <div class="tabs">${content[lang].operators.categories.map((item, index) => {
          const key = operatorCategoryKeys[index];
          return `<button class="${activeOperatorCategory === key ? "active" : ""}" type="button" data-operator-tab="${key}">${item}</button>`;
        }).join("")}</div>
        <button class="category-menu-button ${operatorCategoryMenuOpen ? "focused" : ""}" type="button" data-action="toggle-operator-category-menu" aria-label="Filter categories" aria-expanded="${operatorCategoryMenuOpen}">
          <span></span><span></span><span></span>
        </button>
        ${operatorCategoryMenuOpen ? html`
          <div class="desktop-dropdown operator-category-dropdown" data-operator-category-dropdown>
            ${content[lang].operators.categories.map((item, index) => `<button class="${activeOperatorCategory === operatorCategoryKeys[index] ? "selected" : ""}" type="button" data-operator-tab="${operatorCategoryKeys[index]}">${item}</button>`).join("")}
          </div>
        ` : ""}
      </div>
      <div class="horizontal-cards" data-carousel="operators">${visibleCards.length ? visibleCards.map(cruiseCard).join("") : `<div class="empty-state">Missing content token</div>`}</div>
      ${carouselScroll("operators")}
    </section>
  `;
}

function culinary() {
  return html`
    <section class="section culinary">
      <div class="menu-collage" aria-hidden="true">
        ${assets.culinaryMenu.map((images, index) => html`
          <div class="menu-photo menu-photo-${index + 1}">
            ${images.map((src) => `<img src="${src}" alt="" />`).join("")}
          </div>
        `).join("")}
      </div>
      <div class="culinary-copy">
        ${sectionHead(text("culinary.title"), text("culinary.subtitle"))}
        <div class="feature-list">
          ${content[lang].culinary.items.map(([title, desc]) => html`
            <article>
              <span class="feature-icon"><img src="${assets.culinaryIcon}" alt="" /></span>
              <div><h3>${title}</h3><p>${desc}</p></div>
              <span class="feature-arrow"><img src="${assets.culinaryArrow}" alt="" /></span>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function piers() {
  const pierImages = content[lang].piers.cards.map((name, index) => ({ name, src: assets.piers[index % assets.piers.length] }));
  return html`
    <section class="section piers">
      ${sectionHead(text("piers.title"), "", text("piers.seeAll"))}
      <div class="horizontal-cards" data-carousel="piers">
        ${pierImages.map(({ name, src }) => html`
          <article class="pier-card">
            <img src="${src}" alt="" />
            <div><strong>${name}</strong><span>${text("piers.hours")}</span></div>
          </article>
        `).join("")}
      </div>
      ${carouselScroll("piers")}
    </section>
  `;
}

function blogs() {
  const blogCards = content[lang].blogs.cards ?? content.en.blogs.cards;
  return html`
    <section class="section dark experience-section blogs-section">
      ${sectionHead(text("blogs.title"), text("blogs.subtitle"), text("blogs.seeAll"))}
      <div class="horizontal-cards" data-carousel="blogs">
        ${blogCards.map((card, index) => html`
          <article class="blog-card" tabindex="0">
            <div class="blog-media">
              <img src="${assets.blogs[index % assets.blogs.length]}" alt="" />
              <span class="media-count"><img src="${assets.blogImageCount}" alt="" />${card.imageCount}</span>
            </div>
            <div class="blog-body">
              <h3>${card.title}</h3>
              <p>${card.description}</p>
              <a href="#">${text("blogs.readMore")}</a>
              <div class="blog-meta">
                <span class="blog-author"><img src="${assets.guests[index % assets.guests.length]}" alt="" />${card.author}</span>
                <span>${card.date}</span>
              </div>
              <a class="blog-cruise" href="#">${card.cruise}</a>
            </div>
          </article>
        `).join("")}
      </div>
      ${carouselScroll("blogs", "white")}
    </section>
  `;
}

function reviewsLegacy() {
  return html`
    <section class="section dark reviews">
      ${sectionHead(text("reviews.title"), text("reviews.subtitle"), text("reviews.seeAll"))}
      <div class="horizontal-cards" data-carousel="reviews">
        ${[0, 1].map((item) => html`
          <article class="review-card">
            <div class="review-top">
              <img src="${assets.guests[item]}" alt="" />
              <span>★★★★★</span>
            </div>
            <p data-missing-token="review-body">Missing content token</p>
            <div class="review-gallery">${assets.reviewGallery.map((src) => `<img src="${src}" alt="" />`).join("")}</div>
            <div class="review-meta"><span>${text("reviews.verified")}</span><span>${text("reviews.date")}</span></div>
          </article>
        `).join("")}
      </div>
      ${carouselScroll("reviews", "white")}
    </section>
  `;
}

function reviews() {
  const reviewCards = content[lang].reviews.cards ?? content.en.reviews.cards;
  const gallery = [...assets.reviewGallery, assets.blogs[0]];
  return html`
    <section class="section dark experience-section reviews">
      ${sectionHead(text("reviews.title"), text("reviews.subtitle"), text("reviews.seeAll"))}
      <div class="horizontal-cards" data-carousel="reviews">
        ${reviewCards.map((card, index) => html`
          <article class="review-card" tabindex="0">
            <img class="review-avatar" src="${assets.guests[index % assets.guests.length]}" alt="" />
            <div class="review-top">
              <strong>${card.name}</strong>
              <span class="review-rating">${Array.from({ length: 5 }, () => `<img src="${assets.reviewStar}" alt="" />`).join("")}</span>
            </div>
            <div class="review-copy">
              <p>${card.description}</p>
              <a href="#">${text("reviews.readMore") || text("blogs.readMore")}</a>
            </div>
            <div class="review-gallery">
              ${gallery.map((src, galleryIndex) => html`
                <span class="review-image">
                  <img src="${src}" alt="" />
                  ${galleryIndex === gallery.length - 1 ? `<span class="media-count"><img src="${assets.blogImageCount}" alt="" />${card.imageCount}</span>` : ""}
                </span>
              `).join("")}
            </div>
            <div class="review-meta">
              <span class="verified"><img src="${assets.reviewVerified}" alt="" />${card.verified}</span>
              <span>${card.date}</span>
            </div>
          </article>
        `).join("")}
      </div>
      ${carouselScroll("reviews", "white")}
    </section>
  `;
}

function seo() {
  return html`
    <section class="section seo">
      <h2>${text("seo.title")}</h2>
      ${content[lang].seo.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
    </section>
  `;
}

function footer() {
  const nav = content[lang].nav;
  const foot = content[lang].footer;
  return html`
    <footer class="footer">
      <div class="footer-main">
        <div>${logo()}<p>${foot.tagline}</p></div>
        <div><strong>${foot.brand}</strong><a>${nav.cruises}</a><a>${nav.piers}</a><a>${nav.practicalInfo}</a></div>
        <div><a>${nav.event}</a><a>${nav.community}</a><a>${nav.about}</a></div>
      </div>
      <div class="footer-bottom">
        <span>${foot.copyright}</span>
        <nav><a>${foot.contact}</a><a>${foot.privacy}</a><a>${foot.terms}</a><a>${foot.cookies}</a></nav>
      </div>
    </footer>
  `;
}

function render() {
  document.documentElement.dataset.lang = lang;
  document.documentElement.lang = lang;
  app.innerHTML = [hero(), landmarks(), operators(), culinary(), piers(), blogs(), reviews(), seo(), footer()].join("");
  applyImageFallbacks();
  initInteractions();
  syncOperatorCategoryDropdown();
}

function applyImageFallbacks() {
  if (!document.querySelectorAll) return;
  document.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      image.removeAttribute("src");
      image.classList.add("asset-missing");
    }, { once: true });
  });
}

function initInteractions() {
  document.querySelector('[data-action="toggle-lang"]')?.addEventListener("click", () => {
    lang = lang === "en" ? "th" : "en";
    operatorCategoryMenuOpen = false;
    render();
  });

  document.querySelector('[data-action="toggle-menu"]')?.addEventListener("click", () => {
    menuOpen = !menuOpen;
    if (!menuOpen) openOverlaySubmenu = "";
    render();
  });

  document.querySelectorAll('[data-action="close-menu"]').forEach((item) => {
    item.addEventListener("click", () => {
      menuOpen = false;
      openOverlaySubmenu = "";
      render();
    });
  });

  document.querySelectorAll('[data-action="toggle-dropdown"]').forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const name = event.currentTarget.dataset.dropdown || "";
      dropdownOpen = dropdownOpen === name ? "" : name;
      render();
    });
  });

  document.querySelectorAll('[data-action="toggle-overlay-submenu"]').forEach((item) => {
    item.addEventListener("click", () => {
      openOverlaySubmenu = openOverlaySubmenu === item.dataset.submenu ? "" : item.dataset.submenu;
      render();
    });
  });

  document.querySelector('[data-action="toggle-operator-category-menu"]')?.addEventListener("click", (event) => {
    event.stopPropagation();
    operatorCategoryMenuOpen = !operatorCategoryMenuOpen;
    render();
  });

  document.querySelectorAll("[data-operator-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      activeOperatorCategory = button.dataset.operatorTab || "all";
      dropdownOpen = "";
      operatorCategoryMenuOpen = false;
      render();
    });
  });

  document.querySelectorAll("[data-landmark-index]").forEach((button) => {
    button.addEventListener("click", () => {
      const itemCount = content[lang].landmarks.items.length;
      const nextIndex = (activeLandmarkIndex + 1) % itemCount;
      const selectedIndex = Number(button.dataset.landmarkIndex || 0);
      if (selectedIndex !== nextIndex) return;
      activateLandmark(nextIndex);
    });
  });

  const landmarkSection = document.querySelector(".landmarks");
  landmarkSection?.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      if (activeLandmarkIndex === 0) return;
      event.preventDefault();
      activateLandmark(activeLandmarkIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      activateLandmark(activeLandmarkIndex + 1);
    }
  });

  document.querySelectorAll("[data-carousel-prev],[data-carousel-next]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.carouselPrev || button.dataset.carouselNext;
      if (target === "landmarks") {
        activateLandmark(activeLandmarkIndex + (button.dataset.carouselNext ? 1 : -1));
        return;
      }
      moveCarousel(target, Boolean(button.dataset.carouselNext));
    });
  });

  document.querySelectorAll("[data-carousel]").forEach((track) => {
    track.addEventListener("scroll", () => updateCarouselProgress(track.dataset.carousel), { passive: true });
    if (track.dataset.carousel !== "landmarks") initDragScroll(track);
    updateCarouselProgress(track.dataset.carousel);
  });

  document.querySelectorAll("[data-carousel-progress]").forEach((scrollbar) => {
    initCarouselScrollbar(scrollbar);
  });
}

function syncOperatorCategoryDropdown() {
  const dropdown = document.querySelector("[data-operator-category-dropdown]");
  const tabs = document.querySelector(".operators .tabs");
  if (!dropdown || !tabs) return;

  const tabsRect = tabs.getBoundingClientRect();
  const hiddenKeys = new Set();
  tabs.querySelectorAll("[data-operator-tab]").forEach((button) => {
    const rect = button.getBoundingClientRect();
    const isFullyVisible = rect.left >= tabsRect.left && rect.right <= tabsRect.right;
    if (!isFullyVisible) hiddenKeys.add(button.dataset.operatorTab || "");
  });

  dropdown.querySelectorAll("[data-operator-tab]").forEach((button) => {
    const shouldShow = hiddenKeys.has(button.dataset.operatorTab || "");
    button.hidden = !shouldShow;
  });

  if (!hiddenKeys.size) {
    operatorCategoryMenuOpen = false;
    window.setTimeout(render, 0);
  }
}

function initDragScroll(track) {
  let isDown = false;
  let startX = 0;
  let startLeft = 0;
  let moved = false;
  let lastDelta = 0;
  let activePointerId = null;

  const startDrag = (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    isDown = true;
    moved = false;
    lastDelta = 0;
    startX = event.clientX;
    startLeft = track.scrollLeft;
    activePointerId = event.pointerId ?? null;
    track.classList.add("is-dragging");
    if (event.pointerId !== undefined) track.setPointerCapture?.(event.pointerId);
  };

  const moveDrag = (event) => {
    if (!isDown) return;
    const delta = event.clientX - startX;
    lastDelta = delta;
    if (Math.abs(delta) > 3) {
      moved = true;
      event.preventDefault();
    }
    if (track.dataset.carousel === "landmarks") {
      track.style.setProperty("--landmark-drag-offset", `${delta}px`);
    } else {
      track.scrollLeft = startLeft - delta;
    }
  };

  const endDrag = (event) => {
    if (!isDown) return;
    isDown = false;
    track.classList.remove("is-dragging");
    track.style.removeProperty("--landmark-drag-offset");
    if (event?.pointerId !== undefined) track.releasePointerCapture?.(event.pointerId);
    if (moved) {
      track.dataset.justDragged = "true";
      if (track.dataset.carousel === "landmarks") {
        activateLandmark(activeLandmarkIndex + (lastDelta < 0 ? 1 : -1));
      }
      window.setTimeout(() => delete track.dataset.justDragged, 120);
    }
    activePointerId = null;
  };

  track.addEventListener("click", (event) => {
    if (track.dataset.justDragged !== "true") return;
    event.preventDefault();
    event.stopPropagation();
  }, true);

  track.addEventListener("pointerdown", startDrag);
  track.addEventListener("pointermove", moveDrag);
  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);
  track.addEventListener("pointerleave", endDrag);

  track.addEventListener("mousedown", (event) => {
    if (window.PointerEvent || isDown) return;
    startDrag(event);
  });
  window.addEventListener("mousemove", (event) => {
    if (window.PointerEvent || !isDown || activePointerId !== null) return;
    moveDrag(event);
  });
  window.addEventListener("mouseup", (event) => {
    if (window.PointerEvent || activePointerId !== null) return;
    endDrag(event);
  });
}

function initCarouselScrollbar(scrollbar) {
  const name = scrollbar.dataset.carouselProgress;
  const track = document.querySelector(`[data-carousel="${name}"]`);
  if (!track) return;

  let dragging = false;
  let dragOffset = 0;
  let lastPointerStart = 0;

  const getThumbMetrics = () => {
    const rect = scrollbar.getBoundingClientRect();
    const thumbWidth = Number(scrollbar.style.getPropertyValue("--thumb-width").replace("px", "")) || rect.width;
    const thumbLeft = Number(scrollbar.style.getPropertyValue("--thumb-left").replace("px", "")) || 0;
    return { rect, thumbWidth, thumbLeft };
  };

  const setScrollFromThumb = (left, behavior = "auto") => {
    const { rect, thumbWidth } = getThumbMetrics();
    const maxThumbLeft = Math.max(0, rect.width - thumbWidth);
    const clampedLeft = Math.max(0, Math.min(maxThumbLeft, left));
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    const ratio = maxThumbLeft ? clampedLeft / maxThumbLeft : 0;
    track.scrollTo({ left: ratio * maxScroll, behavior });
    updateCarouselProgress(name);
  };

  const startDrag = (clientX, event, usesPointerCapture = false) => {
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    if (!maxScroll) return;
    event.preventDefault();
    const { rect, thumbWidth, thumbLeft } = getThumbMetrics();
    const pointerX = clientX - rect.left;
    const pointerOnThumb = pointerX >= thumbLeft && pointerX <= thumbLeft + thumbWidth;
    dragging = true;
    dragOffset = pointerOnThumb ? pointerX - thumbLeft : thumbWidth / 2;
    if (usesPointerCapture) scrollbar.setPointerCapture?.(event.pointerId);
    scrollbar.classList.add("is-dragging");
    setScrollFromThumb(pointerX - dragOffset, pointerOnThumb ? "auto" : "smooth");
  };

  const moveDrag = (clientX) => {
    if (!dragging) return;
    const { rect } = getThumbMetrics();
    setScrollFromThumb(clientX - rect.left - dragOffset);
  };

  const stopDragging = (event) => {
    if (!dragging) return;
    dragging = false;
    scrollbar.classList.remove("is-dragging");
    scrollbar.releasePointerCapture?.(event.pointerId);
  };

  scrollbar.addEventListener("pointerdown", (event) => {
    lastPointerStart = Date.now();
    startDrag(event.clientX, event, true);
  });

  scrollbar.addEventListener("pointermove", (event) => {
    moveDrag(event.clientX);
  });

  scrollbar.addEventListener("pointerup", stopDragging);
  scrollbar.addEventListener("pointercancel", stopDragging);
  scrollbar.addEventListener("mousedown", (event) => {
    if (Date.now() - lastPointerStart < 500 || event.button !== 0) return;
    startDrag(event.clientX, event);
  });
  scrollbar.addEventListener("click", (event) => {
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    if (!maxScroll) return;
    const { rect, thumbWidth, thumbLeft } = getThumbMetrics();
    const pointerX = event.clientX - rect.left;
    const pointerOnThumb = pointerX >= thumbLeft && pointerX <= thumbLeft + thumbWidth;
    if (pointerOnThumb) return;
    setScrollFromThumb(pointerX - thumbWidth / 2, "smooth");
  });
  window.addEventListener("mousemove", (event) => moveDrag(event.clientX));
  window.addEventListener("mouseup", stopDragging);
  scrollbar.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveCarousel(name, false);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveCarousel(name, true);
    }
    if (event.key === "Home") {
      event.preventDefault();
      track.scrollTo({ left: 0, behavior: "smooth" });
      window.setTimeout(() => updateCarouselProgress(name), 300);
    }
    if (event.key === "End") {
      event.preventDefault();
      track.scrollTo({ left: track.scrollWidth - track.clientWidth, behavior: "smooth" });
      window.setTimeout(() => updateCarouselProgress(name), 300);
    }
  });
}

function activateLandmark(index) {
  const itemCount = content[lang].landmarks.items.length;
  if (index < 0) return;
  const nextIndex = index >= itemCount ? 0 : index;
  if (nextIndex === activeLandmarkIndex || landmarkTransitionLocked) return;

  const section = document.querySelector(".landmarks");
  const gallery = section?.querySelector('[data-carousel="landmarks"]');
  if (!section || !gallery) {
    activeLandmarkIndex = nextIndex;
    render();
    return;
  }

  section.scrollLeft = 0;
  landmarkTransitionLocked = true;
  section.classList.add("is-changing");

  const buttons = Array.from(gallery.querySelectorAll("[data-landmark-index]"));
  const outgoingButton = buttons.find((button) => Number(button.dataset.landmarkIndex) === activeLandmarkIndex);
  const incomingButton = buttons.find((button) => Number(button.dataset.landmarkIndex) === nextIndex);
  const loopsForward = activeLandmarkIndex === itemCount - 1 && nextIndex === 0;
  const direction = nextIndex > activeLandmarkIndex || loopsForward ? "next" : "previous";
  const firstRects = new Map(buttons.map((button) => [button, button.getBoundingClientRect()]));
  const orderedIndexes = Array.from({ length: itemCount }, (_, offset) => (nextIndex + offset) % itemCount);

  orderedIndexes.forEach((orderedIndex, position) => {
    const button = buttons.find((item) => Number(item.dataset.landmarkIndex) === orderedIndex);
    if (!button) return;
    const isActive = position === 0;
    const isNext = position === 1;
    button.classList.toggle("is-active", isActive);
    button.classList.toggle("is-preview-next", isNext);
    button.setAttribute("aria-current", String(isActive));
    button.setAttribute("aria-disabled", String(!isNext));
    button.tabIndex = isNext ? 0 : -1;
    gallery.appendChild(button);
  });

  if (outgoingButton) {
    outgoingButton.classList.add(direction === "next" ? "is-exiting-next" : "is-exiting-previous");
  }

  buttons.forEach((button) => {
    const first = firstRects.get(button);
    const last = button.getBoundingClientRect();
    if (!first) return;
    button.style.transition = "none";
    if (button === outgoingButton) {
      button.style.opacity = "0";
      return;
    }
    button.style.flexBasis = `${first.width}px`;
    button.style.height = `${first.height}px`;
    if (button === incomingButton && direction === "previous") {
      button.style.opacity = "0";
      button.style.transform = "translate(-32px, 0)";
      return;
    }
    button.style.transform = `translate(${first.left - last.left}px, ${first.top - last.top}px)`;
  });

  gallery.getBoundingClientRect();
  window.setTimeout(() => {
    buttons.forEach((button) => {
      button.style.removeProperty("transition");
      if (button === outgoingButton) {
        return;
      }
      button.style.removeProperty("flex-basis");
      button.style.removeProperty("height");
      button.style.removeProperty("transform");
      button.style.removeProperty("opacity");
    });
  }, 16);

  section.dataset.activeLandmark = String(nextIndex);
  const previousButton = section.querySelector('[data-carousel-prev="landmarks"]');
  if (previousButton) {
    previousButton.disabled = nextIndex === 0;
    previousButton.setAttribute("aria-disabled", String(nextIndex === 0));
  }

  window.setTimeout(() => {
    activeLandmarkIndex = nextIndex;
    const activeContent = content[lang].landmarks.items[nextIndex];
    const background = section.querySelector(".landmark-bg");
    const title = section.querySelector("[data-landmark-title]");
    const description = section.querySelector("[data-landmark-description]");

    if (background) background.src = assets.landmarkStates[nextIndex].bg;
    if (title) title.textContent = activeContent.title;
    if (description) description.textContent = activeContent.description;

    gallery.scrollLeft = 0;
    section.scrollLeft = 0;
  }, 250);

  window.setTimeout(() => {
    section.classList.remove("is-changing");
    buttons.forEach((button) => {
      button.classList.remove("is-exiting-next", "is-exiting-previous");
      button.style.removeProperty("transition");
      button.style.removeProperty("flex-basis");
      button.style.removeProperty("height");
      button.style.removeProperty("transform");
      button.style.removeProperty("opacity");
    });
    landmarkTransitionLocked = false;
  }, 500);
}

function moveCarousel(name, forward) {
  const track = document.querySelector(`[data-carousel="${name}"]`);
  if (!track) return;
  const firstItem = track.children[0];
  const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 24;
  const step = firstItem ? firstItem.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
  const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
  const atEnd = track.scrollLeft >= maxScroll - 4;
  const atStart = track.scrollLeft <= 4;
  const nextLeft = name === "operators"
    ? (forward ? Math.min(maxScroll, track.scrollLeft + step) : Math.max(0, track.scrollLeft - step))
    : (forward ? (atEnd ? 0 : Math.min(maxScroll, track.scrollLeft + step)) : (atStart ? maxScroll : Math.max(0, track.scrollLeft - step)));
  track.scrollTo({ left: nextLeft, behavior: "smooth" });
  window.setTimeout(() => updateCarouselProgress(name), 300);
}

function updateCarouselProgress(name) {
  const track = document.querySelector(`[data-carousel="${name}"]`);
  const progress = document.querySelector(`[data-carousel-progress="${name}"]`);
  if (!track || !progress) return;
  const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
  const ratio = maxScroll ? track.scrollLeft / maxScroll : 0;
  const progressWidth = progress.clientWidth;
  const visibleRatio = track.scrollWidth ? track.clientWidth / track.scrollWidth : 1;
  const thumbWidth = maxScroll ? Math.max(80, Math.round(progressWidth * visibleRatio)) : progressWidth;
  const maxThumbLeft = Math.max(0, progressWidth - thumbWidth);
  const thumbLeft = Math.round(maxThumbLeft * ratio);
  progress.style.setProperty("--thumb-width", `${thumbWidth}px`);
  progress.style.setProperty("--thumb-left", `${thumbLeft}px`);
  progress.setAttribute("aria-valuenow", String(Math.round(ratio * 100)));
  progress.dataset.scrollable = String(maxScroll > 0);
  if (name === "operators") {
    const prev = document.querySelector('[data-carousel-prev="operators"]');
    const next = document.querySelector('[data-carousel-next="operators"]');
    const atStart = track.scrollLeft <= 4;
    const atEnd = track.scrollLeft >= maxScroll - 4;
    if (prev) {
      prev.disabled = atStart;
      prev.setAttribute("aria-disabled", String(atStart));
    }
    if (next) {
      next.disabled = maxScroll <= 0 || atEnd;
      next.setAttribute("aria-disabled", String(maxScroll <= 0 || atEnd));
    }
  }
}

document.addEventListener("click", (event) => {
  let shouldRender = false;
  if (dropdownOpen && !event.target.closest(".desktop-dropdown") && !event.target.closest('[data-action="toggle-dropdown"]')) {
    dropdownOpen = "";
    shouldRender = true;
  }
  if (operatorCategoryMenuOpen && !event.target.closest("[data-operator-category-dropdown]") && !event.target.closest('[data-action="toggle-operator-category-menu"]')) {
    operatorCategoryMenuOpen = false;
    shouldRender = true;
  }
  if (shouldRender) render();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!menuOpen && !dropdownOpen && !operatorCategoryMenuOpen) return;
  menuOpen = false;
  dropdownOpen = "";
  operatorCategoryMenuOpen = false;
  openOverlaySubmenu = "";
  render();
});

render();
