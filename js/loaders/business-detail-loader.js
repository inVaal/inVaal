/* =========================================================
   InVaal [016] — Business Detail Loader

   File:
   ./js/loaders/business-detail-loader.js

   Responsibilities:
   - Read the business slug from the URL
   - Load business data
   - Load consent records
   - Validate the business
   - Check publishing permission
   - Render the business profile
   - Render contact information
   - Render opening hours
   - Render services
   - Render gallery
   - Render social links
   - Handle missing/unapproved businesses

   Data sources:
   ./data/businesses.json
   ./admin-data/business-content.json
========================================================= */


/* =========================================================
   CONFIGURATION
========================================================= */

const BUSINESS_DATA_URL =
  "../../data/businesses.json";

const CONSENT_DATA_URL =
  "../../admin-data/business-content.json";

const PROFILE_ID =
  "business-profile";

const CONTENT_ID =
  "business-content";

const STATUS_ID =
  "business-status";


/* =========================================================
   DOM HELPERS
========================================================= */

/**
 * Finds an element by ID.
 *
 * @param {string} id
 * @returns {HTMLElement|null}
 */
const getElement = (
  id
) => (
  document.getElementById(id)
);


/* =========================================================
   URL HELPERS
========================================================= */

/**
 * Gets the business slug from the current URL.
 *
 * Example:
 *
 * /pages/businesses/demo-local-business.html
 *
 * becomes:
 *
 * demo-local-business
 *
 * @returns {string}
 */
const getBusinessSlug = () => {

  const pathname =
    window.location.pathname;


  const filename =
    pathname
      .split("/")
      .pop();


  if (!filename) {
    return ("");
  }


  return (
    filename.replace(
      /\.html$/,
      ""
    )
  );

};


/* =========================================================
   DATA LOADING
========================================================= */

/**
 * Loads the business directory.
 *
 * @returns {Promise<Object>}
 */
const fetchBusinesses = async () => {

  const response =
    await fetch(
      BUSINESS_DATA_URL
    );


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
 * Loads consent records.
 *
 * @returns {Promise<Object>}
 */
const fetchConsentRecords = async () => {

  const response =
    await fetch(
      CONSENT_DATA_URL
    );


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
 * Checks whether the business contains the minimum
 * information required by the directory.
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
    business.slug &&
    business.category &&
    business.location &&
    business.location.town
  )

);


/* =========================================================
   CONSENT
========================================================= */

/**
 * Determines whether a business has approved consent.
 *
 * @param {Object} business
 * @param {Array} consentRecords
 * @returns {boolean}
 */
const hasApprovedConsent = (
  business,
  consentRecords = []
) => {

  const consent =
    consentRecords.find(
      (record) => (
        record.businessId === business.id &&
        record.status === "approved"
      )
    );


  /*
    Only explicitly approved businesses can
    appear on the public website.
  */

  return (
    Boolean(consent)
  );

};


/* =========================================================
   FORMATTING
========================================================= */

/**
 * Converts a category into a readable label.
 *
 * @param {string} value
 * @returns {string}
 */
const formatLabel = (
  value
) => {

  if (!value) {
    return ("");
  }


  return (
    value
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (letter) => (
        letter.toUpperCase()
      ))
  );

};


/* =========================================================
   STATUS
========================================================= */

/**
 * Displays a status message.
 *
 * @param {string} message
 */
const setStatus = (
  message
) => {

  const status =
    getElement(
      STATUS_ID
    );


  if (!status) {
    return;
  }


  status.textContent =
    message;

};


/* =========================================================
   BUSINESS HERO
========================================================= */

/**
 * Creates the business profile header.
 *
 * @param {Object} business
 * @returns {HTMLElement}
 */
