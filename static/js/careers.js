document.addEventListener('DOMContentLoaded', function() {
    fetch('./static/data/careers.json')
        .then(response => response.json())
        .then(data => {
            const jobCategoriesContainer = document.getElementById('job-categories');
            data.categories.forEach(category => {
                const categoryDiv = document.createElement('div');
                categoryDiv.classList.add('job-category');

                const categoryTitle = document.createElement('h2');
                categoryTitle.textContent = category.name;
                categoryDiv.appendChild(categoryTitle);

                if (category.jobs.length > 0) {
                    const jobList = document.createElement('ul');
                    category.jobs.forEach(job => {
                        const jobItem = document.createElement('li');
                        jobItem.textContent = job.title;
                        jobList.appendChild(jobItem);
                    });
                    categoryDiv.appendChild(jobList);
                } else {
                    const noJobsMessage = document.createElement('p');
                    noJobsMessage.textContent = 'No jobs available at the moment';
                    noJobsMessage.classList.add('no-jobs');
                    categoryDiv.appendChild(noJobsMessage);
                }

                jobCategoriesContainer.appendChild(categoryDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching job categories:', error);
        });
});