const searchPanel = document.querySelector("#site-search");
const searchToggle = document.querySelector(".search-toggle");
const searchInput = document.querySelector("#search-input");
const searchResults = document.querySelector("#search-results");
let previouslyFocused = null;

const searchableItems = Array.from(
  document.querySelectorAll(
    ".research-case, .featured-project, .project-card, .skill-grid article, .interest-list li, .award-row, .global-list li, #news"
  )
)
  .map((element) => {
    const heading = element.querySelector("h2, h3, h4, summary h3");
    const label = heading ? heading.textContent.trim() : "";
    const text = element.textContent.replace(/\s+/g, " ").trim();
    return { element, label, text };
  })
  .filter((item) => item.label && item.text.length > 0);

function openSearch() {
  previouslyFocused = document.activeElement;
  searchPanel.hidden = false;
  document.body.classList.add("search-open");
  searchInput.value = "";
  renderSearchResults("");
  requestAnimationFrame(() => searchInput.focus());
}

function closeSearch() {
  searchPanel.hidden = true;
  document.body.classList.remove("search-open");
  if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
}

function makeResult(item) {
  const button = document.createElement("button");
  const title = document.createElement("strong");
  const excerpt = document.createElement("span");
  button.type = "button";
  button.className = "search-result";
  title.textContent = item.label;
  excerpt.textContent = `${item.text.slice(0, 145)}${item.text.length > 145 ? "…" : ""}`;
  button.append(title, excerpt);
  button.addEventListener("click", () => {
    const details = item.element.matches("details") ? item.element : item.element.closest("details");
    if (details) details.open = true;
    closeSearch();
    item.element.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  return button;
}

function renderSearchResults(query) {
  const normalized = query.trim().toLowerCase();
  const featuredLabels = [
    "Synthetic Modality Fusion in Breast Doppler Ultrasound",
    "Image Interceptor",
    "I See You",
    "NotiFi",
    "DiNuri",
    "OpenWallet",
  ];
  const results = (normalized
    ? searchableItems.filter((item) => item.text.toLowerCase().includes(normalized))
    : searchableItems.filter((item) => featuredLabels.includes(item.label))
  ).slice(0, 12);

  searchResults.replaceChildren();
  if (results.length === 0) {
    const empty = document.createElement("p");
    empty.className = "search-empty";
    empty.textContent = "No results found.";
    searchResults.append(empty);
    return;
  }
  results.forEach((item) => searchResults.append(makeResult(item)));
}

searchToggle.addEventListener("click", openSearch);
searchInput.addEventListener("input", (event) => renderSearchResults(event.target.value));
document.querySelectorAll("[data-close-search]").forEach((button) => button.addEventListener("click", closeSearch));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !searchPanel.hidden) closeSearch();
  if (event.key === "Tab" && !searchPanel.hidden) {
    const focusable = Array.from(searchPanel.querySelectorAll("button, input")).filter(
      (element) => !element.disabled && element.offsetParent !== null
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduceMotion && "IntersectionObserver" in window) {
  const revealTargets = document.querySelectorAll(
    ".section-heading, .research-case, .interest-list li, .featured-project, .other-projects > li, .skill-grid article, .award-row, .global-list li, .split-secondary > div"
  );
  revealTargets.forEach((element) => element.classList.add("reveal"));
  document.documentElement.classList.add("reveal-ready");
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px" }
  );
  revealTargets.forEach((element) => revealObserver.observe(element));
}
