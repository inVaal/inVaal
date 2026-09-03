/**
 * InVaal [016] — Opportunity Loader
 *
 * Loads opportunities from:
 * ../data/opportunities.json
 *
 * Responsibilities:
 * - Load the external JSON database
 * - Build the category filter
 * - Search opportunities
 * - Filter by category
 * - Render opportunity cards
 * - Safely handle external URLs
 * - Escape JSON content before inserting it into HTML
 */

"use strict";


/* =========================================================
   GLOBAL DATA
   ========================================================= */

let opportunities = [];


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const container =
  document.getElementById("opportunities");

const searchInput =
  document.getElementById("searchInput");

const categoryFilter =
  document.getElementById("categoryFilter");

const resultCount =
  document.getElementById("resultCount");


/* =========================================================
   INITIALISE
   ========================================================= */

/*
 * Make sure the required HTML elements exist
 * before attempting to use them.
 */

if (
  !container ||
  !searchInput ||
  !categoryFilter ||
  !resultCount
) {
  console.error(
    "Opportunity loader: Required HTML elements are missing."
  );
}


/* =========================================================
   LOAD OPPORTUNITY DATABASE
   ========================================================= */

/*
 * The HTML stays separate from the data.
 *
 * This means opportunities.json can be updated
 * without rebuilding opportunities.html.
 */

fetch("../data/opportunities.json")

  .then(response => {

    if (!response.ok) {
      throw new Error(
        `Database unavailable (${response.status})`
      );
    }

    return response.json();
  })

  .then(data => {

    /*
     * Only accept an array.
     */

    opportunities =
      Array.isArray(data.opportunities)
        ? data.opportunities
        : [];

    /*
     * Build the category dropdown.
     */

    buildCategories();

    /*
     * Display the opportunities.
     */

    render();
  })

  .catch(error => {

    console.error(
      "Opportunity loader error:",
      error
    );

    container.innerHTML = `
      <div class="empty error-state">

        <strong>
          Unable to load the opportunities database.
        </strong>

        <p>
          Please try again later.
        </p>

      </div>
    `;

    resultCount.textContent =
      "Opportunities unavailable";
  });


/* =========================================================
   BUILD CATEGORY FILTER
   ========================================================= */

/*
 * Automatically creates the category dropdown
 * from the categories found in opportunities.json.
 */

function buildCategories() {

  /*
   * Remove existing categories first.
   *
   * This prevents duplicates if the function
   * is ever called again.
   */

  categoryFilter.innerHTML = `
    <option value="all">
      All categories
    </option>
  `;


  /*
   * Extract categories.
   */

  const categories = [

    ...new Set(

      opportunities

        .map(item => item.category)

        .filter(Boolean)

    )

  ].sort(
    (a, b) =>
      String(a).localeCompare(String(b))
  );


  /*
   * Add each category to the dropdown.
   */

  categories.forEach(category => {

    const option =
      document.createElement("option");

    option.value = category;

    option.textContent = category;

    categoryFilter.appendChild(option);
  });
}


/* =========================================================
   FILTER + RENDER
   ========================================================= */

/*
 * Filters opportunities based on:
 *
 * - Search text
 * - Selected category
 */

function render() {

  const query =
    searchInput.value
      .trim()
      .toLowerCase();

  const category =
    categoryFilter.value;


  /*
   * Filter the database.
   */

  const filtered =
    opportunities.filter(item => {

      /*
       * Create one searchable text string
       * containing the important fields.
       */

      const searchable = [

        item.title,

        item.organisation,

        item.category,

        item.audience,

        item.description,

        item.location,

        item.deadline,

        item.type,

        ...(item.tags || [])

      ]

        .filter(Boolean)

        .join(" ")

        .toLowerCase();


      /*
       * Search condition.
       */

      const matchesSearch =
        !query ||
        searchable.includes(query);


      /*
       * Category condition.
       */

      const matchesCategory =
        category === "all" ||
        item.category === category;


      /*
       * Opportunity must satisfy
       * both conditions.
       */

      return (
        matchesSearch &&
        matchesCategory
      );
    });


  /* =======================================================
     RESULT COUNT
     ======================================================= */

  const count =
    filtered.length;

  resultCount.textContent =
    `${count} opportunit${count === 1 ? "y" : "ies"} found`;


  /* =======================================================
     EMPTY RESULT
     ======================================================= */

  if (!filtered.length) {

    container.innerHTML = `
      <div class="empty">

        <strong>
          No opportunities found.
        </strong>

        <p>
          Try another search term or category.
        </p>

      </div>
    `;

    return;
  }


  /* =======================================================
     RENDER CARDS
     ======================================================= */

  container.innerHTML =
    filtered
      .map(createCard)
      .join("");
}


