document.addEventListener('DOMContentLoaded', () => {
    // Get location from data attribute
    const locationScript = document.currentScript;
    const location = locationScript.getAttribute('data-location');

    async function loadLocationNews() {
        try {
            const response = await fetch('../data/news.json');
            const newsData = await response.json();
            
            const newsContainer = document.getElementById('sasolburg-news-container');
            newsContainer.innerHTML = ''; // Clear existing content
            
            // Filter news by location
            const locationNews = newsData.filter(news => news.location === location);
            
            locationNews.forEach(newsItem => {
                const newsCard = document.createElement('div');
                newsCard.classList.add('news-card');
                
                newsCard.innerHTML = `
                    <h3>${newsItem.title}</h3>
                    ${newsItem.media && newsItem.media.url ? 
                        `<img src="${newsItem.media.url}" alt="${newsItem.title}">` : 
                        ''
                    }
                    <p>${newsItem.description || 'No description available'}</p>
                `;
                
                newsContainer.appendChild(newsCard);
            });
        } catch (error) {
            console.error('Error loading location news:', error);
        }
    }

    loadLocationNews();
});