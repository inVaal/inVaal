// jobs.js
fetch('./static/data/jobs.json') // Ensure the correct path to your jobs.json file
    .then(response => response.json())
    .then(jobs => {
        const jobContainer = document.getElementById('job-listings');

        jobs.forEach(job => {
            const jobElement = document.createElement('div');
            jobElement.classList.add('job-item'); // Add a class for styling

            // Create the job HTML dynamically and only render fields if they exist
            let jobHTML = `
            <div class="div-class">
                <h2>${job.title ? job.title : ''}</h2>
            `;

            if (job.location) {
                jobHTML += `<p><strong>Location:</strong> ${job.location}</p>`;
            }

            if (job.position) {
                jobHTML += `<p><strong>Position:</strong> ${job.position}</p>`;
            }

            if (job.duration) {
                jobHTML += `<p><strong>Duration:</strong> ${job.duration}</p>`;
            }

            if (job.minRequirements) {
                jobHTML += `<p><strong>Minimum Requirement/s:</strong> ${job.minRequirements}</p>`;
            }

            if (job.applicationClosingDate) {
                jobHTML += `<p><strong>Applications Close Date:</strong> ${job.applicationClosingDate}</p>`;
            }

            if (job.description) {
                jobHTML += `<p>${job.description}</p>`;
            }

            // Handle both email (mailto:) and website links
            if (job.link) {
                if (job.link.startsWith('http')) {
                    jobHTML += `<a href="${job.link}" target="_blank">Apply Here</a>`;
                } else {
                    jobHTML += `<a href="mailto:${job.link}" target="_blank">Apply via Email</a>`;
                }
            }

            // If picture exists, add the image element
            if (job.picture) {
                jobHTML += `<br><br><img src="${job.picture}" alt="${job.title} picture" width="100px" class="img-job-posts">`;
            }

            jobHTML += `</div>`;

            // Set the HTML content to jobElement
            jobElement.innerHTML = jobHTML;

            // Append the job element to the container
            jobContainer.appendChild(jobElement);
        });
    })
    .catch(error => {
        console.error('Error loading jobs:', error);
        document.getElementById('job-listings').innerHTML = '<p>Failed to load job listings. Please try again later.</p>';
    });
