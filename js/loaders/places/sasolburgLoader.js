// js/loaders/places/sasolburgLoader.js

// DOM elements
const container = document.getElementById('sasolburg-news-container');
const categoryFilter = document.getElementById('news-category');
const searchInput = document.getElementById('search-news');

// Store data globally so we can filter it
let allNews = [];

// Fetch news from sasolburg.json
fetch('data/sasolburg.json') // Adjust the path if needed
  .then((response) => response.json())
  .then((data) => {
    allNews = data;
    renderNews(allNews); // Initial rendering
  })
  .catch((error) => {
    console.error('Error loading Sasolburg news:', error);
  });

/**
 * Render news items into the DOM
 */
function renderNews(newsList) {
  container.innerHTML = ''; // Clear previous content

  if (newsList.length === 0) {
    container.innerHTML = '<p>No news articles found.</p>';
    return;
  }

  newsList.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'news-card';

    card.innerHTML = `
      <img src="${item.media.url}" alt="${item.media.alt}" class="news-image">
      <div class="news-content">
        <h2>${item.title}</h2>
        <p>${item.description}</p>
        <p><strong>Author:</strong>
        <a href="../author.html?name=${encodeURIComponent(item.author)}">
        ${item.author}
        </a></p>
        <p><strong>Date:</strong> ${item.date}</p>
        <a href="${item.link}" target="_blank" rel="noopener noreferrer">Watch Now</a>
      </div>
    `;

    container.appendChild(card);
  });
}

/**
 * Filter and search news dynamically
 */
function filterAndSearchNews() {
  const selectedCategory = categoryFilter.value;
  const searchTerm = searchInput.value.toLowerCase();

  const filteredNews = allNews.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  renderNews(filteredNews);
}

// Event listeners for filtering and searching
categoryFilter.addEventListener('change', filterAndSearchNews);
searchInput.addEventListener('input', filterAndSearchNews);
