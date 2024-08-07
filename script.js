let currentSection = 0;
const sections = document.querySelectorAll('.section');
let isThrottled = false;
let touchStartY = 0;
let touchEndY = 0;
const nav = document.querySelector('nav');

function scrollToSection(index) {
    if (index >= 0 && index < sections.length) {
        currentSection = index;
        sections[currentSection].scrollIntoView({ behavior: 'smooth' });
    }
}

function handleScroll(event) {
    if (isThrottled) return;
    isThrottled = true;

    if (event.deltaY > 0) {
        scrollToSection(currentSection + 1);
    } else if (event.deltaY < 0) {
        scrollToSection(currentSection - 1);
    }

    setTimeout(() => {
        isThrottled = false;
    }, 1000);
}

function handleTouchStart(event) {
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    touchEndY = event.touches[0].clientY;
}

function handleTouchEnd() {
    if (isThrottled) return;
    isThrottled = true;

    if (touchStartY > touchEndY + 50) {
        scrollToSection(currentSection + 1);
    } else if (touchStartY < touchEndY - 50) {
        scrollToSection(currentSection - 1);
    }

    setTimeout(() => {
        isThrottled = false;
    }, 1000);
}

let lastScrollTop = 0;
window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
        nav.style.top = '-60px'; // Oculta el menú al desplazarse hacia abajo
    } else {
        nav.style.top = '0'; // Muestra el menú al desplazarse hacia arriba
    }
    lastScrollTop = scrollTop;
});

window.addEventListener('wheel', handleScroll);
window.addEventListener('touchstart', handleTouchStart);
window.addEventListener('touchmove', handleTouchMove);
window.addEventListener('touchend', handleTouchEnd);
