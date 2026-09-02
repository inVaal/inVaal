/**
 * Opportunity-loader
 * 
 */ 

let opportunities = [];


const container =
  document.getElementById("opportunities");

const searchInput =
  document.getElementById("searchInput");

const categoryFilter =
  document.getElementById("categoryFilter");

const resultCount =
  document.getElementById("resultCount");



/*
  Load the external opportunity database.

  This keeps the HTML separate from the data,
  meaning we can update opportunities.json
  without rebuilding this page.
*/

fetch("../data/opportunities.json")

  .then(response => {

    if (!response.ok) {

      throw new Error(
        "Database unavailable"
      );

    }

    return response.json();

  })

  .then(data => {

    opportunities =
      data.opportunities || [];

    buildCategories();

    render();

  })

  .catch(error => {

    console.error(error);

    container.innerHTML =
      '<div class="empty">' +
      'Unable to load the opportunities database.' +
      '</div>';

  });



/*
  Automatically create the category
  dropdown from the JSON database.
*/

function buildCategories(){

  const categories = [

    ...new Set(

      opportunities

        .map(item => item.category)

        .filter(Boolean)

    )

  ].sort();


  categories.forEach(category => {

    const option =
      document.createElement("option");

    option.value = category;

    option.textContent = category;

    categoryFilter.appendChild(option);

  });

}



/*
  Filter and display opportunities.
*/

function render(){

  const query =
    searchInput.value
      .trim()
      .toLowerCase();

  const category =
    categoryFilter.value;


  const filtered =
    opportunities.filter(item => {

      const searchable = [

        item.title,

        item.organisation,

        item.category,

        item.audience,

        item.description,

        item.location,

        ...(item.tags || [])

      ]

      .join(" ")
      .toLowerCase();


      return (

        (!query ||
          searchable.includes(query))

        &&

        (
          category === "all" ||
          item.category === category
        )

      );

    });


  resultCount.textContent =

    `${filtered.length} opportunity` +

    `${filtered.length === 1 ? "" : "ies"} found`;


  if(!filtered.length){

    container.innerHTML =
      '<div class="empty">' +
      'No opportunities match your search.' +
      '</div>';

    return;

  }


  container.innerHTML =
    filtered
      .map(createCard)
      .join("");

}



/*
  Build an individual opportunity card.
*/

function createCard(item){

  return `

    <article class="card">

      <span class="tag">
        ${escapeHtml(
          item.category || "Opportunity"
        )}
      </span>


      <h2>
        ${escapeHtml(item.title)}
      </h2>


      <div class="org">
        ${escapeHtml(item.organisation)}
      </div>


      <div class="meta">

        <strong>For:</strong>

        ${escapeHtml(
          item.audience ||
          "See official requirements"
        )}

      </div>


      <div class="meta">

        <strong>Location:</strong>

        ${escapeHtml(
          item.location ||
          "See eligibility"
        )}

      </div>


      <div class="meta">

        <strong>Deadline:</strong>

        ${escapeHtml(
          item.deadline ||
          "Check official source"
        )}

      </div>


      <p class="description">

        ${escapeHtml(
          item.description || ""
        )}

      </p>


      <div class="meta">

        <strong>
          Last verified:
        </strong>

        ${escapeHtml(
          item.last_verified ||
          "Not specified"
        )}

      </div>


      <div class="actions">

        <a
          class="btn primary"
          href="${safeUrl(item.official_url)}"
          target="_blank"
          rel="noopener noreferrer"
        >
          Official Source ↗
        </a>


        ${
          item.details_url

          ?

          `<a
            class="btn secondary"
            href="${safeUrl(item.details_url)}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Details ↗
          </a>`

          :

          ""

        }

      </div>

    </article>

  `;

}



/*
  Only allow HTTP/HTTPS links.
*/

function safeUrl(url){

  return (

    url &&
    /^https?:\/\//i.test(url)

  )

    ? escapeHtml(url)

    : "#";

}



/*
  Protect the page from HTML being
  injected through JSON content.
*/

function escapeHtml(value){

  return String(value ?? "")

    .replaceAll("&","&amp;")

    .replaceAll("<","&lt;")

    .replaceAll(">","&gt;")

    .replaceAll('"',"&quot;")

    .replaceAll("'","&#039;");

}



/*
  Live search and filtering.
*/

searchInput.addEventListener(
  "input",
  render
);

categoryFilter.addEventListener(
  "change",
  render
);
