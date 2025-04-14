document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('sasolburg-news-container');
    const categoryFilter = document.getElementById('news-category');
    const searchInput = document.getElementById('search-news');

    let allNews = [];

    // Fetch news from the Sasolburg-specific JSON
    async function fetchNews() {
        try {
            const res = await fetch('data/places/sasolburg.json');
            const data = await res.json();
            allNews = data;
            renderNews(allNews);
        } catch (err) {
            console.error("Failed to load Sasolburg news:", err);
            newsContainer.innerHTML = '<p>Error loading news data.</p>';
        }
    }

    // Render filtered or full news list
    function renderNews(newsList) {
        newsContainer.innerHTML = '';

        if (newsList.length === 0) {
            newsContainer.innerHTML = '<p style="color: red;">No Information Available</p>';
            return;
        }

        newsList.forEach(news => {
            const card = document.createElement('div');
            card.classList.add('news-card');
            if (news.highlighted) {
                card.classList.add('highlighted');
            }

            const formattedDate = news.date 
                ? new Date(news.date).toLocaleDateString('en-ZA', {
                    year: 'numeric', month: 'long', day: 'numeric'
                }) 
                : 'No date provided';

            card.innerHTML = `
                <h3>${news.title}</h3>
                <small class="news-date">📅 ${formattedDate}</small>
                ${news.media?.url ? 
                    `<img class="imgNews" src="${news.media.url}" alt="${news.media.alt || news.title}">` : 
                    ''
                }
                <p>${news.description || 'No description available.'}</p>
                ${news.link ? `<a href="${news.link}" target="_blank" class="read-more">Visit Here →</a>` : ''}
                <p class="author">🖊️ ${news.author || 'Unknown Author'}</p>
                <div class="tags">
                ${news.tags?.map(tag => `<span class="tag">${tag}</span>`).join(' ') || ''}
                </div>
            `;

            newsContainer.appendChild(card);
        });
    }

    // Handle filter changes
    categoryFilter.addEventListener('change', () => {
        const selected = categoryFilter.value;
        const filtered = selected === 'all' ? allNews : allNews.filter(n => n.category === selected);
        renderNews(filtered);
    });

    // Handle search input
    searchInput.addEventListener('input', () => {
        const keyword = searchInput.value.toLowerCase();
        const searched = allNews.filter(news =>
            news.title.toLowerCase().includes(keyword) ||
            news.description.toLowerCase().includes(keyword) ||
            news.tags?.some(tag => tag.toLowerCase().includes(keyword))
        );
        renderNews(searched);
    });

    // Initial load
    fetchNews();
});
