// --- Language Selection ---
// Reflects the active language on the button flag and highlights the active option.

// Language code → flag emoji (rendered via the Twemoji polyfill font).
var langFlags = { tr: '🇹🇷', en: '🇺🇸', ru: '🇷🇺', de: '🇩🇪', fr: '🇫🇷', ar: '🇸🇦', fa: '🇮🇷' };

// Reflect the active language on the button flag + highlight the active option.
function updateLangButton(langCode) {
    var flagEl = document.getElementById('currentLangFlag');
    if (flagEl) flagEl.textContent = langFlags[langCode] || langFlags.tr;
    document.querySelectorAll('.lang-option').forEach(function (a) {
        a.classList.toggle('active', a.dataset.lang === langCode);
    });
}

// Flag click handler: save to localStorage and update UI.
function changeLanguage(langCode) {
    localStorage.setItem('lang', langCode);
    var sel = document.querySelector('.lang-selector');
    if (sel) sel.classList.remove('active');
    updateLangButton(langCode);
    // To trigger server-side or custom translation, you might want to uncomment location.reload()
    // location.reload();
}

// Restore saved language on load
document.addEventListener('DOMContentLoaded', function () {
    var savedLang = localStorage.getItem('lang') || 'tr';
    updateLangButton(savedLang);
});

// --- Theme Toggle Logic ---
function initTheme() {
    const themeToggleBtn = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    function updateLogo(isDark) {
        const navLogo = document.getElementById('navLogo');
        const footerLogo = document.getElementById('footerLogo');
        const logoSrc = isDark ? 'beyazLogo.png' : 'siyahLogo.png';
        
        if (navLogo) navLogo.src = logoSrc;
        if (footerLogo) footerLogo.src = logoSrc;

        const signature = document.getElementById('cahitSignature');
        if (signature) {
            signature.src = isDark ? 'cahitSignature_white.png' : 'cahitSignature.png';
        }
    }

    function setTheme(isDark) {
        if (isDark) {
            htmlElement.setAttribute('data-theme', 'dark');
            if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        } else {
            htmlElement.removeAttribute('data-theme');
            if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        }
        updateLogo(isDark);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = htmlElement.getAttribute('data-theme') === 'dark';
            setTheme(!isDark);
        });
    }

    // Default to the light (Medura) theme; only go dark when the user has
    // explicitly chosen it before. We no longer auto-opt-in from the OS
    // preference so first-time visitors always see the light brand design.
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    setTheme(isDark);
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initTeamCarousel();

    // --- Global Dropdown & Menu Toggles (Event Delegation) ---
    document.addEventListener('click', (e) => {
        const dropdownLink = e.target.closest('.dropdown > a');
        const mobileToggleBtn = e.target.closest('#mobileToggle');
        const navLinksMenu = document.querySelector('.navbar .nav-links');
        const langBtn = e.target.closest('#currentLang');
        const langOption = e.target.closest('.lang-option');
        const langSelector = document.querySelector('.lang-selector');

        // Handle language pick (flag click) → translate via reload
        if (langOption) {
            e.preventDefault();
            e.stopPropagation();
            changeLanguage(langOption.dataset.lang);
            return;
        }

        // Toggle the language dropdown open/closed
        if (langBtn) {
            e.stopPropagation();
            langSelector?.classList.toggle('active');
            document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
            return;
        }

        // Handle Dropdowns (Mobile/Touch Only)
        if (dropdownLink) {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                e.stopPropagation();
                const parent = dropdownLink.parentElement;
                const isActive = parent.classList.contains('active');
                
                // Close all others
                document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));

                if (!isActive) parent.classList.add('active');
                return;
            }
        }

        // Handle Mobile Toggle
        if (mobileToggleBtn) {
            e.stopPropagation();
            navLinksMenu?.classList.toggle('active');
            return;
        }

        // Close everything when clicking outside
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
        }
        if (langSelector && !e.target.closest('.lang-selector')) {
            langSelector.classList.remove('active');
        }

        // Close mobile menu when clicking outside
        if (navLinksMenu?.classList.contains('active') && !navLinksMenu.contains(e.target) && !mobileToggleBtn) {
            navLinksMenu.classList.remove('active');
        }
    });
});

// --- Navbar Scroll Logic ---
// Navbar stays pinned at all times (no hide-on-scroll). It only gets a
// slight shrink + shadow via the `.scrolled` class once the page moves.
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.pageYOffset > 10);
}, { passive: true });

// --- Process Modal Logic ---
function openProcessModal(step) {
    const modal = document.getElementById('processModal');
    const title = document.getElementById('modalTitle');
    const desc = document.getElementById('modalDescription');
    
    if (!modal || !title || !desc) return;

    const data = procDescriptions[step];
    if (data) {
        title.innerText = data.title;
        desc.innerHTML = data.desc;
    }
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; 
}

function closeProcessModal() {
    const modal = document.getElementById('processModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('processModal')) closeProcessModal();
});

