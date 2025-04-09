document.addEventListener('DOMContentLoaded', () => {
    // Dynamic header loading
    fetch('./components/header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            const siteHeader = document.getElementById('site-header');
            if (siteHeader) {
                siteHeader.innerHTML = data;
                console.log('Header loaded successfully');
                
                // Dynamically load mobile menu script
                return new Promise((resolve, reject) => {
                    const mobileMenuScript = document.createElement('script');
                    mobileMenuScript.src = 'js/mobile-menu.js';
                    mobileMenuScript.onload = resolve;
                    mobileMenuScript.onerror = reject;
                    document.body.appendChild(mobileMenuScript);
                });
            } else {
                console.error('Site header element not found');
            }
        })
        .catch(error => {
            console.error('Error loading header:', error);
        });

    // Footer loading remains the same
    fetch('./components/footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('site-footer').innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading footer:', error);
        });
});