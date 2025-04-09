fetch('data/openJobs.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(jobListings => {
        const listingsContainer = document.getElementById('job-listings');

        if (jobListings.length === 0) {
            const noJobsMessage = document.createElement('div');
            noJobsMessage.classList.add('no-jobs');
            noJobsMessage.style.color = 'red';
            noJobsMessage.textContent = 'No job listings available at the moment.';
            listingsContainer.appendChild(noJobsMessage);
            return;
        }

        jobListings.forEach(job => {
            const jobCard = document.createElement('div');
            jobCard.classList.add('job-card');
            
            jobCard.innerHTML = `
                <h3>${job.title || 'No title available'}</h3>
                <div class="job-details">
                    <span class="job-type">${job.type || 'No type available'}</span> in
                    <span class="job-location">${job.location || 'No location available'}</span>
                </div>
                <p>${job.description || 'No description available'}</p>
                <p><strong>Requirements:</strong> ${(job.requirements && job.requirements.join(',<br> ')) || 'No requirements available'}</p>
                <p><strong>Contact:</strong> ${(job.contact && job.contact.name) || 'No contact name available'}, ${(job.contact && job.contact.phone) || 'No contact phone available'}</p>
                <p><strong>E-mail:</strong> ${(job.contact && job.contact.email) || 'No contact email available'}</p>

                <a href="${job.link_src || '#'}" class="apply-btn">Apply Here</a>
                <img src="${job.logo_src || 'assets/logos/inVaalTriangle_logo.png'}" alt="${job.title || 'No title available'}">
            `;

            listingsContainer.appendChild(jobCard);
        });
    })
    .catch(error => {
        const listingsContainer = document.getElementById('job-listings');
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('error-message');
        errorMessage.style.color = 'red';
        errorMessage.textContent = `Error fetching job listings: ${error.message}`;
        listingsContainer.appendChild(errorMessage);
    });