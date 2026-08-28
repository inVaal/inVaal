/* =========================================================
   InVaal [016] — Global Navigation System

   ./js/navigation.js
   Responsibilities:
   - Load header component
   - Load footer component
   - Initialise mobile navigation
   - Set current year
   - Prevent duplicate initialisation
========================================================= */


/* =========================================================
   CONFIGURATION
========================================================= */

const HEADER_SELECTOR = "#site-header";
const FOOTER_SELECTOR = "#site-footer";

const HEADER_PATH = "./components/header.html";
const FOOTER_PATH = "./components/footer.html";


/* =========================================================
   COMPONENT LOADER
========================================================= */

/**
 * Loads an HTML component into a target element.
 *
 * @param {string} selector
 * @param {string} path
 * @returns {Promise<boolean>}
 */
const loadComponent = async (
  selector,
  path
) => {

  const target =
    document.querySelector(selector);


  /*
    If the target does not exist, there is nowhere
    to inject the component.
  */

  if (!target) {
    return (false);
  }


  /*
    Prevent the same component from being injected
    more than once.
  */

  if (
    target.dataset.loaded === "true"
  ) {
    return (true);
  }


  try {

    const response =
      await fetch(path);


    if (!response.ok) {

      throw new Error(
        `HTTP ${response.status}: ${path}`
      );

    }


    const html =
      await response.text();


    /*
      Replace the contents of the mount point.

      replaceChildren() ensures that we don't accidentally
      append a second copy of the component.
    */

    target.replaceChildren();


    target.insertAdjacentHTML(
      "afterbegin",
      html
    );


    /*
      Mark this component as loaded.

      If initialiseNavigation() is accidentally called
      again, this prevents another injection.
    */

    target.dataset.loaded = "true";


    return (true);

  } catch (error) {

    console.error(
      "InVaal component error:",
      error
    );


    return (false);

  }

};


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

/**
 * Initialises the mobile navigation.
 *
 * @returns {void}
 */
const initialiseMobileNavigation = () => {

  const toggle =
    document.querySelector(
      "#mobile-menu-toggle"
    );


  const menu =
    document.querySelector(
      "#mobile-navigation"
    );


  if (!toggle || !menu) {
    return;
  }


  /*
    Prevent duplicate event listeners.

    This is important if the navigation script is
    accidentally triggered more than once.
  */

  if (
    toggle.dataset.initialised === "true"
  ) {
    return;
  }


  toggle.dataset.initialised =
    "true";


  toggle.addEventListener(
    "click",
    () => {

      const isOpen =
        toggle.getAttribute(
          "aria-expanded"
        ) === "true";


      const nextState =
        !isOpen;


      toggle.setAttribute(
        "aria-expanded",
        String(nextState)
      );


      toggle.setAttribute(
        "aria-label",
        nextState
          ? "Close navigation menu"
          : "Open navigation menu"
      );


      menu.hidden =
        !nextState;

    }
  );


  /*
    Close the mobile navigation when the visitor
    selects a page.
  */

  menu
    .querySelectorAll("a")
    .forEach((link) => {

      link.addEventListener(
        "click",
        () => {

          toggle.setAttribute(
            "aria-expanded",
            "false"
          );


          toggle.setAttribute(
            "aria-label",
            "Open navigation menu"
          );


          menu.hidden =
            true;

        }
      );

    });

};


/* =========================================================
   CURRENT YEAR
========================================================= */

/**
 * Updates the footer copyright year.
 *
 * @returns {void}
 */
const initialiseCurrentYear = () => {

  const year =
    document.querySelector(
      "#current-year"
    );


  if (!year) {
    return;
  }


  year.textContent =
    new Date().getFullYear();

};


/* =========================================================
   NAVIGATION INITIALISATION
========================================================= */

let navigationInitialised = false;


/**
 * Starts the global navigation system.
 *
 * @returns {Promise<void>}
 */
const initialiseNavigation = async () => {

  /*
    Absolute protection against duplicate execution.
  */

  if (navigationInitialised) {
    return;
  }


  navigationInitialised =
    true;


  /*
    Load header and footer simultaneously.

    Promise.all() prevents us from unnecessarily waiting
    for the header before requesting the footer.
  */

  await Promise.all([

    loadComponent(
      HEADER_SELECTOR,
      HEADER_PATH
    ),

    loadComponent(
      FOOTER_SELECTOR,
      FOOTER_PATH
    )

  ]);


  /*
    Components now exist in the DOM.
  */

  initialiseMobileNavigation();

  initialiseCurrentYear();

};


/* =========================================================
   START
========================================================= */

/*
  The script uses defer, so DOMContentLoaded will normally
  still be available.

  The readyState check also protects us if the script is
  loaded after the DOM has already finished loading.
*/

if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initialiseNavigation,
    {
      once: true
    }
  );

} else {

  initialiseNavigation();

}