/* =========================================================
   InVaal [016] — Business Directory Loader

   File:
   ./js/loaders/business-loader.js

   Responsibilities:
   - Load businesses.json
   - Load approved consent records
   - Validate business records
   - Only publish businesses with approved consent
   - Detect the current page
   - Render homepage business cards
   - Render the full business directory
   - Highlight featured businesses
   - Display verification status
   - Display business logos
   - Display location and category
   - Create business listing links

   Data sources:
   ./data/businesses.json
   ./admin-data/business-content.json

   IMPORTANT:
   A business must have explicit approved consent before
   its information can appear publicly.
========================================================= */


/* =========================================================
   PATH CONFIGURATION
========================================================= */

/**
 * Determines whether the current page is inside
 * the /pages/ directory.
 *
 * @returns {boolean}
 */
const isInsidePagesDirectory = () => (

  window.location.pathname.includes(
    "/pages/"
  )

);


/**
 * Returns the correct path to the data directory.
 *
 * index.html:
 * ./data/
 *
 * pages/businesses.html:
 * ../data/
 *
 * @returns {string}
 */
const getDataPath = () => (

  isInsidePagesDirectory()
    ? "../data/"
    : "./data/"

);


/**
 * Returns the correct path to the admin-data directory.
 *
 * index.html:
 * ./admin-data/
 *
 * pages/businesses.html:
 * ../admin-data/
 *
 * @returns {string}
 */
const getAdminDataPath = () => (

  isInsidePagesDirectory()
    ? "../admin-data/"
    : "./admin-data/"

);


/**
 * Returns the correct path to an individual
 * business listing page.
 *
 * index.html:
 * ./pages/businesses/
 *
 * pages/businesses.html:
 * ./businesses/
 *
 * @param {string} slug
 * @returns {string}
 */
const getBusinessPagePath = (
  slug
) => (

  isInsidePagesDirectory()
    ? `./businesses/${slug}.html`
    : `./pages/businesses/${slug}.html`

);


const BUSINESS_DATA_URL =
  `${getDataPath()}businesses.json`;


const CONSENT_DATA_URL =
  `${getAdminDataPath()}business-content.json`;


const BUSINESS_CONTAINER_ID =
  "business-container";


/* =========================================================
   PAGE DETECTION
========================================================= */

/**
 * Determines whether the current page is the
 * complete business directory.
 *
 * @returns {boolean}
 */
const isBusinessDirectoryPage = () => (

  window.location.pathname.endsWith(
    "/pages/businesses.html"
  )

);


/* =========================================================
   DOM HELPERS
========================================================= */

/**
 * Finds an element by ID.
 *
 * @param {string} id
 * @returns {HTMLElement|null}
 */
const getBusinessElement = (
  id
) => (
  document.getElementById(id)
);


/* =========================================================
   DATA LOADING
========================================================= */

/**
 * Loads the business directory JSON.
 *
 * @returns {Promise<Object>}
 */
const fetchBusinesses = async () => {

  const response =
    await fetch(
      BUSINESS_DATA_URL
    );


  /*
    fetch() does not automatically reject HTTP errors,
    so the response status must be checked manually.
  */

  if (!response.ok) {

    throw new Error(
      `Unable to load businesses: ${response.status}`
    );

  }


  return (
    response.json()
  );

};


/**
 * Loads business consent records.
 *
 * @returns {Promise<Object>}
 */
const fetchConsentRecords = async () => {

  const response =
    await fetch(
      CONSENT_DATA_URL
    );


  /*
    HTTP errors such as 404 do not automatically cause
    fetch() to reject.
  */

  if (!response.ok) {

    throw new Error(
      `Unable to load consent records: ${response.status}`
    );

  }


  return (
    response.json()
  );

};


/* =========================================================
   VALIDATION
========================================================= */

/**
 * Checks whether a business contains the minimum
 * information required for public display.
 *
 * @param {Object} business
 * @returns {boolean}
 */
const isValidBusiness = (
  business
) => (

  Boolean(
    business &&
    business.id &&
    business.name &&
    business.category &&
    business.location &&
    business.location.town
  )

);


/* =========================================================
   CONSENT / PUBLISHING
========================================================= */

/**
 * Determines whether a business has approved consent.
 *
 * The business ID connects the public business record
 * with its consent record.
 *
 * @param {Object} business
 * @param {Array} consentRecords
 * @returns {boolean}
 */
const hasApprovedConsent = (
  business,
  consentRecords = []
) => (

  consentRecords.some(
    (record) => (

      record.businessId === business.id &&
      record.status === "approved"

    )
  )

);


/**
 * Returns businesses that are allowed to appear publicly.
 *
 * A business must:
 *
 * 1. Be valid.
 * 2. Have an active status.
 * 3. Have approved consent.
 *
 * @param {Array} businesses
 * @param {Array} consentRecords
 * @returns {Array}
 */
