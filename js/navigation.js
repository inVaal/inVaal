/* ============================================================
  InVaal [016] — Component Loader + Mobile Navigation
  File: js/navigation.js

  This script replaces the old "mobile-menu.js" approach.
  It:
  - Injects header/footer components
  - Handles mobile menu toggling
  - Updates the footer year
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const headerMount = document.getElementById("site-header");
  const footerMount = document.getElementById("site-footer");

  /* ----------------------------------------------------------
    Fetch + inject an HTML component into a mount element
  ---------------------------------------------------------- */
  async function loadComponent(mountEl, path) {
    if (!mountEl) return;

    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) throw new Error(`Failed to load ${path} (${response.status})`);

    mountEl.innerHTML = await response.text();
  }

  /* ----------------------------------------------------------
    Mobile menu setup (works with new header.html)
  ---------------------------------------------------------- */
  function initMobileMenu() {
    const toggleBtn = document.querySelector(".mobile-menu-toggle");
    const menu = document.getElementById("primary-menu");

    if (!toggleBtn || !menu) return;

    const setOpen = (isOpen) => {
      toggleBtn.setAttribute("aria-expanded", String(isOpen));
      menu.classList.toggle("is-open", isOpen);
    };

    toggleBtn.addEventListener("click", () => {
      const isOpen = toggleBtn.getAttribute("aria-expanded") === "true";
      setOpen(!isOpen);
    });

    // Close menu after clicking a link
    menu.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;
      setOpen(false);
    });

    // Close when resizing to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) setOpen(false);
    });

    setOpen(false);
  }

  /* ----------------------------------------------------------
    Footer year updater
  ---------------------------------------------------------- */
  function setFooterYear() {
    const yearEl = document.getElementById("year");
    if (!yearEl) return;
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* ----------------------------------------------------------
    Boot
  ---------------------------------------------------------- */
  (async () => {
    try {
      await loadComponent(headerMount, "./components/header.html");
      initMobileMenu();
    } catch (err) {
      console.error("Header load failed:", err);
    }

    try {
      await loadComponent(footerMount, "./components/footer.html");
      setFooterYear();
    } catch (err) {
      console.error("Footer load failed:", err);
    }
  })();
});