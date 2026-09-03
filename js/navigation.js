/* =========================================================
   InVaal [016] — Navigation Controller

   File:
   ./js/navigation.js

   Responsibilities:
   - Load the shared header
   - Load the shared footer
   - Initialise mobile navigation
   - Initialise the current year
   - Initialise active navigation links

   Compatible with:
   - Static HTML
   - GitHub Pages
   - Vanilla JavaScript
   - No npm
   - No React
========================================================= */


/* =========================================================
   PATH CONFIGURATION
========================================================= */

/**
 * Determines how many levels we need to go back
 * from the current HTML page to the website root.
 *
 * Examples:
 *
 * /InVaal[016]/index.html
 *        → ./
 *
 * /InVaal[016]/pages/businesses.html
 *        → ../
 *
 * /InVaal[016]/pages/businesses/example.html
 *        → ../../
 *
 * @returns {string}
 */
function getRootPath() {

  const pathname =
    window.location.pathname;


  /*
    Remove the filename from the path.
  */
  const pathWithoutFile =
    pathname.substring(
      0,
      pathname.lastIndexOf("/")
    );


  /*
    Remove empty path segments.
  */
  const segments =
    pathWithoutFile
      .split("/")
      .filter(
        (segment) => segment.length > 0
      );


  /*
    The first segment is normally the
    GitHub Pages repository/project name.

    Example:

    /InVaal[016]/pages/businesses/

    becomes:

    ["InVaal[016]", "pages", "businesses"]
  */

  /*
    If there is only one segment, we're at
    the GitHub Pages project root.
  */
  if (segments.length <= 1) {

    return "./";

  }


  /*
    Every directory below the project root
    requires one ../

    Example:

    /InVaal[016]/pages/

    needs:

    ../
  */

  const directoryDepth =
    segments.length - 1;


  return "../".repeat(
    directoryDepth
  );

}


/* =========================================================
   COMPONENT PATHS
========================================================= */

/*
  Calculate the correct path for the
  current HTML page.
*/
const ROOT_PATH =
  getRootPath();


/*
  Shared component locations.

  These are now calculated relative to
  the current HTML page.

  Examples:

  index.html
  → ./components/header.html

  pages/businesses.html
  → ../components/header.html

  pages/businesses/example.html
  → ../../components/header.html
*/
const HEADER_PATH =
  `${ROOT_PATH}components/header.html`;

const FOOTER_PATH =
  `${ROOT_PATH}components/footer.html`;


/* =========================================================
   SELECTORS
========================================================= */

const HEADER_SELECTOR =
  "#site-header";

const FOOTER_SELECTOR =
  "#site-footer";


/* =========================================================
   LOAD SHARED COMPONENT
========================================================= */

/**
 * Loads an HTML component into a target element.
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


  /*
    If this page does not contain the
    component, do nothing.
  */
  if (!container) {

    return false;

  }


  try {

    console.log(
      `InVaal [016]: Loading ${path}`
    );


    const response =
      await fetch(path);


    /*
      fetch() does not automatically throw
      an error for 404 responses.

      Therefore we check response.ok.
    */
    if (!response.ok) {

      throw new Error(
        `HTTP ${response.status}`
      );

    }


    const html =
      await response.text();


    /*
      Insert the component into the page.
    */
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
   MOBILE NAVIGATION
========================================================= */

/**
 * Initialises the mobile navigation.
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


  /*
    Nothing to initialise if the
    mobile navigation does not exist.
  */
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
    Close the mobile menu after
    selecting a navigation link.
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
 * Inserts the current year into
 * footer elements.
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
 * Marks the current navigation link
 * as active.
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
   INITIALISE NAVIGATION
========================================================= */

/**
 * Main navigation initialisation.
 *
 * @returns {Promise<void>}
 */
async function initialiseNavigation() {

  /*
    Load header first.
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
    Only initialise header functionality
    after the header has actually loaded.
  */
  if (headerLoaded) {

    initialiseMobileNavigation();

    initialiseActiveNavigation();

  }


  /*
    Initialise footer functionality
    after the footer has loaded.
  */
  if (footerLoaded) {

    initialiseCurrentYear();

  }

}


/* =========================================================
   START
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

  initialiseMobileNavigation,

  initialiseCurrentYear,

  initialiseActiveNavigation,

  getRootPath

};
