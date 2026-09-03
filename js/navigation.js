/* =========================================================
   InVaal [016] — Navigation Controller

   File:
   ./js/navigation.js

   Responsibilities:
   - Load the shared header
   - Load the shared footer
   - Resolve shared navigation paths
   - Resolve the shared logo path
   - Initialise mobile navigation
   - Initialise current year
   - Initialise active navigation

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

const HEADER_FILE =
  "components/header.html";

const FOOTER_FILE =
  "components/footer.html";

const LOGO_FILE =
  "assets/logos/inVaalTriangle_logo.png";


/* =========================================================
   SITE ROOT
========================================================= */

/**
 * Determines the root of the website.
 *
 * Examples:
 *
 * /InVaal[016]/
 *
 * /InVaal[016]/pages/
 *
 * /InVaal[016]/pages/businesses/
 *
 * All of these should resolve back to:
 *
 * /InVaal[016]/
 *
 * @returns {string}
 */
function getSiteRoot() {

  const pathname =
    window.location.pathname;


  /*
    Find the first directory after
    the domain name.

    Example:

    /InVaal[016]/pages/businesses/example.html

    becomes:

    InVaal[016]
  */
  const segments =
    pathname
      .split("/")
      .filter(
        (segment) => segment.length > 0
      );


  /*
    If there is no project directory,
    the site is running from the domain root.
  */
  if (!segments.length) {

    return "/";

  }


  /*
    GitHub Pages project root.

    Example:

    /InVaal[016]/
  */
  return `/${segments[0]}/`;

}


/*
  Store the site root once.
*/
const SITE_ROOT =
  getSiteRoot();


/* =========================================================
   COMPONENT PATHS
========================================================= */

const HEADER_PATH =
  `${SITE_ROOT}${HEADER_FILE}`;

const FOOTER_PATH =
  `${SITE_ROOT}${FOOTER_FILE}`;


/* =========================================================
   SELECTORS
========================================================= */

const HEADER_SELECTOR =
  "#site-header";

const FOOTER_SELECTOR =
  "#site-footer";


/* =========================================================
   LOAD COMPONENT
========================================================= */

/**
 * Loads an HTML component into the page.
 *
 * @param {string} selector
 * @param {string} path
 * @returns {Promise<boolean>}
 */
async function loadComponent(
  selector,
  path
) {

  const container =
    document.querySelector(
      selector
    );


  if (!container) {

    return false;

  }


  try {

    console.log(
      `InVaal [016]: Loading ${path}`
    );


    const response =
      await fetch(path);


    if (!response.ok) {

      throw new Error(
        `HTTP ${response.status}`
      );

    }


    const html =
      await response.text();


    container.innerHTML =
      html;


    return true;

  } catch (error) {

    console.error(
      `InVaal [016]: Failed to load component: ${path}`,
      error
    );


    return false;

  }

}


/* =========================================================
   SITE LINKS
========================================================= */

/**
 * Converts data-site-link attributes into
 * correct website URLs.
 *
 * Example:
 *
 * data-site-link="pages/businesses.html"
 *
 * becomes:
 *
 * /InVaal[016]/pages/businesses.html
 *
 * This works from every page depth.
 *
 * @returns {void}
 */
function initialiseSiteLinks() {

  const links =
    document.querySelectorAll(
      "[data-site-link]"
    );


  if (!links.length) {

    return;

  }


  links.forEach(
    (link) => {

      const target =
        link.getAttribute(
          "data-site-link"
        );


      if (!target) {

        return;

      }


      /*
        Remove leading ./ or / so that
        the path can be safely rebuilt.
      */
      const cleanTarget =
        target.replace(
          /^\.?\//,
          ""
        );


      /*
        Build the final URL from the
        website root.
      */
      link.href =
        `${SITE_ROOT}${cleanTarget}`;

    }
  );

}


/* =========================================================
   SITE LOGO
========================================================= */

/**
 * Sets the correct path for the global logo.
 *
 * @returns {void}
 */
