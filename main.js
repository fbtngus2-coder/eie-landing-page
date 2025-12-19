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



// Brochure Logic
function initBrochure() {
    const flipbookEl = document.getElementById('flipbook');
    if (!flipbookEl) return;

    // Check if St is available (loaded from CDN)
    // Retry a few times if script is async/defer
    if (typeof St === 'undefined') {
        setTimeout(initBrochure, 100);
        return;
    }

    // Check if duplicate wrapper exists and stop if so
    if (flipbookEl.querySelector('.stf__wrapper')) {
        return;
    }

    const pageFlip = new St.PageFlip(flipbookEl, {
        width: 550, // Base page width
        height: 755, // 881x1210 ratio (~0.728) matches image exactly
        size: 'fixed', // Strict size
        // Remove min/max width/height to prevent scaling behavior that creates gaps
        // minWidth: 300,
        // maxWidth: 1000,
        // minHeight: 400,
        // maxHeight: 1500,
        maxShadowOpacity: 0.2,
        showCover: false,
        mobileScrollSupport: false,
        usePortrait: false,
        startPage: 0,
        autoSize: false, // Turn off auto-size to prevent container stretching beyond page
    });

    pageFlip.loadFromHTML(document.querySelectorAll('.page'));

    // Navigation Buttons
    const prevBtn = document.getElementById('brochure-prev');
    const nextBtn = document.getElementById('brochure-next');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            pageFlip.flipPrev();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            pageFlip.flipNext();
        });
    }

    // Thumbnail Logic
    const thumbnailContainer = document.getElementById('brochure-thumbnails');
    if (thumbnailContainer) {
        // Clear existing if any
        thumbnailContainer.innerHTML = '';

        const pages = document.querySelectorAll('.page img');
        pages.forEach((img, index) => {
            // Create thumbnail
            const thumb = document.createElement('div');
            thumb.className = 'thumbnail-item';
            if (index === 0) thumb.classList.add('active'); // Start with first active

            const thumbImg = document.createElement('img');
            thumbImg.src = img.src; // Reuse same image source
            thumbImg.alt = `Page ${index + 1}`;

            const thumbNum = document.createElement('div');
            thumbNum.className = 'thumbnail-number';
            thumbNum.textContent = index + 1; // 1-based index (e.g. Page 2 is index 0 in list but logical page 1?)
            // Actually pages are 2-24. Let's just use index+1 for simplicity or map to actual page number if needed.

            thumb.appendChild(thumbImg);
            thumb.appendChild(thumbNum);

            // Click to flip
            thumb.addEventListener('click', () => {
                pageFlip.flip(index);
            });

            thumbnailContainer.appendChild(thumb);
        });

        // Update active thumbnail on flip
        pageFlip.on('flip', (e) => {
            const currentIndex = e.data; // Current page index
            const thumbs = document.querySelectorAll('.thumbnail-item');

            thumbs.forEach(t => t.classList.remove('active'));

            // Highlight current page(s)
            // PageFlip might show 2 pages. We highlight the one that is 'current' index.
            if (thumbs[currentIndex]) {
                thumbs[currentIndex].classList.add('active');
                thumbs[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        });
    }

    // Responsive handling mainly done by "usePortrait: false" (auto) or explicit calls
    // But we might want to ensure container size is good.
}

// Call initBrochure when DOM is ready (or slightly delayed)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initBrochure();
    });
} else {
    initBrochure();
}
