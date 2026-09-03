/* =========================================================
   InVaal [016] — Terms & Privacy Loader

   File:
   ./js/loaders/terms-privacy-loader.js

   Data:
   ../data/termsAndprivacy.json

   Responsibilities:
   - Detect whether the current page is terms.html or privacy.html
   - Load the shared Terms & Privacy JSON file
   - Render the correct legal content
   - Render section headings and paragraphs
   - Render the closing message
   - Render the last updated date
   - Safely escape dynamic HTML content
   - Handle loading errors gracefully

   Compatible with:
   - Static HTML
   - GitHub Pages
   - Vanilla JavaScript
   - No npm
   - No React
========================================================= */


/* =========================================================
   CONFIGURATION
========================================================= */

// Location of the shared Terms & Privacy data file.
//
// Both terms.html and privacy.html are inside:
//
// ./pages/
//
// Therefore we move one directory up:
//
// ../data/termsAndprivacy.json
//
const TERMS_PRIVACY_DATA_PATH =
  "../data/termsAndprivacy.json";


/* =========================================================
   DOM SELECTORS
========================================================= */

// The HTML pages should contain one of these containers:
//
// terms.html:
// <section id="terms-content"></section>
//
// privacy.html:
// <section id="privacy-content"></section>
//
const TERMS_CONTENT_SELECTOR =
  "#terms-content";

const PRIVACY_CONTENT_SELECTOR =
  "#privacy-content";

// Optional status element.
//
// Example:
//
// <p id="legal-status">Loading...</p>
//
const STATUS_SELECTOR =
  "#legal-status";

// Optional page title element.
//
// Example:
//
// <h1 data-legal-title></h1>
//
const TITLE_SELECTOR =
  "[data-legal-title]";

// Optional subtitle element.
//
// Example:
//
// <p data-legal-subtitle></p>
//
const SUBTITLE_SELECTOR =
  "[data-legal-subtitle]";

// Optional intro element.
//
// Example:
//
// <p data-legal-intro></p>
//
const INTRO_SELECTOR =
  "[data-legal-intro]";

// Optional last-updated element.
//
// Example:
//
// <time data-legal-updated></time>
//
const UPDATED_SELECTOR =
  "[data-legal-updated]";

// Optional closing section.
//
// Example:
//
// <section id="legal-closing"></section>
//
const CLOSING_SELECTOR =
  "#legal-closing";


/* =========================================================
   ESCAPE HTML
========================================================= */

/**
 * Escapes dynamic text before inserting it into HTML.
 *
 * This is important because the Terms & Privacy content
 * comes from a JSON file.
 *
 * Even though the JSON is controlled by the project,
 * escaping dynamic content is a good security practice.
 *
 * @param {string} value
 * @returns {string}
 */
