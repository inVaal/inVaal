// Fetch the JSON data
fetch('./static/data/categories.json')
.then(response => response.json()) // Parse the JSON
.then(data => {
    const navList = document.getElementById('nav-list'); // Get the navigation list element

    // Loop through each category in the JSON file
    data.categories.forEach(category => {
    const listItem = document.createElement('li'); // Create a new list item
    const anchor = document.createElement('a'); // Create an anchor element
    
    // Set the attributes and content of the anchor
    anchor.href = category.link; 
    anchor.className = 'nav-category';
    anchor.textContent = category.name; 
    anchor.setAttribute('data-description', category.description);

    listItem.appendChild(anchor); // Append anchor to list item
    navList.appendChild(listItem); // Append list item to the navigation list
    });
})
.catch(error => console.error('Error loading JSON:', error)); // Handle any errors
