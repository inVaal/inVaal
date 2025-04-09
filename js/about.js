// Function to load and display company information
async function loadCompanyInfo() {
    try {
        const response = await fetch('data/company_inf.json');
        const data = await response.json();
        const company = data.company;

        // Update company name and motto
        document.querySelector('.about-header h1').textContent = `About ${company.name}`;
        document.querySelector('.motto').textContent = `${company.motto} ${company.motto_text}`;

        // Update coverage area
        const citiesList = document.querySelector('.coverage-card:first-child ul');
        company.location.cities.forEach(city => {
            const li = document.createElement('li');
            li.textContent = city;
            citiesList.appendChild(li);
        });

        const statesList = document.querySelector('.coverage-card:last-child ul');
        company.location.states.forEach(state => {
            const li = document.createElement('li');
            li.textContent = state;
            statesList.appendChild(li);
        });

        // // Update social media links
        // const socialLinksContainer = document.querySelector('.social-links');
        // socialLinksContainer.innerHTML = ''; // Clear existing links

        // const socialMedia = company.contact.social_media;
        // for (const [platform, url] of Object.entries(socialMedia)) {
        //     if (url) {
        //         const link = document.createElement('a');
        //         link.href = url;
        //         link.target = '_blank';
        //         link.rel = 'noopener noreferrer';
        //         link.className = 'social-link';
                
        //         link.innerHTML = `
        //         <span>${formatPlatformName(platform)}</span>
        //             <img class="footer-socials" src="assets/icons/socials/${platform}.png" alt="${platform}" class="social-icon">
        //         `;
                
        //         socialLinksContainer.appendChild(link);
        //     }
        // }

        // Update contact information
        const contactInfo = document.querySelector('.contact-info');
        contactInfo.innerHTML = `
            <h3>Get in Touch</h3>
            ${company.contact.email ? `<p>Email: <a href="mailto:${company.contact.email}">${company.contact.email}</a></p>` : ''}
            ${company.website ? `<p>Website: <a href="${company.website}" target="_blank" rel="noopener noreferrer">${company.website}</a></p>` : ''}
        `;

    } catch (error) {
        console.error('Error loading company information:', error);
    }
}

// Helper function to format platform names
function formatPlatformName(platform) {
    const platformNames = {
        facebook: 'Follow Us On ',
        whatsapp: 'Join Us On',
        youtube: 'Watch US on',
        instagram: 'Follow Us on ',
        tiktok: 'Follow us on ',
        x: 'Follow us on '
    };
    return platformNames[platform] || `Connect on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`;
}

// Load company information when the page loads
document.addEventListener('DOMContentLoaded', loadCompanyInfo);