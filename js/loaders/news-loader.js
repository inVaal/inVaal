 /* =========================================================
    InVaal [016] — News Loader

    Responsibilities:
    - Load news.json
    - Validate the returned data
    - Display published stories
    - Highlight featured stories
    - Handle loading and error states

    Data source:
    ./data/news.json
 ========================================================== */


 /* =========================================================
    CONFIGURATION
 ========================================================== */

 const NEWS_DATA_URL = "./data/news.json";

 const NEWS_CONTAINER_ID = "news-container";

 const NEWS_STATUS_ID = "news-status";


 /* =========================================================
    DOM HELPERS
 ========================================================== */

 /**
  * Finds an element by its ID.
  *
  * @param {string} id
  * @returns {HTMLElement|null}
  */
 const getElement = (id) => (
   document.getElementById(id)
 );


 /**
  * Updates the news status message.
  *
  * @param {string} message
  * @param {string} type
  * @returns {void}
  */
 const updateNewsStatus = (
   message,
   type = "default"
 ) => {

   const status = getElement(
     NEWS_STATUS_ID
   );

   if (!status) {
     return;
   }

   status.textContent = message;

   status.dataset.status = type;

 };


 /* =========================================================
    DATA LOADING
 ========================================================== */

 /**
  * Loads the news JSON file.
  *
  * @returns {Promise<Object>}
  */
 const fetchNews = async () => {

   const response = await fetch(
     NEWS_DATA_URL
   );


   /*
     fetch() does not automatically reject for HTTP errors.

     Therefore we explicitly check response.ok.
   */

   if (!response.ok) {

     throw new Error(
       `Unable to load news: ${response.status}`
     );

   }


   return (
     response.json()
   );

 };


 /* =========================================================
    DATA VALIDATION
 ========================================================== */

 /**
  * Checks whether a news item contains the minimum
  * information required to display it.
  *
  * @param {Object} story
  * @returns {boolean}
  */
 const isValidStory = (story) => (

   Boolean(
     story &&
     story.id &&
     story.title &&
     story.excerpt &&
     story.datePublished
   )

 );


 /**
  * Returns only published and valid stories.
  *
  * @param {Array} stories
  * @returns {Array}
  */
 const getPublishedStories = (
   stories = []
 ) => (

   stories.filter(
     (story) => (
       story.status === "published" &&
       isValidStory(story)
     )
   )

 );


 /* =========================================================
    FORMATTING
 ========================================================== */

 /**
  * Converts an ISO date into a readable South African
  * style date.
  *
  * @param {string} date
  * @returns {string}
  */
 const formatDate = (date) => {

   const parsedDate = new Date(date);

   if (Number.isNaN(parsedDate.getTime())) {
     return "Date unavailable";
   }


   return (
     new Intl.DateTimeFormat(
       "en-ZA",
       {
         day: "numeric",
         month: "short",
         year: "numeric"
       }
     ).format(parsedDate)
   );

 };


 /* =========================================================
    CARD CREATION
 ========================================================== */

 /**
  * Creates the HTML for one news card.
  *
  * @param {Object} story
  * @returns {HTMLElement}
  */
 const createNewsCard = (
   story
 ) => {

   const article = document.createElement(
     "article"
   );


   article.className = "content-card news-card";


   /*
     Add featured information to the card so CSS can
     style featured stories differently later.
   */

   if (story.featured) {

     article.classList.add(
       "is-featured"
     );

   }


   /* -------------------------------------------------------
      Image
   ------------------------------------------------------- */

   if (story.image) {

     const imageWrapper =
       document.createElement("div");

     imageWrapper.className =
       "card-media";


     const image =
       document.createElement("img");

     image.src = story.image;

     image.alt =
       story.title;

     image.loading = "lazy";


     imageWrapper.appendChild(
       image
     );

     article.appendChild(
       imageWrapper
     );

   }


   /* -------------------------------------------------------
      Card body
   ------------------------------------------------------- */

   const body =
     document.createElement("div");

   body.className =
     "card-body";


   /* Category */

   const category =
     document.createElement("span");

   category.className =
     "card-category";

   category.textContent =
     story.category || "News";


   /* Title */

   const title =
     document.createElement("h3");

   title.className =
     "news-card-title";

   title.textContent =
     story.title;


   /* Excerpt */

   const excerpt =
     document.createElement("p");

   excerpt.className =
     "card-description";

   excerpt.textContent =
     story.excerpt;


   /* Metadata */

   const metadata =
     document.createElement("div");

   metadata.className =
     "card-meta";


   const location =
     document.createElement("span");

   location.textContent =
     story.location || "Vaal Triangle";


   const date =
     document.createElement("time");

   date.dateTime =
     story.datePublished;

   date.textContent =
     formatDate(
       story.datePublished
     );


   metadata.append(
     location,
     date
   );


   /* -------------------------------------------------------
      Read more link

      The slug gives us a future path to an individual
      article page.
   ------------------------------------------------------- */

   const link =
     document.createElement("a");

   link.className =
     "section-link";

   link.href =
     `./pages/news/${story.slug}.html`;

   link.textContent =
     "Read story →";


   /* -------------------------------------------------------
      Assemble card
   ------------------------------------------------------- */

   body.append(
     category,
     title,
     excerpt,
     metadata,
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
    RENDERING
 ========================================================== */

 /**
  * Renders news cards into the homepage.
  *
  * @param {Array} stories
  * @returns {void}
  */
 const renderNews = (
   stories
 ) => {

   const container =
     getElement(
       NEWS_CONTAINER_ID
     );


   if (!container) {
     return;
   }


   /*
     Clear the loading state before rendering.
   */

   container.replaceChildren();


   /*
     Limit homepage content.

     The complete news archive will eventually live on
     pages/news.html.
   */

   const homepageStories =
     stories.slice(0, 6);


   homepageStories.forEach(
     (story) => {

       const card =
         createNewsCard(
           story
         );

       container.appendChild(
         card
       );

     }
   );


   updateNewsStatus(
     `${homepageStories.length} stories available.`,
     "success"
   );

 };


 /* =========================================================
    INITIALISATION
 ========================================================== */

 /**
  * Starts the news system.
  *
  * @returns {Promise<void>}
  */
 const initialiseNews = async () => {

   updateNewsStatus(
     "Loading latest stories..."
   );


   try {

     const data =
       await fetchNews();


     /*
       Make sure the expected JSON structure exists.
     */

     if (
       !data ||
       !Array.isArray(
         data.stories
       )
     ) {

       throw new Error(
         "Invalid news data format."
       );

     }


     const stories =
       getPublishedStories(
         data.stories
       );


     if (!stories.length) {

       updateNewsStatus(
         "No news stories are currently available.",
         "empty"
       );

       return;

     }


     /*
       Sort newest stories first.

       This means we don't have to manually reorder
       the JSON every time we add a new article.
     */

     stories.sort(
       (a, b) => (
         new Date(b.datePublished) -
         new Date(a.datePublished)
       )
     );


     renderNews(
       stories
     );


   } catch (error) {

     console.error(
       "InVaal news error:",
       error
     );


     updateNewsStatus(
       "We couldn't load the latest stories. Please try again later.",
       "error"
     );

   }

 };


 /* =========================================================
    START
 ========================================================== */

 document.addEventListener(
   "DOMContentLoaded",
   initialiseNews
 );