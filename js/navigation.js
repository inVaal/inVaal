/* =========================================================
   InVaal [016] — Navigation Controller

   File:
   ./js/navigation.js

   Responsibilities:
   - Load the shared header
   - Load the shared footer
   - Initialise the mobile navigation
   - Initialise the current year in the footer
   - Handle navigation only on pages that actually
     contain #site-header and/or #site-footer

   Important:
   - Secondary pages such as:
       ./pages/contact.html
       ./pages/terms.html
       ./pages/privacy.html

     do NOT use the shared navigation/footer.

   - Therefore this file does not try to calculate
     ../ paths for secondary pages.

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

// Shared component locations.
//
// navigation.js is normally loaded from:
//
// ./index.html
//
// Therefore these paths are relative to the website root.
const HEADER_PATH =
  "./components/header.html";

const FOOTER_PATH =
  "./components/footer.html";


/* =========================================================
   SELECTORS
========================================================= */

// Header and footer containers.
//
// Example:
//
// <header id="site-header"></header>
// <footer id="site-footer"></footer>

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
 * This is used for the shared header and footer.
 *
 * @param {string} selector
 * @param {string} path
 * @returns {Promise<boolean>}
 */
async function loadComponent(selector, path) {

  const container =
    document.querySelector(selector);

  /*
    If the page does not contain this component,
    simply skip it.

    This is important because pages such as
    terms.html and privacy.html intentionally
    do not have a shared header/footer.
  */
  if (!container) {
    return false;
  }


  try {

    const response =
      await fetch(path);


    if (!response.ok) {

      throw new Error(
        `Unable to load ${path} (${response.status})`
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
   MOBILE NAVIGATION
========================================================= */

/**
 * Initialises the mobile navigation menu.
 *
 * Expected HTML:
 *
 * #mobile-menu-toggle
 * #mobile-navigation
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
    If the page does not contain the mobile
    navigation, there is nothing to initialise.
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


      /*
        Toggle the aria-expanded state.

        false → true
        true → false
      */
      menuToggle.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );


      /*
        hidden=true means the menu is hidden.

        Therefore we reverse the current state.
      */
      mobileNavigation.hidden =
        isOpen;


      /*
        Update the accessible button label.
      */
      menuToggle.setAttribute(
        "aria-label",
        isOpen
          ? "Open navigation menu"
          : "Close navigation menu"
      );

    }
  );


  /*
    Close the mobile menu when a navigation
    link is selected.
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
 * Expected HTML:
 *
 * <span data-current-year></span>
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
   ACTIVE NAVIGATION LINK
========================================================= */

/**
 * Marks the current navigation link as active.
 *
 * This allows CSS to highlight the page currently
 * being viewed.
 *
 * Expected HTML:
 *
 * <a href="./pages/businesses.html">Businesses</a>
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


  /*
    Get the current page path.
  */
  const currentPath =
    window.location.pathname;


  navigationLinks.forEach(
    (link) => {

      const linkURL =
        new URL(
          link.href,
          window.location.origin
        );


      /*
        Compare the URL path with the
        current page path.
      */
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
 * Main navigation initialisation function.
 *
 * Loads the shared header/footer first and then
 * initialises the functionality they contain.
 *
 * @returns {Promise<void>}
 */
async function initialiseNavigation() {

  /*
    Load the header.
  */
  await loadComponent(
    HEADER_SELECTOR,
    HEADER_PATH
  );


  /*
    Load the footer.
  */
  await loadComponent(
    FOOTER_SELECTOR,
    FOOTER_PATH
  );


  /*
    The header/footer now exist in the DOM,
    so their functionality can be initialised.
  */
  initialiseMobileNavigation();

  initialiseCurrentYear();

  initialiseActiveNavigation();

}


/* =========================================================
   START NAVIGATION
========================================================= */

/*
  Wait until the DOM is ready before attempting
  to load the shared components.
*/

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
   OPTIONAL DEVELOPMENT ACCESS
========================================================= */

/*
  Expose the main function for development/debugging.

  From the browser console you can run:

  InVaalNavigation.initialise();

  This is optional and can be removed later
  for production if you prefer.
*/

window.InVaalNavigation = {
  initialise: initialiseNavigation,
  loadComponent,
  initialiseMobileNavigation,
  initialiseCurrentYear,
  initialiseActiveNavigation
};
