import './style.css'



console.log('EiE Landing Page Loaded');



// Mobile Menu Logic
const menuToggle = document.getElementById('menu-toggle');
const header = document.querySelector('.header');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        header.classList.toggle('menu-open');
        // Optional: Change icon or animate
    });
}


// Scroll Animation Observer
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, observerOptions);

    const scrollElements = document.querySelectorAll('.scroll-animate');
    scrollElements.forEach((el) => {
        observer.observe(el);
    });
});