function initialiseSiteLogo() {

  const logos =
    document.querySelectorAll(
      "[data-site-logo]"
    );


  if (!logos.length) {

    return;

  }


  logos.forEach(
    (logo) => {

      logo.src =
        `${SITE_ROOT}${LOGO_FILE}`;

    }
  );

}


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

/**
 * Initialises the mobile navigation menu.
 *
 * @returns {void}
 */
function initialiseMobileNavigation() {

  const menuToggle =
    document.querySelector(
      "#mobile-menu-toggle"
    );


  const mobileNavigation =
    document.querySelector(
      "#mobile-navigation"
    );


  if (
    !menuToggle ||
    !mobileNavigation
  ) {

    return;

  }


  menuToggle.addEventListener(
    "click",
    () => {

      const isOpen =
        menuToggle.getAttribute(
          "aria-expanded"
        ) === "true";


      menuToggle.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );


      mobileNavigation.hidden =
        isOpen;


      menuToggle.setAttribute(
        "aria-label",
        isOpen
          ? "Open navigation menu"
          : "Close navigation menu"
      );

    }
  );


  /*
    Close mobile navigation after
    selecting a link.
  */
  const mobileLinks =
    mobileNavigation.querySelectorAll(
      "a"
    );


  mobileLinks.forEach(
    (link) => {

      link.addEventListener(
        "click",
        () => {

          menuToggle.setAttribute(
            "aria-expanded",
            "false"
          );


          menuToggle.setAttribute(
            "aria-label",
            "Open navigation menu"
          );


          mobileNavigation.hidden =
            true;

        }
      );

    }
  );

}


/* =========================================================
   CURRENT YEAR
========================================================= */

/**
 * Inserts the current year into footer elements.
 *
 * @returns {void}
 */
function initialiseCurrentYear() {

  const yearElements =
    document.querySelectorAll(
      "[data-current-year]"
    );


  if (!yearElements.length) {

    return;

  }


  const currentYear =
    new Date().getFullYear();


  yearElements.forEach(
    (element) => {

      element.textContent =
        currentYear;

    }
  );

}


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

/**
 * Marks the current navigation link as active.
 *
 * @returns {void}
 */
function initialiseActiveNavigation() {

  const navigationLinks =
    document.querySelectorAll(
      ".site-navigation a, .mobile-navigation a"
    );


  if (!navigationLinks.length) {

    return;

  }


  const currentPath =
    window.location.pathname;


  navigationLinks.forEach(
    (link) => {

      const linkURL =
        new URL(
          link.href,
          window.location.origin
        );


      if (
        linkURL.pathname ===
        currentPath
      ) {

        link.classList.add(
          "is-active"
        );


        link.setAttribute(
          "aria-current",
          "page"
        );

      }

    }
  );

}


/* =========================================================
   MAIN INITIALISATION
========================================================= */

/**
 * Main navigation initialisation.
 *
 * @returns {Promise<void>}
 */
async function initialiseNavigation() {

  /*
    Load header.
  */
  const headerLoaded =
    await loadComponent(
      HEADER_SELECTOR,
      HEADER_PATH
    );


  /*
    Load footer.
  */
  const footerLoaded =
    await loadComponent(
      FOOTER_SELECTOR,
      FOOTER_PATH
    );


  /*
    Header must be loaded before
    these functions can find its elements.
  */
  if (headerLoaded) {

    initialiseSiteLinks();

    initialiseSiteLogo();

    initialiseMobileNavigation();

    initialiseActiveNavigation();

  }


  /*
    Footer must be loaded before
    searching for its year element.
  */
  if (footerLoaded) {

    initialiseCurrentYear();

  }

}


/* =========================================================
   START NAVIGATION
========================================================= */

if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initialiseNavigation
  );

} else {

  initialiseNavigation();

}


/* =========================================================
   DEVELOPMENT ACCESS
========================================================= */

window.InVaalNavigation = {

  initialise:
    initialiseNavigation,

  loadComponent,

  initialiseSiteLinks,

  initialiseSiteLogo,

  initialiseMobileNavigation,

  initialiseCurrentYear,

  initialiseActiveNavigation,

  getSiteRoot

};
