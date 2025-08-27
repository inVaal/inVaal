class BusinessDirectory {
    constructor() {
        this.businesses = [];
        this.categories = [];
        this.currentPage = 1;
        this.itemsPerPage = 6;
    }

    async loadBusinesses() {
        try {
            const response = await fetch('data/businesses.json');
            const data = await response.json();
            
            this.businesses = data.businesses;
            this.categories = data.categories;
            
            this.populateCategories();
            this.renderBusinesses();
            this.setupEventListeners();
            
            return this.businesses;
        } catch (error) {
            console.error('Error loading businesses:', error);
            this.showErrorMessage();
            return [];
        }
    }

    populateCategories() {
        const categoryFilter = document.getElementById('category-filter');
        
        // Clear existing options
        categoryFilter.innerHTML = '<option value="">All Categories</option>';
        
        // Add categories from JSON
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    renderBusinesses(filteredBusinesses = null) {
        const listingsContainer = document.getElementById('business-listings');
        
        // Clear previous listings
        listingsContainer.innerHTML = '';
        
        // Determine which businesses to render
        const businessesToRender = filteredBusinesses || this.businesses;
        
        // Slice businesses based on current page
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const displayedBusinesses = businessesToRender.slice(startIndex, endIndex);

        // Render businesses
        displayedBusinesses.forEach(business => {
            const businessCard = this.createBusinessCard(business);
            listingsContainer.appendChild(businessCard);
        });

        // Update load more button visibility
        this.updateLoadMoreButton(businessesToRender);
    }

    createBusinessCard(business) {
        const card = document.createElement('div');
        card.classList.add('business-card');
        
        card.innerHTML = `
            ${business.logo ? `<img src="${business.logo}" alt="${business.name} logo" onerror="this.src='./assets/images/placeholder-logo.png'">` : ''}
            <h3>${business.name || 'No Name Available'}</h3>
            ${business.category ? `<p class="category">${business.category}</p>` : ''}
            ${business.description ? `<p>${business.description}</p>` : ''}
            <div class="business-contact">
            ${business.contact?.phone ? `<p>Call: ${business.contact.phone}</p>` : ''}
            ${business.contact?.email ? `<p>Email: <a href="mailto:${business.contact.email}">Contact Us</a></p>` : ''}
            </div>
            <div class="business-actions">
            ${business.contact?.website ? `<a href="${business.contact.website}" target="_blank" class="btn">Visit Website</a>` : ''}
            </div>
            <div class="business-social">
            ${business.social_media?.youtube ? `<a href="${business.social_media.youtube}" target="_blank" class="btn">YouTube Channel</a>` : ''}
            </div>
        `;

        return card;
    }

    setupEventListeners() {
        const searchInput = document.getElementById('business-search');
        const categoryFilter = document.getElementById('category-filter');
        const loadMoreBtn = document.getElementById('load-more-businesses');

        // Search event listener
        searchInput.addEventListener('input', (e) => {
            this.currentPage = 1;
            this.filterBusinesses();
        });

        // Category filter event listener
        categoryFilter.addEventListener('change', (e) => {
            this.currentPage = 1;
            this.filterBusinesses();
        });

        // Load more button event listener
        loadMoreBtn.addEventListener('click', () => {
            this.currentPage++;
            this.filterBusinesses();
        });
    }

    filterBusinesses() {
        const searchInput = document.getElementById('business-search');
        const categoryFilter = document.getElementById('category-filter');
        
        const searchQuery = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;

        // Filter businesses
        let filteredBusinesses = this.businesses.filter(business => {
            const matchesSearch = business.name.toLowerCase().includes(searchQuery) ||
                                  business.description.toLowerCase().includes(searchQuery);
            
            const matchesCategory = !selectedCategory || 
                                    business.category === selectedCategory;
            
            return matchesSearch && matchesCategory;
        });

        // Render filtered businesses
        this.renderBusinesses(filteredBusinesses);
    }

    updateLoadMoreButton(businesses) {
        const loadMoreBtn = document.getElementById('load-more-businesses');
        const totalBusinesses = businesses.length;
        const displayedBusinesses = this.currentPage * this.itemsPerPage;

        if (displayedBusinesses >= totalBusinesses) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }

    showErrorMessage() {
        const listingsContainer = document.getElementById('business-listings');
        listingsContainer.innerHTML = `
            <div class="error-message">
                <p>Unable to load businesses. Please try again later.</p>
            </div>
        `;
    }
}

// Initialize and use the business directory
document.addEventListener('DOMContentLoaded', async () => {
    const businessDirectory = new BusinessDirectory();
    await businessDirectory.loadBusinesses();
});