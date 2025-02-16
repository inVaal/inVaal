// loadNews.js
document.addEventListener('DOMContentLoaded', () => {
    // Get the containers for each location
    const sasolburgContainer = document.getElementById('sasolburg-news');
    const vereenigingContainer = document.getElementById('vereeniging-news');
    const vanderbijlparkContainer = document.getElementById('vanderbijlpark-news');

    // Fetch the news JSON file
    fetch('./static/data/news.json')
        .then(response => response.json())
        .then(newsItems => {
            // Iterate through the news items and place them in the correct section
            newsItems.forEach(item => {
                
                // If null dont show on site
                // Create a div to hold each news item
                const newsItemDiv = document.createElement('div');
                newsItemDiv.className = 'news-item';

                // If null dont show on site
                // Add title
                if (item.title){
                    const titleEl = document.createElement('h3');
                    titleEl.textContent = item.title;
                    newsItemDiv.appendChild(titleEl);
                }
                
                // If null dont show on site
                // Add date
                if (item.date){
                    const dateEl = document.createElement('p');
                    dateEl.textContent = `${item.date}`;
                    newsItemDiv.appendChild(dateEl);
                }

                // If null dont show on site
                // Add media (image, gif, or video)
                if (item.media && item.media.type && item.media.url){
                    if (item.media.type === 'image' || item.media.type === 'gif') {
                        const imgEl = document.createElement('img');
                        imgEl.src = item.media.url;
                        imgEl.alt = 'News Image';
                        imgEl.width = 200;
                        newsItemDiv.appendChild(imgEl);
                    } else if (item.media.type === 'mp4') {
                        const videoEl = document.createElement('video');
                        videoEl.src = item.media.url;
                        videoEl.controls = true;
                        videoEl.width = 300;
                        newsItemDiv.appendChild(videoEl);
                    }
                }
                

                // If null dont show on site
                // Add description
                if (item.description){
                    const descriptionEl = document.createElement('p');
                    descriptionEl.textContent = item.description;
                    newsItemDiv.appendChild(descriptionEl);
                }
                
                // If null dont show on site
                // Add source link
                if (item.source){
                    const sourceEl = document.createElement('a');
                    sourceEl.href = item.source;
                    sourceEl.textContent = 'Read more';
                    newsItemDiv.appendChild(sourceEl);
                }

                // Append the news item to the correct location container
                if (item.location === 'Sasolburg') {
                    sasolburgContainer.appendChild(newsItemDiv);
                } else if (item.location === 'Vereeniging') {
                    vereenigingContainer.appendChild(newsItemDiv);
                } else if (item.location === 'Vanderbijlpark') {
                    vanderbijlparkContainer.appendChild(newsItemDiv);
                }
            });
        })
        .catch(error => {
            console.error('Error loading news:', error);
        });
});
