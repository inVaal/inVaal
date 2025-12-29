/* ============================================================
  InVaal [016] — Place News Loader (Reusable)
  File: js/loaders/place-news-loader.js

  Improvements:
  - Optional links (render only if available):
      links.header, links.source, links.guest
  - More space for topic:
      excerpt (short) + content (long, multi-paragraph)
  - Clean output (no inline styles)
  - Safe HTML escaping

  Required HTML IDs:
  - Container: #sasolburg-news-container (or [data-place-news])
  - Select:    #news-category
  - Input:     #search-news

  Configuration via data attributes:
  - data-source="./data/sasolburg-news.json"
  - data-location="Sasolburg"
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const container =
    document.getElementById("sasolburg-news-container") ||
    document.querySelector("[data-place-news]");

  if (!container) return;

  const DATA_URL = container.dataset.source || "./data/sasolburg-news.json";
  const LOCATION_FILTER = (container.dataset.location || "").trim();

  const categorySelect = document.getElementById("news-category");
  const searchInput = document.getElementById("search-news");

  // Status message (loading / empty states)
  let statusEl = document.getElementById("place-news-status");
  if (!statusEl) {
    statusEl = document.createElement("p");
    statusEl.id = "place-news-status";
    statusEl.className = "status-text";
    statusEl.setAttribute("aria-live", "polite");
    container.parentElement?.insertBefore(statusEl, container);
  }

  let allNews = [];

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

  // Build an anchor only if URL is valid (not empty, not "#")
  function renderLink(link, className) {
    if (!link || typeof link !== "object") return "";
    const url = String(link.url ?? "").trim();
    if (!url || url === "#") return "";

    const label = String(link.label ?? "Open link").trim();
    const external = Boolean(link.external);

    return `
      <a class="${className}" href="${escapeHTML(url)}"
         ${external ? 'target="_blank" rel="noopener noreferrer"' : ""}>
        ${escapeHTML(label)}
      </a>
    `;
  }

  // Supports ISO (YYYY-MM-DD) and MM/DD/YYYY safely
  function parseDate(raw) {
    if (!raw) return null;

    const iso = new Date(raw);
    if (!Number.isNaN(iso.getTime())) return iso;

    const m = String(raw).match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!m) return null;

    const [, mm, dd, yyyy] = m;
    const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    return Number.isNaN(d.getTime()) ? null : d;
  }

  function formatDateLabel(raw) {
    const d = parseDate(raw);
    if (!d) return raw ? String(raw) : "Date not specified";

    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function normalizeCategory(value) {
    const v = String(value ?? "local").trim().toLowerCase();
    return v || "local";
  }

  // Accept `content` as a string OR an array of paragraphs
  function normalizeContent(content) {
    if (!content) return [];
    if (Array.isArray(content)) return content.filter(Boolean).map(String);
    return [String(content)];
  }

  function matchesSearch(item, query) {
    if (!query) return true;

    const haystack = [
      item.title,
      item.description,
      item.excerpt,
      ...(normalizeContent(item.content)),
      item.location,
      item.category,
      item.author,
      ...(Array.isArray(item.tags) ? item.tags : []),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query.toLowerCase());
  }

  /* ----------------------------------------------------------
    Rendering
  ---------------------------------------------------------- */
  function buildCard(item, index) {
    const title = item?.title || "No title available";
    const location = item?.location || LOCATION_FILTER || "Vaal Triangle";
    const category = normalizeCategory(item?.category);
    const author = item?.author || "InVaal [016]";
    const dateLabel = formatDateLabel(item?.date);

    // Prefer excerpt/content for “more space”, otherwise fallback to description
    const excerpt = item?.excerpt || "";
    const description = item?.description || "";
    const longContent = normalizeContent(item?.content);

    const hasMedia = Boolean(item?.media?.url);
    const mediaUrl = hasMedia ? String(item.media.url) : "";
    const mediaAlt = item?.media?.alt || title;

    // New preferred links object (fallback to old "source" structure too)
    const links = item?.links || {};
    const fallbackSource = item?.source
      ? { label: item?.source?.label || "Read more", url: item?.source?.url, external: item?.source?.external }
      : null;

    const headerLinkHTML = renderLink(links.header, "news-header-link");
    const guestLinkHTML = renderLink(links.guest, "news-guest-link");
    const sourceLinkHTML = renderLink(links.source || fallbackSource, "news-source");

    const card = document.createElement("article");
    card.className = "news-card";
    if (index === 0) card.classList.add("is-lead");

    // Build long-form paragraphs if provided
    const contentHTML = longContent.length
      ? `
        <div class="news-content">
          ${longContent.map((p) => `<p>${escapeHTML(p)}</p>`).join("")}
        </div>
      `
      : "";

    // Choose preview text: excerpt > description
    const previewText = excerpt || description;

    card.innerHTML = `
      ${hasMedia ? `
        <div class="news-media">
          <img src="${escapeHTML(mediaUrl)}" alt="${escapeHTML(mediaAlt)}" loading="lazy">
        </div>
      ` : ""}

      <div class="news-card-body">
        <div class="news-card-header">
          <span class="news-category">${escapeHTML(category)}</span>
          <time class="news-date">${escapeHTML(dateLabel)}</time>
        </div>

        <div class="news-location">${escapeHTML(location)}</div>

        <h3 class="news-title">
          ${headerLinkHTML ? headerLinkHTML : escapeHTML(title)}
        </h3>

        ${previewText ? `<p class="news-description">${escapeHTML(previewText)}</p>` : ""}

        ${contentHTML}

        <p class="news-meta">
          <span>By ${escapeHTML(author)}</span>
          ${guestLinkHTML ? `<span class="meta-sep">•</span>${guestLinkHTML}` : ""}
        </p>

        ${sourceLinkHTML ? `<div class="news-actions">${sourceLinkHTML}</div>` : ""}
      </div>
    `;

    return card;
  }

  function applyFiltersAndRender() {
    const selectedCategory = categorySelect ? categorySelect.value : "all";
    const query = searchInput ? searchInput.value.trim() : "";

    let filtered = [...allNews];

    // Optional: force only the current location (Sasolburg etc.)
    if (LOCATION_FILTER) {
      filtered = filtered.filter(
        (n) => String(n.location ?? "").trim().toLowerCase() === LOCATION_FILTER.toLowerCase()
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(
        (n) => normalizeCategory(n.category) === selectedCategory.toLowerCase()
      );
    }

    // Search filter
    filtered = filtered.filter((n) => matchesSearch(n, query));

    // Sort newest first (no-date goes last)
    filtered.sort((a, b) => {
      const da = parseDate(a.date);
      const db = parseDate(b.date);
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return db - da;
    });

    // Render
    container.innerHTML = "";

    if (filtered.length === 0) {
      statusEl.textContent = "No matching stories found.";
      return;
    }

    statusEl.textContent = "";
    const fragment = document.createDocumentFragment();
    filtered.forEach((item, i) => fragment.appendChild(buildCard(item, i)));
    container.appendChild(fragment);
  }

  /* ----------------------------------------------------------
    Load JSON
  ---------------------------------------------------------- */
  async function loadPlaceNews() {
    try {
      statusEl.textContent = `Loading ${LOCATION_FILTER || "local"} news...`;
      container.innerHTML = "";

      // Resolve relative URLs safely
      const resolvedURL = new URL(DATA_URL, document.baseURI).toString();

      const res = await fetch(resolvedURL, { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed to load ${DATA_URL} (${res.status})`);

      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        statusEl.textContent = "No news articles available yet. Please check back later.";
        return;
      }

      allNews = data;

      // Hook up controls
      if (categorySelect) categorySelect.addEventListener("change", applyFiltersAndRender);
      if (searchInput) searchInput.addEventListener("input", applyFiltersAndRender);

      applyFiltersAndRender();
    } catch (err) {
      console.error("Place news load error:", err);
      statusEl.textContent = "";
      container.innerHTML = `
        <div class="card" style="padding:16px;">
          <h3 style="margin-bottom:6px;">Unable to load news</h3>
          <p style="color: var(--muted);">Please try again later.</p>
        </div>
      `;
    }
  }

  loadPlaceNews();
});