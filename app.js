// --- Google Translate Integration ---
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'tr',
        includedLanguages: 'en,ru,de,ar,fa,fr,tr',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
}

// Map language codes to flag emojis
const flags = {
    tr: '🇹🇷',
    en: '🇬🇧',
    ru: '🇷🇺',
    de: '🇩🇪',
    ar: '🇸🇦',
    fa: '🇮🇷',
    fr: '🇫🇷'
};

function changeLanguage(langCode) {
    localStorage.setItem('lang', langCode);

    // Set googtrans cookie for Google Translate
    const domain = window.location.hostname === 'localhost' ? '' : '.' + window.location.hostname;
    document.cookie = `googtrans=/tr/${langCode}; path=/;`;
    if (domain) {
        document.cookie = `googtrans=/tr/${langCode}; path=/; domain=${domain}`;
    }

    // Try to use Google Translate widget combo box
    const select = document.querySelector('.goog-te-combo');
    if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event('change'));
    }

    // Update language button text with dynamic flag emoji
    const currentLangText = document.getElementById('currentLangText');
    if (currentLangText) {
        const flag = flags[langCode] || '🇹🇷';
        currentLangText.innerText = `${flag} ${langCode.toUpperCase()}`;
    }

    // Handle RTL for Arabic and Persian
    document.body.classList.remove('lang-ru');
    if (langCode === 'ru') {
        document.body.classList.add('lang-ru');
    }
    if (langCode === 'ar' || langCode === 'fa') {
        document.documentElement.dir = 'rtl';
        document.body.classList.add('rtl');
    } else {
        document.documentElement.dir = 'ltr';
        document.body.classList.remove('rtl');
    }

    // Close language dropdown
    const langSelector = document.querySelector('.lang-selector');
    if (langSelector) langSelector.classList.remove('active');

    // If Google Translate widget isn't loaded yet, reload to apply
    if (!select) location.reload();
}

// Restore saved language on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('lang') || 'tr';
    const currentLangText = document.getElementById('currentLangText');
    if (currentLangText) {
        const flag = flags[savedLang] || '🇹🇷';
        currentLangText.innerText = `${flag} ${savedLang.toUpperCase()}`;
    }
    if (savedLang !== 'tr') {
        if (savedLang === 'ru') {
            document.body.classList.add('lang-ru');
        }
        if (savedLang === 'ar' || savedLang === 'fa') {
            document.documentElement.dir = 'rtl';
            document.body.classList.add('rtl');
        }
    }
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

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (savedTheme === null && prefersDark);
    setTheme(isDark);
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initTeamCarousel();

    // --- Global Dropdown & Menu Toggles (Event Delegation) ---
    document.addEventListener('click', (e) => {
        const langBtn = e.target.closest('#currentLang');
        const langSelector = document.querySelector('.lang-selector');
        const dropdownLink = e.target.closest('.dropdown > a');
        const mobileToggleBtn = e.target.closest('#mobileToggle');
        const navLinksMenu = document.querySelector('.navbar .nav-links');

        // Handle Language Selector
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
                langSelector?.classList.remove('active');

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
        if (!e.target.closest('.lang-selector') && !e.target.closest('.dropdown')) {
            langSelector?.classList.remove('active');
            document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('active'));
        }

        // Close mobile menu when clicking outside
        if (navLinksMenu?.classList.contains('active') && !navLinksMenu.contains(e.target) && !mobileToggleBtn) {
            navLinksMenu.classList.remove('active');
        }
    });
});

// --- Navbar Scroll Logic ---
let lastScroll = 0;
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    navbar?.classList.toggle('scrolled', currentScroll > 10);
    if (currentScroll <= 0) {
        navbar?.classList.remove('navbar--hidden');
        return;
    }
    if (currentScroll > lastScroll && !navbar?.classList.contains('navbar--hidden')) {
        navbar?.classList.add('navbar--hidden');
    } else if (currentScroll < lastScroll && navbar?.classList.contains('navbar--hidden')) {
        navbar?.classList.remove('navbar--hidden');
    }
    lastScroll = currentScroll;
});

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
            document.querySelectorAll('[data-count]').forEach(el => {
                el.textContent = (+el.getAttribute('data-count')).toLocaleString('tr-TR');
            });
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

        // Count-up for stats
        function animateCount(el) {
            const target = +el.getAttribute('data-count');
            const duration = 1600;
            const start = performance.now();
            function tick(now) {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
                el.textContent = Math.round(target * eased).toLocaleString('tr-TR');
                if (p < 1) requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        }

        const countObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }
})();

