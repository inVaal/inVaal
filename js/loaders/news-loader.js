document.addEventListener('DOMContentLoaded', () => {
    // Function to load news from JSON
    async function loadNews() {
        try {
            const response = await fetch('data/news.json');
            const newsData = await response.json();
            
            const newsContainer = document.getElementById('news-container');
            
            // Clear existing content
            newsContainer.innerHTML = '';
            
            // Populate news items
            newsData.forEach(newsItem => {
                // Create news card
                const newsCard = document.createElement('div');
                newsCard.classList.add('news-card');
                
                // Handle title (with null check)
                const title = newsItem.title || 'No Title Available';
                
                // Handle date (with null check)
                const date = newsItem.date ? 
                    `<span class="news-date">${newsItem.date}</span>` : 
                    '<span class="news-date">Date Not Specified</span>';
                
                // Handle description (with null check)
                const description = newsItem.description || 'No description available.';
                
                // Handle media (with null check)
                let mediaHTML = '';
                if (newsItem.media && newsItem.media.url) {
                    const mediaType = newsItem.media.type || 'image';
                    mediaHTML = `
                        <div class="news-media">
                            ${mediaType === 'image' ? 
                                `<img src="${newsItem.media.url}" alt="${title}">` : 
                                `<img src="${newsItem.media.url}" alt="${title}">`
                            }
                        </div>
                    `;
                }
                
                // Construct news card HTML
                newsCard.innerHTML = `
                    <div class="news-location">${newsItem.location}</div>
                    <h3 class="news-title">${title}</h3>
                    ${mediaHTML}
                    <p class="news-description">${description}</p>
                    ${date}
                    ${newsItem.source && newsItem.source !== '#' ? 
                        `<a href="${newsItem.source}" class="news-source">Read More</a>` : 
                        ''
                    }
                `;
                
                newsContainer.appendChild(newsCard);
            });
        } catch (error) {
            console.error('Error loading news:', error);
            
            // Error handling UI
            const newsContainer = document.getElementById('news-container');
            newsContainer.innerHTML = `
                <div class="error-message">
                    <h3>Unable to Load News</h3>
                    <p>We're experiencing technical difficulties. Please check back later.</p>
                </div>
            `;
        }
    }

    // Call the news loader function
    loadNews();
});