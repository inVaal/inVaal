document.addEventListener('DOMContentLoaded', () => {
    (async () => {
        const jobCategoriesContainer = document.getElementById('job-categories');
        const loadingIndicator = document.getElementById('loading');
        const errorMessage = document.getElementById('error-message');

        // Show loading indicator before fetching
        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
        }

        // Check if the container exists
        if (!jobCategoriesContainer) {
            console.error("Element with ID 'job-categories' not found.");
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
            return;
        }

        try {
            const response = await fetch('./static/data/careers.json');

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            // Optionally, display company information if needed
            displayCompanyInfo(data.company, jobCategoriesContainer);

            if (!data.categories || !Array.isArray(data.categories)) {
                throw new Error("Invalid data format: 'categories' array is missing.");
            }

            const fragment = document.createDocumentFragment();

            data.categories.forEach((category, catIndex) => {
                if (!category.name || !Array.isArray(category.jobs)) {
                    console.warn("Invalid category structure:", category);
                    return;
                }

                // Create the category container
                const categoryDiv = document.createElement('div');
                categoryDiv.classList.add('job-category');

                // Create the header for the category (clickable)
                const categoryHeader = document.createElement('div');
                categoryHeader.classList.add('job-category-header');
                categoryHeader.setAttribute('tabindex', '0'); // Make it focusable for accessibility
                categoryHeader.setAttribute('role', 'button');
                categoryHeader.setAttribute('aria-expanded', 'false');
                categoryHeader.setAttribute('aria-controls', `category-content-${catIndex}`);
                categoryHeader.innerHTML = `
                    <h2>${category.name}</h2>
                    <span class="accordion-icon">&#9660;</span> <!-- Down arrow icon -->
                `;
                categoryDiv.appendChild(categoryHeader);

                // Create the content container for the category (initially hidden)
                const categoryContent = document.createElement('div');
                categoryContent.id = `category-content-${catIndex}`;
                categoryContent.classList.add('job-category-content');
                categoryContent.setAttribute('aria-hidden', 'true');

                if (category.jobs.length > 0) {
                    category.jobs.forEach((job, jobIndex) => {
                        if (!job.title) {
                            console.warn("Job title missing:", job);
                            return;
                        }

                        // Create the job container
                        const jobDiv = document.createElement('div');
                        jobDiv.classList.add('job-item');

                        // Create the job header (clickable)
                        const jobHeader = document.createElement('div');
                        jobHeader.classList.add('job-header');
                        jobHeader.setAttribute('tabindex', '0');
                        jobHeader.setAttribute('role', 'button');
                        jobHeader.setAttribute('aria-expanded', 'false');
                        jobHeader.setAttribute('aria-controls', `job-content-${catIndex}-${jobIndex}`);
                        jobHeader.innerHTML = `
                            <h3>${job.title}</h3>
                            <span class="accordion-icon">&#9660;</span> <!-- Down arrow icon -->
                        `;
                        jobDiv.appendChild(jobHeader);

                        // Create the job details container (initially hidden)
                        const jobContent = document.createElement('div');
                        jobContent.id = `job-content-${catIndex}-${jobIndex}`;
                        jobContent.classList.add('job-content');
                        jobContent.setAttribute('aria-hidden', 'true');

                        // Populate job details
                        jobContent.innerHTML = generateJobDetailsHTML(job);

                        jobDiv.appendChild(jobContent);
                        categoryContent.appendChild(jobDiv);

                        // Event listeners for job accordion
                        jobHeader.addEventListener('click', () => {
                            toggleAccordion(jobHeader, jobContent);
                        });

                        jobHeader.addEventListener('keypress', (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                toggleAccordion(jobHeader, jobContent);
                            }
                        });
                    });
                } else {
                    const noJobsMessage = document.createElement('p');
                    noJobsMessage.textContent = 'No jobs available at the moment.';
                    noJobsMessage.classList.add('no-jobs');
                    categoryContent.appendChild(noJobsMessage);
                }

                categoryDiv.appendChild(categoryContent);
                fragment.appendChild(categoryDiv);

                // Event listeners for category accordion
                categoryHeader.addEventListener('click', () => {
                    toggleAccordion(categoryHeader, categoryContent);
                });

                categoryHeader.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleAccordion(categoryHeader, categoryContent);
                    }
                });
            });

            jobCategoriesContainer.appendChild(fragment);

            // Hide loading indicator after successful fetch
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }

        } catch (error) {
            console.error('Error fetching or processing job categories:', error);
            // Hide loading indicator and show error message
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
            if (errorMessage) {
                errorMessage.textContent = 'Sorry, we are unable to load job listings at this time.';
                errorMessage.classList.add('error-message-active');
                errorMessage.style.display = 'block';
            }
        }
    })();
});