// --- Team Carousel Logic ---
function initTeamCarousel() {
    const carousel = document.getElementById('teamCarousel');
    const prevBtn = document.getElementById('teamPrev');
    const nextBtn = document.getElementById('teamNext');
    if (!carousel || !prevBtn || !nextBtn) return;

    const scrollWidth = () => {
        const card = carousel.querySelector('.team-card');
        return card ? card.offsetWidth + 30 : 300;
    };

    nextBtn.addEventListener('click', () => {
        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        if (carousel.scrollLeft + 10 >= maxScroll) {
            carousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            carousel.scrollBy({ left: scrollWidth(), behavior: 'smooth' });
        }
    });

    prevBtn.addEventListener('click', () => {
        if (carousel.scrollLeft <= 10) {
            carousel.scrollTo({ left: carousel.scrollWidth, behavior: 'smooth' });
        } else {
            carousel.scrollBy({ left: -scrollWidth(), behavior: 'smooth' });
        }
    });
}

// --- Global Toast Notification Utility ---
function showToast(message, iconClass = 'fa-solid fa-circle-check') {
    let toast = document.getElementById('globalToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'globalToast';
        toast.className = 'custom-toast';
        document.body.appendChild(toast);
    }
    
    toast.innerHTML = `<i class="${iconClass}"></i> <span>${message}</span>`;
    
    // Trigger entry transition
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    // Clear any active dismiss timer
    if (window.toastTimeout) {
        clearTimeout(window.toastTimeout);
    }
    
    // Auto-dismiss after 3 seconds
    window.toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// --- Motion Layer: scroll-reveal + count-up stats ---
(function initMotion() {
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function run() {
        const revealEls = document.querySelectorAll('.reveal');

        // If IntersectionObserver isn't available or motion is reduced, show everything.
        if (prefersReduced || !('IntersectionObserver' in window)) {
            revealEls.forEach(el => el.classList.add('is-visible'));
            return;
        }

        // Scroll-reveal
        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(el => revealObserver.observe(el));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }
})();

// --- Decorative page-wide floating spheres ---
// Injects glossy CSS spheres into sections across the page for visual richness.
(function initDecoSpheres() {
    // Blueprint: array of sphere configs to inject into various sections.
    // Each entry: { parentSelector, class, style (CSS text), animDelay }
    const spheres = [
        // About section
        { parent: '#about',      cls: 'pink-sm',  style: 'top:60px; right:-30px; opacity:0.55;',        delay: '-1s' },
        { parent: '#about',      cls: 'lav-md',   style: 'bottom:40px; left:-50px; opacity:0.4;',       delay: '-4s' },
        { parent: '#about',      cls: 'peach-sm',  style: 'top:45%; right:5%; opacity:0.35;',           delay: '-6s' },

        // Treatments / services section
        { parent: '#treatments', cls: 'lav-sm',    style: 'top:-20px; left:4%; opacity:0.5;',           delay: '-2s' },
        { parent: '#treatments', cls: 'pink-md',   style: 'bottom:-40px; right:-20px; opacity:0.45;',   delay: '-5s' },
        { parent: '#treatments', cls: 'peach-sm',  style: 'top:50%; left:-25px; opacity:0.3;',          delay: '-7s' },

        // Process section
        { parent: '#process',    cls: 'pink-sm',   style: 'top:30px; right:2%; opacity:0.45;',          delay: '-3s' },
        { parent: '#process',    cls: 'lav-lg',    style: 'bottom:-50px; left:-40px; opacity:0.3;',     delay: '-1.5s' },

        // Team section
        { parent: '#team',       cls: 'peach-md',  style: 'top:-30px; right:-30px; opacity:0.4;',       delay: '-4.5s' },
        { parent: '#team',       cls: 'pink-sm',   style: 'bottom:20px; left:3%; opacity:0.45;',        delay: '-2.5s' },

        // Map section (uses class selector since no id)
        { parent: '.map-section',cls: 'lav-sm',    style: 'top:20px; left:-20px; opacity:0.45;',        delay: '-6s' },
        { parent: '.map-section',cls: 'pink-sm',   style: 'bottom:30px; right:5%; opacity:0.4;',        delay: '-3.5s' },

        // Footer area
        { parent: '.site-footer, footer', cls: 'lav-md', style: 'top:-50px; right:8%; opacity:0.3;',    delay: '-5s' },
    ];

    function inject() {
        // Respect reduced motion
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        spheres.forEach(cfg => {
            // Try each comma-separated selector
            const selectors = cfg.parent.split(',').map(s => s.trim());
            let container = null;
            for (const sel of selectors) {
                container = document.querySelector(sel);
                if (container) break;
            }
            if (!container) return;

            // Make sure parent is positioned so absolute children work
            const pos = getComputedStyle(container).position;
            if (pos === 'static') container.style.position = 'relative';

            const el = document.createElement('div');
            el.className = 'deco-sphere ' + cfg.cls;
            el.style.cssText = cfg.style;

            // Vary animation for organic feel
            const animations = ['float', 'floatSlow', 'floatFast'];
            const anim = animations[Math.floor(Math.random() * animations.length)];
            const dur = 7 + Math.random() * 5; // 7-12s
            el.style.animationName = anim;
            el.style.animationDuration = dur.toFixed(1) + 's';
            el.style.animationDelay = cfg.delay;

            container.appendChild(el);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inject);
    } else {
        inject();
    }
})();
