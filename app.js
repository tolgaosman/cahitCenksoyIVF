// --- Google Translate Integration ---
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'tr',
        includedLanguages: 'en,ru,de,ar,tr',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
}

function changeLanguage(langCode) {
    localStorage.setItem('lang', langCode);
    
    const domain = window.location.hostname === 'localhost' ? '' : '.' + window.location.hostname;
    document.cookie = `googtrans=/tr/${langCode}; path=/; domain=${domain}`;
    
    const select = document.querySelector('.goog-te-combo');
    if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event('change'));
    }
    
    const currentLangText = document.getElementById('currentLangText');
    if (currentLangText) currentLangText.innerText = langCode.toUpperCase();
    
    if (langCode === 'ar') {
        document.documentElement.dir = 'rtl';
        document.body.classList.add('rtl');
    } else {
        document.documentElement.dir = 'ltr';
        document.body.classList.remove('rtl');
    }

    if (!select) location.reload();
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('lang') || 'tr';
    if (savedLang !== 'tr') {
        const currentLangText = document.getElementById('currentLangText');
        if (currentLangText) currentLangText.innerText = savedLang.toUpperCase();
        if (savedLang === 'ar') {
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
    applyTranslations();
    initTheme();
    initTeamCarousel();

    const langBtn = document.getElementById('currentLang');
    const langSelector = document.querySelector('.lang-selector');
    if (langBtn && langSelector) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langSelector.classList.toggle('active');
        });
        document.addEventListener('click', () => langSelector.classList.remove('active'));
    }
});

// --- Navbar Scroll Logic ---
let lastScroll = 0;
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
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

// --- Mobile Nav ---
const mobileToggle = document.getElementById('mobileToggle');
const navLinksMenu = document.querySelector('.navbar .nav-links');
mobileToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinksMenu?.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (navLinksMenu?.classList.contains('active') && !navLinksMenu.contains(e.target) && e.target !== mobileToggle) {
        navLinksMenu.classList.remove('active');
    }
});

// Process Modal Logic
function openProcessModal(step) {
    const modal = document.getElementById('processModal');
    const title = document.getElementById('modalTitle');
    const desc = document.getElementById('modalDescription');
    const lang = document.documentElement.lang || 'tr';
    
    if (!modal || !title || !desc) return;

    const getTranslation = (key) => (translations[lang] && translations[lang][key]) || (translations['tr'][key]) || "";
    
    title.innerText = getTranslation('proc' + step + 'Title');
    desc.innerHTML = getTranslation('proc' + step + 'Desc');
    
    const closeBtn = modal.querySelector('[data-i18n="modalClose"]');
    if (closeBtn) closeBtn.innerHTML = getTranslation('modalClose');
    
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

    const scrollWidth = () => carousel.querySelector('.team-card').offsetWidth + 30;

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