/* =========================================================
   CREATE OPPORTUNITY CARD
   ========================================================= */

/*
 * Creates one card for each opportunity.
 */

function createCard(item) {

  /*
   * Safely prepare the main values.
   */

  const category =
    item.category ||
    "Opportunity";

  const title =
    item.title ||
    "Untitled Opportunity";

  const organisation =
    item.organisation ||
    "Organisation not specified";

  const audience =
    item.audience ||
    "See official requirements";

  const location =
    item.location ||
    "See eligibility";

  const deadline =
    item.deadline ||
    "Check official source";

  const description =
    item.description ||
    "No description provided.";

  const lastVerified =
    item.last_verified ||
    "Not specified";


  /* =======================================================
     TAGS
     ======================================================= */

  const tags =
    Array.isArray(item.tags)
      ? item.tags
      : [];


  const tagMarkup =
    tags.length

      ? `
        <div class="tags">

          ${tags
            .map(tag => `
              <span class="tag tag-secondary">
                ${escapeHtml(tag)}
              </span>
            `)
            .join("")}

        </div>
      `

      : "";


  /* =======================================================
     DETAILS LINK
     ======================================================= */

  const detailsLink =
    item.details_url

      ? `
        <a
          class="btn secondary"
          href="${safeUrl(item.details_url)}"
          target="_blank"
          rel="noopener noreferrer"
        >
          Details ↗
        </a>
      `

      : "";


  /* =======================================================
     CARD
     ======================================================= */

  return `

    <article class="card">

      <!-- Category -->

      <span class="tag">
        ${escapeHtml(category)}
      </span>


      <!-- Opportunity title -->

      <h2>
        ${escapeHtml(title)}
      </h2>


      <!-- Organisation -->

      <div class="org">
        ${escapeHtml(organisation)}
      </div>


      <!-- Audience -->

      <div class="meta">

        <strong>
          For:
        </strong>

        ${escapeHtml(audience)}

      </div>


      <!-- Location -->

      <div class="meta">

        <strong>
          Location:
        </strong>

        ${escapeHtml(location)}

      </div>


      <!-- Deadline -->

      <div class="meta">

        <strong>
          Deadline:
        </strong>

        ${escapeHtml(deadline)}

      </div>


      <!-- Description -->

      <p class="description">

        ${escapeHtml(description)}

      </p>


      <!-- Last verified -->

      <div class="meta">

        <strong>
          Last verified:
        </strong>

        ${escapeHtml(lastVerified)}

      </div>


      <!-- Optional tags -->

      ${tagMarkup}


      <!-- Actions -->

      <div class="actions">

        <a
          class="btn primary"
          href="${safeUrl(item.official_url)}"
          target="_blank"
          rel="noopener noreferrer"
        >
          Official Source ↗
        </a>


        ${detailsLink}

      </div>

    </article>

  `;
}


/* =========================================================
   SAFE URL
   ========================================================= */

/*
 * Only allow HTTP and HTTPS URLs.
 *
 * This prevents dangerous protocols such as:
 *
 * javascript:
 * data:
 * file:
 *
 * from being inserted into links.
 */

function safeUrl(url) {

  if (
    typeof url !== "string" ||
    !url.trim()
  ) {
    return "#";
  }


  const trimmed =
    url.trim();


  /*
   * Only HTTP/HTTPS is permitted.
   */

  if (
    !/^https?:\/\//i.test(trimmed)
  ) {
    return "#";
  }


  /*
   * Escape the URL before inserting it
   * into the HTML attribute.
   */

  return escapeHtml(trimmed);
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

/*
 * JSON is external data.
 *
 * Never insert external data directly into
 * innerHTML without escaping it first.
 */

function escapeHtml(value) {

  return String(value ?? "")

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );
}


/* =========================================================
   LIVE SEARCH
   ========================================================= */

/*
 * Search updates immediately while the user types.
 */

searchInput.addEventListener(
  "input",
  render
);


/* =========================================================
   CATEGORY FILTER
   ========================================================= */

categoryFilter.addEventListener(
  "change",
  render
);