/**
 * Toggles the accordion for a given header and content pair.
 * @param {HTMLElement} header - The header element that was clicked.
 * @param {HTMLElement} content - The content element to show/hide.
 */
function toggleAccordion(header, content) {
    const isExpanded = header.getAttribute('aria-expanded') === 'true';
    
    // Toggle aria-expanded attribute
    header.setAttribute('aria-expanded', !isExpanded);
    
    // Toggle aria-hidden attribute
    content.setAttribute('aria-hidden', isExpanded);
    
    // Toggle visibility with CSS classes
    if (isExpanded) {
        content.classList.remove('active');
        header.classList.remove('active');
    } else {
        content.classList.add('active');
        header.classList.add('active');
    }
}

/**
 * Generates HTML content for job details.
 * @param {Object} job - The job object containing all details.
 * @returns {string} - The HTML string representing job details.
 */
function generateJobDetailsHTML(job) {
    const salary = job.salaryRange
        ? `${job.salaryRange.currency} ${job.salaryRange.min.toLocaleString()} - ${job.salaryRange.max.toLocaleString()}`
        : 'Not specified';
    
    const responsibilities = Array.isArray(job.responsibilities) ? job.responsibilities.map(r => `<li>${r}</li>`).join('') : '';
    const skills = Array.isArray(job.qualifications.skills) ? job.qualifications.skills.map(s => `<li>${s}</li>`).join('') : '';
    const benefits = Array.isArray(job.benefits) ? job.benefits.map(b => `<li>${b}</li>`).join('') : '';
    const initiatives = Array.isArray(job.communityImpact.initiatives) ? job.communityImpact.initiatives.map(i => `<li>${i}</li>`).join('') : '';
    const tags = Array.isArray(job.tags) ? job.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ') : '';

    return `
        <div class="job-details">
            <p><strong>Department:</strong> ${job.department || 'N/A'}</p>
            <p><strong>Type:</strong> ${job.type || 'N/A'}</p>
            <p><strong>Location:</strong> ${job.location || 'N/A'}</p>
            <p><strong>Salary Range:</strong> ${salary}</p>
            <p><strong>Description:</strong> ${job.description || 'N/A'}</p>

            <div class="job-section">
                <h4>Responsibilities</h4>
                <ul>${responsibilities}</ul>
            </div>

            <div class="job-section">
                <h4>Qualifications</h4>
                <p><strong>Education:</strong> ${job.qualifications.education || 'N/A'}</p>
                <p><strong>Experience:</strong> ${job.qualifications.experience || 'N/A'}</p>
                <p><strong>Skills:</strong></p>
                <ul>${skills}</ul>
            </div>

            <div class="job-section">
                <h4>Benefits</h4>
                <ul>${benefits}</ul>
            </div>

            <div class="job-section">
                <h4>Application</h4>
                <p><strong>Deadline:</strong> ${formatDate(job.application.deadline)}</p>
                <p>${job.application.instructions || ''}</p>
                <p><a href="${job.application.applicationLink}" target="_blank" rel="noopener noreferrer">Apply Here</a></p>
            </div>

            <div class="job-section">
                <h4>Community Impact</h4>
                <p>${job.communityImpact.description || ''}</p>
                <ul>${initiatives}</ul>
            </div>

            <div class="job-tags">
                ${tags}
            </div>
        </div>
    `;
}

/**
 * Formats a date string from YYYY-MM-DD to a more readable format.
 * @param {string} dateStr - The date string in YYYY-MM-DD format.
 * @returns {string} - The formatted date string.
 */
function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj)) return 'Invalid Date';
    return dateObj.toLocaleDateString(undefined, options);
}

/**
 * Displays company information at the top of the careers page.
 * @param {Object} company - The company object containing information.
 * @param {HTMLElement} container - The container to append the company info to.
 */

function displayCompanyInfo(company, container) {
    if (!company || typeof company !== 'object') return;

    const companyDiv = document.createElement('div');
    companyDiv.classList.add('company-info');

    companyDiv.innerHTML = `
        <h2>${company.name}</h2>
        <p><strong>Website:</strong> <a href="${company.website}" target="_blank" rel="noopener noreferrer">${company.website}</a></p>
        <p><strong>Contact Email:</strong> <a href="mailto:${company.contactEmail}">${company.contactEmail}</a></p>
        <p><strong>Location:</strong><br>  ${company.location.city}<br>${company.location.state}<br>${company.location.country}</p>
    `;

    // Insert the company info before the job categories
    container.parentNode.insertBefore(companyDiv, container);
}