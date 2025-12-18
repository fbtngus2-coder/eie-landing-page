import './style.css'
import { initEditor } from './editor.js';

console.log('EiE Landing Page Loaded');
initEditor();

// History Tab Logic
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
let awardSwiper = null;

function initSwiper() {
    // Destroy if exists to ensure clean state
    if (awardSwiper) {
        awardSwiper.destroy(true, true);
        awardSwiper = null;
    }

    if (document.querySelector('.awards-swiper')) {
        awardSwiper = new Swiper('.awards-swiper', {
            slidesPerView: 1, // Mobile default
            spaceBetween: 20,
            loop: true,
            observer: true,
            observeParents: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 1.5,
                    spaceBetween: 20,
                },
                900: {
                    slidesPerView: 2, // Desktop/Tablet: Show 2 cards
                    spaceBetween: 30,
                },
            },
        });
    }
}

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        // Add active class to clicked button and target content
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-tab');
        document.getElementById(targetId).classList.add('active');

        // Handle Swiper initialization
        if (targetId === 'tab-5') {
            // Slight delay to allow DOM to render
            setTimeout(initSwiper, 50);
        }
    });
});


