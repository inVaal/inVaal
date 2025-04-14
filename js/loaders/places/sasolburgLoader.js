// Get reference to the container where news will be displayed
const container = document.getElementById('sasolburg-news-container');

// Fetch data from the JSON file
fetch('../../data/sasolburg.json') // Adjust path if your JSON file is elsewhere
  .then(response => response.json())
  .then(data => {
    displayNews(data); // Call function to build the news cards
  })
  .catch(error => {
    console.error('Error loading Sasolburg news:', error);
    container.innerHTML = '<p>Failed Please try again later.</p>';
  });


// Function to display each news item
function displayNews(newsArray) {
  newsArray.forEach(news => {
    // Create a news card
    const card = document.createElement('div');
    card.classList.add('news-card');

    // Build HTML content inside the card
    card.innerHTML = `
      <img src="${news.media.url}" alt="${news.media.alt}" class="news-image">
      <div class="news-content">
        <h3>${news.title}</h3>
        <p class="news-date">${formatDate(news.date)} | <span class="news-category">${news.category}</span></p>
        <p>${news.description}</p>
        <a href="${news.link}" target="_blank" class="news-link">Watch Episode</a>
        <p class="news-tags">${news.tags.map(tag => `#${tag}`).join(' ')}</p>
        <p class="news-author">By ${news.author}</p>
      </div>
    `;

    // Append card to the container
    container.appendChild(card);
  });
}


// Helper to format date nicely
function formatDate(dateStr) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString(undefined, options);
}
