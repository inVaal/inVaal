/* ============================================================
  InVaal [016] — News Loader
  File: js/loaders/news-loader.js

  JSON format expected (example):
  {
    "title": "Available Now",
    "date": "04/14/2025", // MM/DD/YYYY OR null
    "source": "sasolburg.html", // internal or external link
    "description": "...",
    "location": "Sasolburg",
    "category": "local",
    "media": { "type": "image|gif", "url": "..." }
  }

  Notes:
  - First item becomes a "lead story" (bigger card)
  - Safe HTML escaping to avoid broken layout
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const NEWS_URL = "data/news.json";

  const newsGrid = document.getElementById("news-container");
  const statusEl = document.getElementById("news-status");

  if (!newsGrid) return;

  /* ----------------------------------------------------------
    Helpers
  ---------------------------------------------------------- */

  const escapeHTML = (value) =>
    String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  // Parse MM/DD/YYYY reliably (avoids locale parsing issues)
  const parseMMDDYYYY = (raw) => {
    if (!raw) return null;

    // Accept "MM/DD/YYYY" (like your sample)
    const match = String(raw).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!match) return null;

    const [, mm, dd, yyyy] = match;
    const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));

    // Guard against invalid dates (e.g., 13/44/2025)
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const formatDateLabel = (raw) => {
    const parsed = parseMMDDYYYY(raw);
    if (!parsed) return raw ? String(raw) : "Date not specified";

    return parsed.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const normalizeCategory = (value) => {
    const v = String(value ?? "Local").trim();
    if (!v) return "Local";
    return v.charAt(0).toUpperCase() + v.slice(1).toLowerCase();
  };

  // Detect external links (open in new tab) vs internal (same tab)
  const isExternalLink = (href) => /^https?:\/\//i.test(String(href ?? ""));

  const createNewsCard = (item, index) => {
    const title = item?.title || "No title available";
    const description = item?.description || "No description available.";
    const location = item?.location || "Vaal Triangle";
    const category = normalizeCategory(item?.category);
    const dateLabel = formatDateLabel(item?.date);

    const mediaUrl = item?.media?.url ? String(item.media.url) : "";
    const hasMedia = Boolean(mediaUrl);

    const source = typeof item?.source === "string" ? item.source.trim() : "";
    const hasSource = source && source !== "#";

    const external = hasSource && isExternalLink(source);

    const card = document.createElement("article");
    card.className = "news-card";
    if (index === 0) card.classList.add("is-lead");

    const mediaHTML = hasMedia
      ? `
        <div class="news-media">
          <img src="${escapeHTML(mediaUrl)}" alt="${escapeHTML(title)}" loading="lazy">
        </div>
      `
      : "";

    const ctaHTML = hasSource
      ? `
        <a
          class="news-source"
          href="${escapeHTML(source)}"
          ${external ? 'target="_blank" rel="noopener noreferrer"' : ""}
        >
          Read more
        </a>
      `
      : "";

    card.innerHTML = `
      ${mediaHTML}

      <div class="news-card-body">
        <div class="news-card-header">
          <span class="news-category">${escapeHTML(category)}</span>
          <time class="news-date">${escapeHTML(dateLabel)}</time>
        </div>

        <div class="news-location">${escapeHTML(location)}</div>
        <h3 class="news-title">${escapeHTML(title)}</h3>
        <p class="news-description">${escapeHTML(description)}</p>

        ${ctaHTML}
      </div>
    `;

    return card;
  };

  /* ----------------------------------------------------------
    Main loader
  ---------------------------------------------------------- */
  async function loadNews() {
    try {
      if (statusEl) statusEl.textContent = "Loading news...";
      newsGrid.innerHTML = "";

      const response = await fetch(NEWS_URL, { cache: "no-store" });
      if (!response.ok) throw new Error(`Fetch failed (${response.status})`);

      const newsData = await response.json();

      if (!Array.isArray(newsData) || newsData.length === 0) {
        if (statusEl) statusEl.textContent = "No news articles available yet. Please check back later.";
        return;
      }

      if (statusEl) statusEl.textContent = "";

      const fragment = document.createDocumentFragment();
      newsData.forEach((item, index) => fragment.appendChild(createNewsCard(item, index)));
      newsGrid.appendChild(fragment);
    } catch (error) {
      console.error("Error loading news:", error);
      if (statusEl) statusEl.textContent = "";

      newsGrid.innerHTML = `
        <div class="card" style="padding:16px;">
          <h3 style="margin-bottom:6px;">Unable to load news</h3>
          <p style="color: var(--muted);">
            We're experiencing technical difficulties. Please check back later.
          </p>
        </div>
      `;
    }
  }

  loadNews();
});