const createBusinessHero = (
  business
) => {

  const wrapper =
    document.createElement("div");

  wrapper.className =
    "business-profile-header";


  /* -------------------------------------------------------
     LOGO
  ------------------------------------------------------- */

  if (
    typeof business.logo === "string" &&
    business.logo.trim() !== ""
  ) {

    const logoWrapper =
      document.createElement("div");

    logoWrapper.className =
      "business-profile-logo";


    const logo =
      document.createElement("img");

    // logo.src =
      // business.logo;

    // logo.alt =
      // `${business.name} logo`;

    logo.loading =
      "eager";


    logoWrapper.appendChild(
      logo
    );


    wrapper.appendChild(
      logoWrapper
    );

  }


  /* -------------------------------------------------------
     INFORMATION
  ------------------------------------------------------- */

  const information =
    document.createElement("div");

  information.className =
    "business-profile-information";


  const category =
    document.createElement("span");

  category.className =
    "eyebrow";

  category.textContent =
    formatLabel(
      business.category
    );


  const title =
    document.createElement("h1");

  title.id =
    "business-title";

  title.className =
    "business-profile-title";

  title.textContent =
    business.name;


  /*
    Display verification only when the business
    has actually been verified.
  */

  if (business.verified) {

    const verified =
      document.createElement("span");

    verified.className =
      "verified-badge";

    verified.textContent =
      "✓ Verified";

    verified.setAttribute(
      "aria-label",
      "Verified business"
    );


    information.appendChild(
      verified
    );

  }


  information.append(
    category,
    title
  );


  wrapper.appendChild(
    information
  );


  return (
    wrapper
  );

};


/* =========================================================
   DESCRIPTION
========================================================= */

/**
 * Creates the business description.
 *
 * @param {Object} business
 * @returns {HTMLElement}
 */
const createDescription = (
  business
) => {

  const section =
    document.createElement("section");

  section.className =
    "business-detail-section";


  const title =
    document.createElement("h2");

  title.textContent =
    "About this business";


  const description =
    document.createElement("p");

  description.textContent =
    business.description ||
    "Business information coming soon.";


  section.append(
    title,
    description
  );


  return (
    section
  );

};


/* =========================================================
   LOCATION
========================================================= */

/**
 * Creates the location section.
 *
 * @param {Object} business
 * @returns {HTMLElement}
 */
const createLocation = (
  business
) => {

  const section =
    document.createElement("section");

  section.className =
    "business-detail-section";


  const title =
    document.createElement("h2");

  title.textContent =
    "Location";


  const location =
    document.createElement("p");

  const parts = [
    business.location.area,
    business.location.town,
    business.location.address
  ].filter(Boolean);


  location.textContent =
    `📍 ${parts.join(" • ")}`;


  section.append(
    title,
    location
  );


  /*
    Add Google Maps only when a map link has been supplied.
  */

  if (
    typeof business.googleMaps === "string" &&
    business.googleMaps.trim() !== ""
  ) {

    const mapLink =
      document.createElement("a");

    mapLink.className =
      "section-link";

    mapLink.href =
      business.googleMaps;

    mapLink.target =
      "_blank";

    mapLink.rel =
      "noopener noreferrer";

    mapLink.textContent =
      "Open in Google Maps →";


    section.appendChild(
      mapLink
    );

  }


  return (
    section
  );

};


/* =========================================================
   CONTACT
========================================================= */

/**
 * Creates contact links.
 *
 * @param {Object} business
 * @returns {HTMLElement}
 */
