/*
 * InVaal [016] — Contact Loader
 *
 * Purpose:
 * - Load contact information from contact.json
 * - Render contact topics
 * - Populate official contact channels
 * - Keep contact.html focused on page structure
 *
 * Data source:
 * ../data/contact.json
 */


/*
 * Wait until the HTML document has loaded.
 */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadContact();

  }
);


/*
 * Load contact data from JSON.
 */

async function loadContact() {

  try {

    /*
     * Fetch the JSON file.
     *
     * contact.html is inside /pages/,
     * therefore we move one directory up
     * before accessing /data/.
     */

    const response =
      await fetch("../data/contact.json");


    /*
     * Check whether the request was successful.
     */

    if (!response.ok) {

      throw new Error(
        `Failed to load contact data: ${response.status}`
      );

    }


    /*
     * Convert the response into JavaScript data.
     */

    const data =
      await response.json();


    /*
     * Render all contact content.
     */

    renderContact(data);


  } catch (error) {

    /*
     * Display the error in the browser console.
     *
     * This helps during development without
     * exposing technical details to visitors.
     */

    console.error(
      "InVaal [016] Contact Loader Error:",
      error
    );


    /*
     * Update the status message if available.
     */

    const status =
      document.querySelector("#contact-status");


    if (status) {

      status.textContent =
        "Contact information is currently unavailable.";

    }

  }

}


/*
 * Render contact page content.
 */

function renderContact(data) {

  /*
   * Update the hero title.
   */

  const contactTitle =
    document.querySelector(
      "[data-contact-title]"
    );


  if (
    contactTitle &&
    data.title
  ) {

    contactTitle.textContent =
      data.title;

  }


  /*
   * Update the hero introduction.
   */

  const contactIntro =
    document.querySelector(
      "[data-contact-intro]"
    );


  if (
    contactIntro &&
    data.intro
  ) {

    contactIntro.textContent =
      data.intro;

  }


  /*
   * Render contact topics.
   */

  renderContactTopics(
    data.contact_topics
  );


  /*
   * Render direct contact channels.
   */

  renderContactChannels(data);


  /*
   * Render community message.
   */

  renderCommunityMessage(
    data.community
  );


  /*
   * Render disclaimer.
   */

  const disclaimer =
    document.querySelector(
      "[data-disclaimer]"
    );


  if (
    disclaimer &&
    data.disclaimer
  ) {

    disclaimer.textContent =
      data.disclaimer;

  }


  /*
   * Remove the loading message once
   * all JSON content has been processed.
   */

  const status =
    document.querySelector(
      "#contact-status"
    );


  if (status) {

    status.remove();

  }

}


/*
 * Render contact topic cards.
 */

function renderContactTopics(topics) {

  const container =
    document.querySelector(
      "[data-contact-topics]"
    );


  /*
   * Stop if the container does not exist.
   */

  if (!container) {

    return;

  }


  /*
   * Check whether the JSON contains
   * a valid array of contact topics.
   */

  if (
    !Array.isArray(topics) ||
    topics.length === 0
  ) {

    container.innerHTML = `
      <p class="status-message">
        No contact options are currently available.
      </p>
    `;

    return;

  }


  /*
   * Create a card for every contact topic.
   */

  container.innerHTML =
    topics
      .map((topic) => {

        return `
          <article class="community-card">

            <span
              class="card-icon"
              aria-hidden="true"
            >
              ${escapeHTML(topic.icon || "💬")}
            </span>

            <h3>
              ${escapeHTML(topic.title)}
            </h3>

            <p>
              ${escapeHTML(topic.description)}
            </p>

          </article>
        `;

      })
      .join("");

}


/*
 * Render email, WhatsApp and social links.
 */

function renderContactChannels(data) {

  /*
   * Email
   */

  const email =
    document.querySelector(
      "[data-contact-email]"
    );


  if (
    email &&
    data.email &&
    !data.email.includes("YOUR-EMAIL")
  ) {

    email.textContent =
      data.email;

    email.href =
      `mailto:${data.email}`;

  }


  /*
   * WhatsApp
   */

  const whatsapp =
    document.querySelector(
      "[data-contact-whatsapp]"
    );


  if (
    whatsapp &&
    data.whatsapp &&
    data.whatsapp.url &&
    data.whatsapp.url !== "#"
  ) {

    whatsapp.textContent =
      data.whatsapp.label ||
      "WhatsApp InVaal [016]";

    whatsapp.href =
      data.whatsapp.url;

  }


  /*
   * Facebook
   */

  const facebook =
    document.querySelector(
      "[data-contact-facebook]"
    );


  if (
    facebook &&
    data.socials &&
    data.socials.facebook &&
    data.socials.facebook !== "#"
  ) {

    facebook.href =
      data.socials.facebook;

  }


  /*
   * Instagram
   */

  const instagram =
    document.querySelector(
      "[data-contact-instagram]"
    );


  if (
    instagram &&
    data.socials &&
    data.socials.instagram &&
    data.socials.instagram !== "#"
  ) {

    instagram.href =
      data.socials.instagram;

  }

}


/*
 * Render the community message.
 */

function renderCommunityMessage(
  community
) {

  if (!community) {

    return;

  }


  const title =
    document.querySelector(
      "[data-community-title]"
    );


  const message =
    document.querySelector(
      "[data-community-message]"
    );


  if (
    title &&
    community.title
  ) {

    title.textContent =
      community.title;

  }


  if (
    message &&
    community.message
  ) {

    message.textContent =
      community.message;

  }

}


/*
 * Escape dynamic text before inserting
 * it into HTML.
 *
 * This prevents JSON content from being
 * interpreted as HTML.
 */

function escapeHTML(value) {

  return String(value)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}