const getPublishableBusinesses = (
  businesses = [],
  consentRecords = []
) => (

  businesses.filter(
    (business) => (

      business.status === "active" &&
      isValidBusiness(business) &&
      hasApprovedConsent(
        business,
        consentRecords
      )

    )
  )

);


/* =========================================================
   FORMATTING
========================================================= */

/**
 * Converts a category value into a readable label.
 *
 * Example:
 *
 * "food" -> "Food"
 * "beauty" -> "Beauty"
 *
 * @param {string} category
 * @returns {string}
 */
const formatBusinessCategory = (
  category
) => {

  if (!category) {

    return (
      "Business"
    );

  }


  return (
    category
      .replace(
        /[-_]/g,
        " "
      )
      .replace(
        /\b\w/g,
        (letter) => (
          letter.toUpperCase()
        )
      )
  );

};


/* =========================================================
   BUSINESS MEDIA
========================================================= */

/**
 * Creates the media section for a business card.
 *
 * A business can have:
 *
 * - A main image
 * - A logo
 * - Both
 * - Neither
 *
 * @param {Object} business
 * @returns {HTMLElement|null}
 */
const createBusinessMedia = (
  business
) => {

  const hasLogo =
    typeof business.logo === "string" &&
    business.logo.trim() !== "";


  const hasImages =
    Array.isArray(business.images) &&
    business.images.length > 0;


  /*
    Do not create an empty media container when
    no visual assets are available.
  */

  if (
    !hasLogo &&
    !hasImages
  ) {

    return (
      null
    );

  }


  const media =
    document.createElement(
      "div"
    );


  media.className =
    "card-media";


  /* -------------------------------------------------------
     MAIN BUSINESS IMAGE
  ------------------------------------------------------- */

  if (hasImages) {

    const image =
      document.createElement(
        "img"
      );


    image.src =
      business.images[0];


    image.alt =
      `${business.name} listing image`;


    image.loading =
      "lazy";


    media.appendChild(
      image
    );

  }


  /* -------------------------------------------------------
     BUSINESS LOGO
  ------------------------------------------------------- */

  if (hasLogo) {

    const logo =
      document.createElement(
        "img"
      );


    logo.className =
      "business-logo";


    logo.src =
      business.logo;


    logo.alt =
      `${business.name} logo`;


    logo.loading =
      "lazy";


    media.appendChild(
      logo
    );

  }


  return (
    media
  );

};


/* =========================================================
   BUSINESS CARD
========================================================= */

/**
 * Creates one business card.
 *
 * This card is shared by the homepage and the
 * complete business directory.
 *
 * @param {Object} business
 * @returns {HTMLElement}
 */
const createBusinessCard = (
  business
) => {

  const article =
    document.createElement(
      "article"
    );


  article.className =
    "content-card business-card";


  /*
    Featured businesses receive an additional class
    so CSS can visually distinguish them.
  */

  if (business.featured) {

    article.classList.add(
      "is-featured"
    );

  }


  /* -------------------------------------------------------
     MEDIA
  ------------------------------------------------------- */

  const media =
    createBusinessMedia(
      business
    );


  if (media) {

    article.appendChild(
      media
    );

  }


  /* -------------------------------------------------------
     CARD BODY
  ------------------------------------------------------- */

  const body =
    document.createElement(
      "div"
    );


  body.className =
    "card-body";


  /* -------------------------------------------------------
     CATEGORY
  ------------------------------------------------------- */

  const category =
    document.createElement(
      "span"
    );


  category.className =
    "card-category";


  category.textContent =
    formatBusinessCategory(
      business.category
    );


  /* -------------------------------------------------------
     BUSINESS NAME
  ------------------------------------------------------- */

  const title =
    document.createElement(
      "h3"
    );


  title.className =
    "business-name";


  title.textContent =
    business.name;


  /* -------------------------------------------------------
     DESCRIPTION
  ------------------------------------------------------- */

  const description =
    document.createElement(
      "p"
    );


  description.className =
    "card-description";


  description.textContent =
    business.description ||
    "Local business in the Vaal Triangle.";


  /* -------------------------------------------------------
     LOCATION
  ------------------------------------------------------- */

  const location =
    document.createElement(
      "div"
    );


  location.className =
    "card-meta";


  const locationText =
    document.createElement(
      "span"
    );


  locationText.textContent =
    `📍 ${business.location.town}`;


  /*
    Add the area when one has been supplied.
  */

  if (business.location.area) {

    locationText.textContent +=
      ` • ${business.location.area}`;

  }


  location.appendChild(
    locationText
  );


  /* -------------------------------------------------------
     VERIFICATION
  ------------------------------------------------------- */

  if (business.verified) {

    const verified =
      document.createElement(
        "span"
      );


    verified.className =
      "verified-badge";


    verified.textContent =
      "✓ Verified";


    verified.setAttribute(
      "aria-label",
      "Verified business"
    );


    location.appendChild(
      verified
    );

  }


  /* -------------------------------------------------------
     BUSINESS LINK
  ------------------------------------------------------- */

  const link =
    document.createElement(
      "a"
    );


  link.className =
    "section-link";


  /*
    The helper automatically chooses the correct
    relative path for the current page.
  */

  link.href =
    getBusinessPagePath(
      business.slug
    );


  link.textContent =
    "View business →";


  /* -------------------------------------------------------
     ASSEMBLE CARD
  ------------------------------------------------------- */

  body.append(
    category,
    title,
    description,
    location,
    link
  );


  article.appendChild(
    body
  );


  return (
    article
  );

};