const createContact = (
  business
) => {

  const section =
    document.createElement("section");

  section.className =
    "business-detail-section";


  const title =
    document.createElement("h2");

  title.textContent =
    "Contact";


  const contactList =
    document.createElement("div");

  contactList.className =
    "business-contact-list";


  /*
    Phone
  */

  if (business.phone) {

    const phone =
      document.createElement("a");

    phone.href =
      `tel:${business.phone}`;

    phone.textContent =
      `📞 ${business.phone}`;

    contactList.appendChild(
      phone
    );

  }


  /*
    WhatsApp
  */

  if (business.whatsapp) {

    const whatsapp =
      document.createElement("a");

    whatsapp.href =
      `https://wa.me/${business.whatsapp}`;

    whatsapp.target =
      "_blank";

    whatsapp.rel =
      "noopener noreferrer";

    whatsapp.textContent =
      "💬 WhatsApp";


    contactList.appendChild(
      whatsapp
    );

  }


  /*
    Email
  */

  if (business.email) {

    const email =
      document.createElement("a");

    email.href =
      `mailto:${business.email}`;

    email.textContent =
      `✉️ ${business.email}`;


    contactList.appendChild(
      email
    );

  }


  /*
    Website
  */

  if (business.website) {

    const website =
      document.createElement("a");

    website.href =
      business.website;

    website.target =
      "_blank";

    website.rel =
      "noopener noreferrer";

    website.textContent =
      "🌐 Website →";


    contactList.appendChild(
      website
    );

  }


  if (!contactList.children.length) {

    const message =
      document.createElement("p");

    message.textContent =
      "Contact information coming soon.";


    contactList.appendChild(
      message
    );

  }


  section.append(
    title,
    contactList
  );


  return (
    section
  );

};


/* =========================================================
   OPENING HOURS
========================================================= */

/**
 * Creates the opening-hours section.
 *
 * @param {Object} business
 * @returns {HTMLElement}
 */
const createOpeningHours = (
  business
) => {

  const section =
    document.createElement("section");

  section.className =
    "business-detail-section";


  const title =
    document.createElement("h2");

  title.textContent =
    "Opening Hours";


  const list =
    document.createElement("dl");

  list.className =
    "business-hours";


  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
  ];


  days.forEach(
    (day) => {

      const term =
        document.createElement("dt");

      term.textContent =
        formatLabel(
          day
        );


      const value =
        document.createElement("dd");

      value.textContent =
        business.openingHours?.[day] ||
        "Not provided";


      list.append(
        term,
        value
      );

    }
  );


  section.append(
    title,
    list
  );


  return (
    section
  );

};


/* =========================================================
   SERVICES
========================================================= */

/**
 * Creates the services section.
 *
 * @param {Object} business
 * @returns {HTMLElement}
 */
const createServices = (
  business
) => {

  const section =
    document.createElement("section");

  section.className =
    "business-detail-section";


  const title =
    document.createElement("h2");

  title.textContent =
    "Services";


  const list =
    document.createElement("ul");

  list.className =
    "business-services";


  if (
    Array.isArray(business.services) &&
    business.services.length > 0
  ) {

    business.services.forEach(
      (service) => {

        const item =
          document.createElement("li");

        item.textContent =
          service;

        list.appendChild(
          item
        );

      }
    );

  } else {

    const item =
      document.createElement("li");

    item.textContent =
      "Services coming soon.";

    list.appendChild(
      item
    );

  }


  section.append(
    title,
    list
  );


  return (
    section
  );

};


/* =========================================================
   GALLERY
========================================================= */

/**
 * Creates the business image gallery.
 *
 * @param {Object} business
 * @returns {HTMLElement}
 */
const createGallery = (
  business
) => {

  const section =
    document.createElement("section");

  section.className =
    "business-detail-section";


  const title =
    document.createElement("h2");

  title.textContent =
    "Gallery";


  const gallery =
    document.createElement("div");

  gallery.className =
    "business-gallery";


  if (
    Array.isArray(business.images) &&
    business.images.length > 0
  ) {

    business.images.forEach(
      (imageSource, index) => {

        const image =
          document.createElement("img");

        image.src =
          imageSource;

        image.alt =
          `${business.name} gallery image ${index + 1}`;

        image.loading =
          "lazy";


        gallery.appendChild(
          image
        );

      }
    );

  } else {

    const message =
      document.createElement("p");

    message.textContent =
      "Business images coming soon.";


    gallery.appendChild(
      message
    );

  }


  section.append(
    title,
    gallery
  );


  return (
    section
  );

};


/* =========================================================
   SOCIAL LINKS
========================================================= */

