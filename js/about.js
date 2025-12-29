/* ============================================================
  InVaal [016] — About Page Loader
  File: js/about.js

  Purpose:
  - Fetch company information from: data/company_inf.json
  - Populate:
      #motto
      #cities-list
      #provinces-list
  - Optional (if you add it later):
      #contact-block
      #social-block

  Notes:
  - This script is safe: it exits gracefully if elements are missing
============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const DATA_URL = "./data/company_inf.json";

  // Page elements (new About layout)
  const mottoEl = document.getElementById("motto");
  const citiesList = document.getElementById("cities-list");
  const provincesList = document.getElementById("provinces-list");

  // Optional blocks (only used if you add them in HTML later)
  const contactBlock = document.getElementById("contact-block");
  const socialBlock = document.getElementById("social-block");

  /* ----------------------------------------------------------
    Helper: Safe element text update
  ---------------------------------------------------------- */
  function setText(el, value) {
    if (!el) return;
    el.textContent = String(value ?? "");
  }

  /* ----------------------------------------------------------
    Helper: Render a list safely (clears before rendering)
  ---------------------------------------------------------- */
  function renderList(listEl, items) {
    if (!listEl) return;
    listEl.innerHTML = "";

    if (!Array.isArray(items) || items.length === 0) {
      const li = document.createElement("li");
      li.textContent = "No data available yet.";
      listEl.appendChild(li);
      return;
    }

    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = String(item);
      listEl.appendChild(li);
    });
  }

  /* ----------------------------------------------------------
    Helper: Only create a link if URL exists and isn't "#"
  ---------------------------------------------------------- */
  function createLink(label, url) {
    const href = String(url ?? "").trim();
    if (!href || href === "#") return null;

    const a = document.createElement("a");
    a.href = href;
    a.textContent = label;

    // If external, open safely in a new tab
    const isExternal = /^https?:\/\//i.test(href);
    if (isExternal) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }

    return a;
  }

  /* ----------------------------------------------------------
    Main loader
  ---------------------------------------------------------- */
  async function loadCompanyInfo() {
    try {
      const resolved = new URL(DATA_URL, document.baseURI).toString();
      const response = await fetch(resolved, { cache: "no-store" });

      if (!response.ok) {
        throw new Error(`Failed to load ${DATA_URL} (${response.status})`);
      }

      const data = await response.json();
      const company = data?.company;

      if (!company) {
        throw new Error("Invalid JSON: missing 'company' object.");
      }

      // Motto (only if your JSON provides it)
      const mottoLine = [company.motto, company.motto_text].filter(Boolean).join(" ");
      setText(mottoEl, mottoLine);

      // Coverage
      renderList(citiesList, company?.location?.cities);
      renderList(provincesList, company?.location?.states);

      // Optional: Contact (only if HTML has #contact-block)
      if (contactBlock) {
        contactBlock.innerHTML = "";

        const email = company?.contact?.email;
        const website = company?.website;

        const h = document.createElement("h3");
        h.textContent = "Get in Touch";
        contactBlock.appendChild(h);

        if (email) {
          const p = document.createElement("p");
          const a = createLink(email, `mailto:${email}`);
          p.textContent = "Email: ";
          if (a) p.appendChild(a);
          contactBlock.appendChild(p);
        }

        if (website) {
          const p = document.createElement("p");
          const a = createLink(website, website);
          p.textContent = "Website: ";
          if (a) p.appendChild(a);
          contactBlock.appendChild(p);
        }

        // If nothing to show, hide the block
        if (!email && !website) {
          contactBlock.style.display = "none";
        }
      }

      // Optional: Social links (only if HTML has #social-block)
      if (socialBlock) {
        socialBlock.innerHTML = "";

        const social = company?.contact?.social_media;
        if (!social || typeof social !== "object") {
          socialBlock.style.display = "none";
          return;
        }

        const title = document.createElement("h3");
        title.textContent = "Follow Us";
        socialBlock.appendChild(title);

        const wrap = document.createElement("div");
        wrap.className = "social-links";

        Object.entries(social).forEach(([platform, url]) => {
          const link = createLink(platform, url);
          if (!link) return;

          // Optional: better label formatting
          link.textContent = platform.charAt(0).toUpperCase() + platform.slice(1);
          wrap.appendChild(link);
        });

        if (wrap.children.length === 0) {
          socialBlock.style.display = "none";
        } else {
          socialBlock.appendChild(wrap);
        }
      }
    } catch (error) {
      console.error("Error loading company information:", error);

      // Friendly fallback text if motto exists
      if (mottoEl && !mottoEl.textContent.trim()) {
        mottoEl.textContent = "Trusted local reporting for the Vaal Triangle.";
      }
    }
  }

  loadCompanyInfo();
});