document.addEventListener('DOMContentLoaded', () => {
    class Slideshow {
        constructor(container) {
            this.container = container;
            this.slidesWrapper = container.querySelector('.slides-wrapper');
            this.slides = container.querySelectorAll('.slide');
            this.prevButton = container.querySelector('.prev-slide');
            this.nextButton = container.querySelector('.next-slide');
            this.indicatorsContainer = container.querySelector('.slide-indicators');

            this.currentSlide = 0;
            this.totalSlides = this.slides.length;

            this.init();
        }

        init() {
            this.createIndicators();
            this.addEventListeners();
            this.startAutoPlay();
        }

        createIndicators() {
            this.slides.forEach((_, index) => {
                const indicator = document.createElement('div');
                indicator.classList.add('slide-indicator');
                if (index === 0) indicator.classList.add('active');
                indicator.addEventListener('click', () => this.goToSlide(index));
                this.indicatorsContainer.appendChild(indicator);
            });
        }

        addEventListeners() {
            this.prevButton.addEventListener('click', () => this.previousSlide());
            this.nextButton.addEventListener('click', () => this.nextSlide());

            // Touch and swipe support
            let touchStartX = 0;
            this.container.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
            });

            this.container.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const diffX = touchStartX - touchEndX;

                if (Math.abs(diffX) > 50) {
                    diffX > 0 ? this.nextSlide() : this.previousSlide();
                }
            });
        }

        nextSlide() {
            this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
            this.updateSlidePosition();
            this.updateIndicators();
        }

        previousSlide() {
            this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
            this.updateSlidePosition();
            this.updateIndicators();
        }

        goToSlide(index) {
            this.currentSlide = index;
            this.updateSlidePosition();
            this.updateIndicators();
        }

        updateSlidePosition() {
            this.slidesWrapper.style.transform = `translateX(-${this.currentSlide * 100}%)`;
        }

        updateIndicators() {
            const indicators = this.indicatorsContainer.querySelectorAll('.slide-indicator');
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === this.currentSlide);
            });
        }

        startAutoPlay() {
            this.autoPlayInterval = setInterval(() => {
                this.nextSlide();
            }, 5000);
        }

        stopAutoPlay() {
            clearInterval(this.autoPlayInterval);
        }
    }

    // Initialize slideshows
    const slideshowContainers = document.querySelectorAll('.slideshow-container');
    slideshowContainers.forEach(container => new Slideshow(container));
});