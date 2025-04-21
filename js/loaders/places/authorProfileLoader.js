const params = new URLSearchParams(window.location.search);
const authorName = params.get("name");

const heading = document.getElementById("author-heading");
const authorDetails = document.getElementById("author-details");
const newsContainer = document.getElementById("author-news-container");

// Load authors
Promise.all([
  fetch("../data/authors.json").then((res) => res.json()),
  fetch("../data/sasolburg.json").then((res) => res.json())
])
.then(([authors, articles]) => {
  const author = authors.find((a) => a.name === authorName);

  // Handle if author not found
  if (!author) {
    heading.textContent = `Author not found`;
    authorDetails.innerHTML = `<p>No profile info available.</p>`;
    return;
  }

  heading.textContent = author.name;

  // Build author profile
  const authorHTML = `
    <div class="author-card">
      ${author.image ? `<img src="${author.image}" alt="${author.name}" class="author-photo">` : ""}
      <div class="author-info">
        ${author.bio ? `<p>${author.bio}</p>` : ""}
        ${author.website ? `<p><a href="${author.website}" target="_blank">Website</a></p>` : ""}
        ${author.social && Object.keys(author.social).length > 0 ? `
          <div class="author-socials">
            ${author.social.youtube ? `<a href="${author.social.youtube}" target="_blank">YouTube</a>` : ""}
            ${author.social.twitter ? `<a href="${author.social.twitter}" target="_blank">Twitter</a>` : ""}
            ${author.social.linkedin ? `<a href="${author.social.linkedin}" target="_blank">Linkedin</a>` : ""}
            ${author.social.instagram ? `<a href="${author.social.instagram}" target="_blank">Instagram</a>` : ""}
            ${author.social.facebook ? `<a href="${author.social.facebook}" target="_blank">Facebook</a>` : ""}
            ${author.social.tiktok ? `<a href="${author.social.tiktok}" target="_blank">TikTok</a>` : ""}
          </div>
        ` : ""}
      </div>
    </div>
  `;
  authorDetails.innerHTML = authorHTML;

  // Filter and show articles by the author
  const authorArticles = articles.filter((item) => item.author === author.name);

  if (authorArticles.length === 0) {
    newsContainer.innerHTML = "<p>No articles found for this author.</p>";
  } else {
    authorArticles.forEach((item) => {
      const card = document.createElement("article");
      card.className = "news-card";
      card.innerHTML = `
        <img src="${item.media.url}" alt="${item.media.alt}" class="news-image">
        <div class="news-content">
          <h2>${item.title}</h2>
          <p>${item.description}</p>
          <p><strong>Date:</strong> ${item.date}</p>
          <a href="${item.link}" target="_blank">Watch Now</a>

          <p><strong>Author:</strong> <a href="author.html?name=${encodeURIComponent(item.author)}">${item.author}</a></p>

          

        </div>
      `;
      newsContainer.appendChild(card);
    });
  }
})
.catch((error) => {
  console.error("Error loading author page:", error);
  authorDetails.innerHTML = "<p>Error loading author profile.</p>";
});
