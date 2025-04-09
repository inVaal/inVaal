// Get references to the button and menu
const menuButton = document.querySelector('.menu-button');
const navMenu = document.querySelector('.nav-menu');

// Add click event listener to the button
menuButton.addEventListener('click', () => {
    // Toggle the active class on both button and menu
    menuButton.classList.toggle('active');
    navMenu.classList.toggle('active');

    // Update ARIA attributes for accessibility
    const isExpanded = menuButton.classList.contains('active');
    menuButton.setAttribute('aria-expanded', isExpanded);
});