/**
 * Creates social-media links.
 *
 * @param {Object} business
 * @returns {HTMLElement}
 */
const createSocialLinks = (
  business
) => {

  const section =
    document.createElement("section");

  section.className =
    "business-detail-section";


  const title =
    document.createElement("h2");

  title.textContent =
    "Follow";


  const links =
    document.createElement("div");

  links.className =
    "business-social-links";


  const social =
    business.social || {};


  const platforms = [
    ["facebook", "Facebook"],
    ["instagram", "Instagram"],
    ["tiktok", "TikTok"]
  ];


  platforms.forEach(
    ([platform, label]) => {

      if (!social[platform]) {
        return;
      }


      const link =
        document.createElement("a");

      link.href =
        social[platform];

      link.target =
        "_blank";

      link.rel =
        "noopener noreferrer";

      link.textContent =
        label;


      links.appendChild(
        link
      );

    }
  );


  if (!links.children.length) {
    return (null);
  }


  section.append(
    title,
    links
  );


  return (
    section
  );

};


/* =========================================================
   RENDERING
========================================================= */

/**
 * Renders the complete business page.
 *
 * @param {Object} business
 */
const renderBusiness = (
  business
) => {

  const profile =
    getElement(
      PROFILE_ID
    );

  const content =
    getElement(
      CONTENT_ID
    );


  if (!profile || !content) {
    return;
  }


  /*
    Remove the loading message.
  */

  const status =
    getElement(
      STATUS_ID
    );


  if (status) {
    status.remove();
  }


  /*
    Render the main profile header.
  */

  profile.appendChild(
    createBusinessHero(
      business
    )
  );


  /*
    Render detailed business information.
  */

  content.append(
    createDescription(
      business
    ),

    createLocation(
      business
    ),

    createContact(
      business
    ),

    createOpeningHours(
      business
    ),

    createServices(
      business
    ),

    createGallery(
      business
    )
  );


  /*
    Social links are optional, so only append the section
    when at least one social platform exists.
  */

  const socialSection =
    createSocialLinks(
      business
    );


  if (socialSection) {

    content.appendChild(
      socialSection
    );

  }

};


/* =========================================================
   INITIALISATION
========================================================= */

/**
 * Starts the business detail page.
 *
 * @returns {Promise<void>}
 */
const initialiseBusinessDetail = async () => {

  try {

    const slug =
      getBusinessSlug();


    if (!slug) {

      throw new Error(
        "Business slug could not be determined."
      );

    }


    /*
      Load both resources simultaneously.
    */

    const [
      businessData,
      consentData
    ] = await Promise.all([

      fetchBusinesses(),

      fetchConsentRecords()

    ]);


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


    /*
      Find the business using its slug.
    */

    const business =
      businessData.businesses.find(
        (record) => (
          record.slug === slug
        )
      );


    if (!business) {

      throw new Error(
        "Business not found."
      );

    }


    /*
      Validate the business before rendering it.
    */

    if (
      !isValidBusiness(
        business
      )
    ) {

      throw new Error(
        "Invalid business record."
      );

    }


    /*
      Check whether the business is active.
    */

    if (
      business.status !== "active"
    ) {

      throw new Error(
        "This business is not currently active."
      );

    }


    /*
      Check whether approved consent exists.
    */

    if (
      !hasApprovedConsent(
        business,
        consentData.consentRecords
      )
    ) {

      throw new Error(
        "This business is not authorised for public listing."
      );

    }


    /*
      Everything passed validation.
    */

    renderBusiness(
      business
    );


  } catch (error) {

    console.error(
      "InVaal business detail error:",
      error
    );


    const profile =
      getElement(
        PROFILE_ID
      );


    const content =
      getElement(
        CONTENT_ID
      );


    if (profile) {
      profile.replaceChildren();
    }


    if (content) {
      content.replaceChildren();
    }


    setStatus(
      "This business could not be found or is not currently available."
    );

  }

};


/* =========================================================
   START
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  initialiseBusinessDetail
);