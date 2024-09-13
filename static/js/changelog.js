// JavaScript for loading changelog dynamically
// Fetch the changelog JSON data
fetch('./static/data/changelog.json')
    .then(response => response.json())
    .then(data => {
        const changelogList = document.getElementById('changelog-list'); // Get the changelog list

        // Loop through each changelog entry in the JSON file
        data.changelog.forEach(entry => {
            const listItem = document.createElement('li'); // Create a list item
            const version = document.createElement('h3'); // Create a version heading
            const date = document.createElement('p'); // Create a date paragraph
            const changes = document.createElement('ul'); // Create a list for changes

            // Set content for version and date
            version.textContent = `Version ${entry.version}`;
            date.textContent = `${entry.date}`;

            // Loop through the changes and add them to the changes list
            entry.changes.forEach(change => {
                const changeItem = document.createElement('li');
                changeItem.textContent = change;
                changes.appendChild(changeItem);
            });

            // Append elements to the list item
            listItem.appendChild(version);
            listItem.appendChild(date);
            listItem.appendChild(changes);

            // Add the list item to the changelog list
            changelogList.appendChild(listItem);
        });
    })
    .catch(error => console.error('Error loading changelog:', error)); // Handle errors
    