/* =========================================================
   EMPTY STATE
========================================================= */

/**
 * Creates a message for an empty business directory.
 *
 * @param {string} message
 * @returns {HTMLElement}
 */
const createStatusMessage = (
  message
) => {

  const element =
    document.createElement(
      "p"
    );


  element.className =
    "status-message";


  element.textContent =
    message;


  return (
    element
  );

};


/* =========================================================
   RENDERING
========================================================= */

/**
 * Renders businesses into the supplied container.
 *
 * @param {Array} businesses
 * @param {number|null} limit
 * @param {string} emptyMessage
 * @returns {void}
 */
const renderBusinessList = (
  businesses,
  limit = null,
  emptyMessage = "No business listings are currently available."
) => {

  const container =
    getBusinessElement(
      BUSINESS_CONTAINER_ID
    );


  if (!container) {

    return;

  }


  container.replaceChildren();


  /*
    Apply a limit only when one has been provided.
    The full directory receives null and therefore
    displays every publishable business.
  */

  const businessesToRender =
    limit === null
      ? businesses
      : businesses.slice(
          0,
          limit
        );


  businessesToRender.forEach(
    (business) => {

      container.appendChild(
        createBusinessCard(
          business
        )
      );

    }
  );


  /*
    Show a useful message instead of leaving the
    business section completely empty.
  */

  if (!businessesToRender.length) {

    container.appendChild(
      createStatusMessage(
        emptyMessage
      )
    );

  }

};


/* =========================================================
   PAGE-AWARE RENDERING
========================================================= */

/**
 * Renders businesses according to the current page.
 *
 * Homepage:
 * - Displays a maximum of six businesses.
 *
 * businesses.html:
 * - Displays every publishable business.
 *
 * @param {Array} businesses
 * @returns {void}
 */
const renderBusinesses = (
  businesses
) => {

  if (
    isBusinessDirectoryPage()
  ) {

    renderBusinessList(
      businesses,
      null,
      "No approved business listings are currently available."
    );

    return;

  }


  /*
    The homepage intentionally displays only a small
    selection of businesses.
  */

  renderBusinessList(
    businesses,
    6,
    "Local business listings are coming soon."
  );

};


/* =========================================================
   INITIALISATION
========================================================= */

/**
 * Starts the business directory.
 *
 * @returns {Promise<void>}
 */
const initialiseBusinesses = async () => {

  try {

    /*
      Businesses and consent records are independent
      resources, so load them simultaneously.
    */

    const [
      businessData,
      consentData
    ] = await Promise.all([
      fetchBusinesses(),
      fetchConsentRecords()
    ]);


    /* -----------------------------------------------------
       VALIDATE BUSINESS DATA
    ----------------------------------------------------- */

    if (
      !businessData ||
      !Array.isArray(
        businessData.businesses
      )
    ) {

      throw new Error(
        "Invalid business data format."
      );

    }


    /* -----------------------------------------------------
       VALIDATE CONSENT DATA
    ----------------------------------------------------- */

    if (
      !consentData ||
      !Array.isArray(
        consentData.consentRecords
      )
    ) {

      throw new Error(
        "Invalid consent data format."
      );

    }


    /* -----------------------------------------------------
       GET PUBLISHABLE BUSINESSES
    ----------------------------------------------------- */

    const businesses =
      getPublishableBusinesses(
        businessData.businesses,
        consentData.consentRecords
      );


    /*
      Featured businesses appear before normal listings.
    */

    businesses.sort(
      (a, b) => {

        if (
          a.featured === b.featured
        ) {

          return (
            0
          );

        }


        return (
          a.featured
            ? -1
            : 1
        );

      }
    );


    /* -----------------------------------------------------
       RENDER CURRENT PAGE
    ----------------------------------------------------- */

    renderBusinesses(
      businesses
    );


  } catch (error) {

    console.error(
      "InVaal business directory error:",
      error
    );


    const container =
      getBusinessElement(
        BUSINESS_CONTAINER_ID
      );


    if (!container) {

      return;

    }


    container.replaceChildren();


    container.appendChild(
      createStatusMessage(
        "Business listings could not be loaded right now."
      )
    );

  }

};


/* =========================================================
   START
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initialiseBusinesses
);
