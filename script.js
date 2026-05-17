const searchPanel = document.querySelector("#site-search");
const searchToggle = document.querySelector(".search-toggle");
const searchInput = document.querySelector("#search-input");
const searchResults = document.querySelector("#search-results");
const emailLink = document.querySelector(".email-link");

if (emailLink) {
  const address = `${emailLink.dataset.user}@${emailLink.dataset.domain}`;
  emailLink.href = `mailto:${address}`;
}

const searchableItems = Array.from(
  document.querySelectorAll("section, .project-card, .research-item, .award-row, .global-list li")
)
  .map((element) => {
    const heading =
      element.querySelector("h2, h3, summary h3, strong") ||
      (element.matches("section") ? element.querySelector("h2") : null);
    const label = heading ? heading.textContent.trim() : "";
    const text = element.textContent.replace(/\s+/g, " ").trim();
    return { element, label, text };
  })
  .filter((item) => item.label && item.text.length > 0);

function openSearch() {
  searchPanel.hidden = false;
  document.body.classList.add("search-open");
  searchInput.value = "";
  renderSearchResults("");
  requestAnimationFrame(() => searchInput.focus());
}

function closeSearch() {
  searchPanel.hidden = true;
  document.body.classList.remove("search-open");
  searchToggle.focus();
}

function renderSearchResults(query) {
  const normalized = query.trim().toLowerCase();
  const results = (normalized
    ? searchableItems.filter((item) => item.text.toLowerCase().includes(normalized))
    : searchableItems.filter((item) =>
        ["News", "Research", "Projects", "Skills", "Future Research Interests", "Awards and Honors"].includes(
          item.label
        )
      )
  ).slice(0, 10);

  searchResults.innerHTML = "";

  if (results.length === 0) {
    const empty = document.createElement("p");
    empty.className = "search-empty";
    empty.textContent = "No results found.";
    searchResults.append(empty);
    return;
  }

  results.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "search-result";
    button.innerHTML = `<strong>${item.label}</strong><span>${item.text.slice(0, 130)}${
      item.text.length > 130 ? "..." : ""
    }</span>`;
    button.addEventListener("click", () => {
      const details = item.element.closest("details");
      if (details) details.open = true;
      closeSearch();
      item.element.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    searchResults.append(button);
  });
}

searchToggle.addEventListener("click", openSearch);
searchInput.addEventListener("input", (event) => renderSearchResults(event.target.value));

document.querySelectorAll("[data-close-search]").forEach((button) => {
  button.addEventListener("click", closeSearch);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !searchPanel.hidden) {
    closeSearch();
  }
});
