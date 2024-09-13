fetch('./static/data/jobs.json') // Ensure the correct path to your jobs.json file
    .then(response => response.json())
    .then(jobs => {
        const jobContainer = document.getElementById('job-listings');

        jobs.forEach(job => {
            const jobElement = document.createElement('div');
            jobElement.classList.add('job-item'); // Add a class for styling

            // Create the job HTML dynamically
            jobElement.innerHTML = `
                <h2>${job.title}</h2>
                <p><strong>Location:</strong> ${job.location}</p>
                <p><strong>Position:</strong> ${job.position}</p>
                <p><strong>Duration:</strong> ${job.duration}</p>
                <p>${job.description}</p>
                <a href="${job.link}" target="_blank">Apply Here</a>
                ${job.picture ? `<img src="${job.picture}" alt="${job.title} picture" width="100px">` : ''}
            `;

            // Append the job element to the container
            jobContainer.appendChild(jobElement);
        });
    })
    .catch(error => {
        console.error('Error loading jobs:', error);
        document.getElementById('job-listings').innerHTML = '<p>Failed to load job listings. Please try again later.</p>';
    });
