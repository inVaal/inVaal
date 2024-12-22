fetch('./static/data/minipay/images.json')
.then(response => response.json())
.then(data => {
    const slideshowContainer = document.getElementById('slideshow');
    data.images.forEach((image, index) => {
    const slide = document.createElement('div');
    slide.className = 'mySlides fade';
    slide.innerHTML = `
        <div class="numbertext">${index + 1} / ${data.images.length}</div>
        <img src="${image.src}" style="width:100%">
        <div class="text">${image.caption}</div>
    `;
    slideshowContainer.appendChild(slide);
    });

    let slideIndex = 0;
    showSlides();

    function showSlides() {
    let slides = document.getElementsByClassName('mySlides');
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    slides[slideIndex - 1].style.display = 'block';
    setTimeout(showSlides, 2000); // Change image every 2 seconds
    }
})
.catch(error => console.error('Error fetching images:', error));