function escapeHTML(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =========================================================
   DETECT CURRENT PAGE
========================================================= */

/**
 * Determines whether the current page is the Terms page
 * or the Privacy page.
 *
 * The function checks the actual filename in the URL.
 *
 * @returns {"terms"|"privacy"|null}
 */
function getCurrentLegalPage() {
  const currentPath =
    window.location.pathname.toLowerCase();

  if (currentPath.endsWith("/terms.html")) {
    return "terms";
  }

  if (currentPath.endsWith("/privacy.html")) {
    return "privacy";
  }

  return null;
}


/* =========================================================
   GET CONTENT CONTAINER
========================================================= */

/**
 * Finds the correct content container for the current page.
 *
 * @param {"terms"|"privacy"} pageType
 * @returns {HTMLElement|null}
 */
function getContentContainer(pageType) {
  if (pageType === "terms") {
    return document.querySelector(
      TERMS_CONTENT_SELECTOR
    );
  }

  if (pageType === "privacy") {
    return document.querySelector(
      PRIVACY_CONTENT_SELECTOR
    );
  }

  return null;
}


/* =========================================================
   UPDATE PAGE META / HEADER CONTENT
========================================================= */

/**
 * Updates the title, subtitle and introductory content
 * from the JSON data.
 *
 * @param {Object} legalData
 * @returns {void}
 */
function renderLegalIntroduction(legalData) {
  if (!legalData) {
    return;
  }

  // Update page title element if it exists.
  const titleElement =
    document.querySelector(TITLE_SELECTOR);

  if (titleElement && legalData.title) {
    titleElement.textContent =
      legalData.title;
  }


  // Update subtitle if it exists.
  const subtitleElement =
    document.querySelector(SUBTITLE_SELECTOR);

  if (subtitleElement && legalData.subtitle) {
    subtitleElement.textContent =
      legalData.subtitle;
  }


  // Update introductory paragraph if it exists.
  const introElement =
    document.querySelector(INTRO_SELECTOR);

  if (introElement && legalData.intro) {
    introElement.textContent =
      legalData.intro;
  }


  // Update browser tab title.
  //
  // Example:
  // InVaal [016] — Terms of Use
  //
  if (legalData.title) {
    document.title =
      `InVaal [016] — ${legalData.title}`;
  }
}


/* =========================================================
   RENDER LAST UPDATED DATE
========================================================= */

/**
 * Displays the last updated date from the JSON file.
 *
 * @param {string} dateValue
 * @returns {void}
 */
function renderLastUpdated(dateValue) {
  const updatedElement =
    document.querySelector(UPDATED_SELECTOR);

  if (!updatedElement || !dateValue) {
    return;
  }

  updatedElement.textContent =
    formatDate(dateValue);

  // Also provide a machine-readable date.
  updatedElement.setAttribute(
    "datetime",
    dateValue
  );
}


/* =========================================================
   FORMAT DATE
========================================================= */

/**
 * Converts an ISO date such as:
 *
 * 2026-09-02
 *
 * into a more readable South African-style date:
 *
 * 2 September 2026
 *
 * @param {string} dateValue
 * @returns {string}
 */
function formatDate(dateValue) {
  const date =
    new Date(`${dateValue}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat(
    "en-ZA",
    {
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  ).format(date);
}


/* =========================================================
   RENDER LEGAL SECTIONS
========================================================= */

/**
 * Builds all Terms or Privacy sections.
 *
 * Each section in the JSON contains:
 *
 * {
 *   "id": "...",
 *   "title": "...",
 *   "paragraphs": [...]
 * }
 *
 * @param {Array} sections
 * @returns {string}
 */
function renderSections(sections) {
  if (!Array.isArray(sections)) {
    return "";
  }

  return sections
    .map((section) => {
      if (!section) {
        return "";
      }

      const sectionId =
        escapeHTML(section.id || "");

      const sectionTitle =
        escapeHTML(section.title || "");

      const paragraphs =
        Array.isArray(section.paragraphs)
          ? section.paragraphs
          : [];

      const paragraphHTML =
        paragraphs
          .map((paragraph) => {
            return `
              <p>
                ${escapeHTML(paragraph)}
              </p>
            `;
          })
          .join("");

      return `
        <article
          class="legal-section"
          id="${sectionId}"
        >
          <h2>
            ${sectionTitle}
          </h2>

          <div class="legal-section-content">
            ${paragraphHTML}
          </div>
        </article>
      `;
    })
    .join("");
}


/* =========================================================
   RENDER CLOSING MESSAGE
========================================================= */

/**
 * Renders the final closing CTA/message.
 *
 * @param {Object} closing
 * @returns {void}
 */
function renderClosing(closing) {
  const closingElement =
    document.querySelector(CLOSING_SELECTOR);

  if (!closingElement || !closing) {
    return;
  }

  const title =
    escapeHTML(closing.title || "");

  const message =
    escapeHTML(closing.message || "");

  closingElement.innerHTML = `
    <div class="legal-closing-content">

      ${
        title
          ? `<h2>${title}</h2>`
          : ""
      }

      ${
        message
          ? `<p>${message}</p>`
          : ""
      }

    </div>
  `;
}


/* =========================================================
   RENDER COMPLETE LEGAL PAGE
========================================================= */

/**
 * Renders a Terms or Privacy page.
 *
 * @param {Object} legalData
 * @param {Object} rootData
 * @returns {void}
 */
function renderLegalPage(legalData, rootData) {
  if (!legalData) {
    return;
  }

  const contentContainer =
    getContentContainer(
      getCurrentLegalPage()
    );

  if (!contentContainer) {
    console.error(
      "InVaal [016]: Legal content container not found."
    );

    return;
  }


  // Render sections.
  contentContainer.innerHTML =
    renderSections(
      legalData.sections
    );


  // Render page introduction.
  renderLegalIntroduction(
    legalData
  );


  // Render last updated date.
  renderLastUpdated(
    rootData.last_updated
  );


  // Render closing message.
  renderClosing(
    legalData.closing
  );
}


/* =========================================================
   STATUS HANDLING
========================================================= */

/**
 * Updates the optional loading/status message.
 *
 * @param {string} message
 * @param {boolean} isError
 * @returns {void}
 */
function updateStatus(message, isError = false) {
  const statusElement =
    document.querySelector(
      STATUS_SELECTOR
    );

  if (!statusElement) {
    return;
  }

  statusElement.textContent =
    message;

  statusElement.hidden =
    !message;

  statusElement.setAttribute(
    "aria-live",
    "polite"
  );

  if (isError) {
    statusElement.classList.add(
      "is-error"
    );
  } else {
    statusElement.classList.remove(
      "is-error"
    );
  }
}


/* =========================================================
   LOAD JSON DATA
========================================================= */

/**
 * Fetches the shared Terms & Privacy JSON file.
 *
 * @returns {Promise<Object>}
 */
async function loadTermsPrivacyData() {
  const response =
    await fetch(
      TERMS_PRIVACY_DATA_PATH
    );

  if (!response.ok) {
    throw new Error(
      `Unable to load legal data (${response.status})`
    );
  }

  return await response.json();
}


/* =========================================================
   INITIALISE LEGAL PAGE
========================================================= */

/**
 * Main initialisation function.
 *
 * Determines the current page, loads the JSON file,
 * selects the correct section and renders it.
 *
 * @returns {Promise<void>}
 */
async function initialiseTermsPrivacy() {
  const pageType =
    getCurrentLegalPage();

  // If this JavaScript file is loaded somewhere other
  // than terms.html or privacy.html, do nothing.
  if (!pageType) {
    return;
  }


  updateStatus(
    "Loading..."
  );


  try {
    // Load the shared JSON file.
    const data =
      await loadTermsPrivacyData();


    // Make sure the expected object exists.
    const legalData =
      data[pageType];

    if (!legalData) {
      throw new Error(
        `No "${pageType}" data was found in termsAndprivacy.json.`
      );
    }


    // Render everything.
    renderLegalPage(
      legalData,
      data
    );


    // Remove loading message.
    updateStatus("");


  } catch (error) {
    console.error(
      "InVaal [016]: Failed to load Terms & Privacy data.",
      error
    );


    // Show a user-friendly message.
    updateStatus(
      "We could not load this information right now. Please try again later.",
      true
    );


    // Also provide a fallback message inside the
    // appropriate content container.
    const contentContainer =
      getContentContainer(pageType);

    if (contentContainer) {
      contentContainer.innerHTML = `
        <div class="legal-error">

          <h2>
            Information temporarily unavailable
          </h2>

          <p>
            The ${escapeHTML(pageType)}
            information could not be loaded.
            Please refresh the page and try again.
          </p>

        </div>
      `;
    }
  }
}


/* =========================================================
   START APPLICATION
========================================================= */

/*
  If the document is still loading, wait until the DOM
  has been created.

  Otherwise initialise immediately.

  This makes the loader work whether the script is loaded
  in the <head> or near the end of <body>.
*/

if (
  document.readyState === "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    initialiseTermsPrivacy
  );
} else {
  initialiseTermsPrivacy();
}


/* =========================================================
   OPTIONAL EXPORTS
========================================================= */

/*
  These functions are attached to window so they can be
  inspected from the browser console while developing.

  Example:

  initialiseTermsPrivacy();

  This is useful during development and debugging.
*/

window.InVaalTermsPrivacy = {
  initialise: initialiseTermsPrivacy,
  loadData: loadTermsPrivacyData,
  escapeHTML,
  formatDate
};
