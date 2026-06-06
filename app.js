// --- Native i18n Translation System ---
// Relies on translations.js which defines window.translations

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

// Apply translations from the window.translations object to the DOM
function applyTranslations(langCode) {
    if (!window.translations || !window.translations[langCode]) return;
    
    var dict = window.translations[langCode];
    var elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        if (dict[key]) {
            // Check if element has HTML inside (like an icon). If so, we only replace text nodes,
            // or we expect the user to wrap text in a <span>.
            // For now, simple text replacement since our data-i18n elements only contain text.
            el.textContent = dict[key];
        }
    });
    
    // Adjust layout direction for RTL languages (Arabic, Persian)
    if (langCode === 'ar' || langCode === 'fa') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.body.classList.add('rtl-mode');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.body.classList.remove('rtl-mode');
    }
}

// Flag click handler: save to localStorage and update UI.
function changeLanguage(langCode) {
    localStorage.setItem('lang', langCode);
    var sel = document.querySelector('.lang-selector');
    if (sel) sel.classList.remove('active');
    
    updateLangButton(langCode);
    applyTranslations(langCode);
}

// Restore saved language on load
document.addEventListener('DOMContentLoaded', function () {
    var savedLang = localStorage.getItem('lang') || 'tr';
    updateLangButton(savedLang);
    applyTranslations(savedLang);
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

// --- Interactive layer: scroll progress, count-up, card tilt, magnetic
//     buttons, hero parallax. Fully gated behind prefers-reduced-motion. ---
(function initInteractions() {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function run() {
        // ---- Scroll progress bar ----
        if (!reduced) {
            const bar = document.createElement('div');
            bar.className = 'scroll-progress';
            document.body.appendChild(bar);
            const onScroll = () => {
                const h = document.documentElement;
                const max = h.scrollHeight - h.clientHeight;
                bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
            };
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
        }

        // ---- Count-up numbers (stat-bar <h2> + hero-badge <strong>) ----
        // Parses the existing rendered number so content stays the single
        // source of truth; preserves the original separator/suffix (%, . , ).
        function countUp(el) {
            const raw = el.textContent.trim();
            const match = raw.match(/[\d.,]+/);
            if (!match) return;
            const numStr = match[0];
            const target = parseInt(numStr.replace(/[.,]/g, ''), 10);
            if (!isFinite(target)) return;
            const usesDot = numStr.includes('.');
            const usesComma = numStr.includes(',') && !usesDot;
            const prefix = raw.slice(0, match.index);
            const suffix = raw.slice(match.index + numStr.length);
            const fmt = (n) => {
                let s = String(n);
                if (usesDot) s = n.toLocaleString('tr-TR');
                else if (usesComma) s = n.toLocaleString('en-US');
                return prefix + s + suffix;
            };
            const dur = 1400, start = performance.now();
            function tick(now) {
                const p = Math.min((now - start) / dur, 1);
                const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
                el.textContent = fmt(Math.round(target * eased));
                if (p < 1) requestAnimationFrame(tick);
                else { el.textContent = raw; el.classList.add('count-done'); }
            }
            requestAnimationFrame(tick);
        }

        const counters = document.querySelectorAll('.stats-bar .stat-item h2, .hero-badge strong');
        if (reduced || !('IntersectionObserver' in window)) {
            // leave numbers as-is
        } else {
            const cObs = new IntersectionObserver((entries, obs) => {
                entries.forEach(e => {
                    if (e.isIntersecting) { countUp(e.target); obs.unobserve(e.target); }
                });
            }, { threshold: 0.4 });
            counters.forEach(el => cObs.observe(el));
        }

        if (reduced) return;

        // ---- Cursor-tracked 3D tilt + sheen on cards ----
        const tiltEls = document.querySelectorAll('.feature-item, .service-card, .process-card, .team-card');
        tiltEls.forEach(card => {
            if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
            const sheen = document.createElement('span');
            sheen.className = 'tilt-sheen';
            card.appendChild(sheen);

            card.addEventListener('pointermove', (e) => {
                if (e.pointerType === 'touch') return;
                const r = card.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width;
                const py = (e.clientY - r.top) / r.height;
                card.style.setProperty('--rx', ((px - 0.5) * 12).toFixed(2) + 'deg');
                card.style.setProperty('--ry', ((0.5 - py) * 12).toFixed(2) + 'deg');
                card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
                card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
                card.classList.add('tilt');
            });
            card.addEventListener('pointerleave', () => {
                card.classList.remove('tilt');
                card.style.removeProperty('--rx');
                card.style.removeProperty('--ry');
            });
        });

        // ---- Magnetic pull + click ripple on buttons ----
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('pointermove', (e) => {
                if (e.pointerType === 'touch') return;
                const r = btn.getBoundingClientRect();
                const mx = (e.clientX - r.left - r.width / 2) * 0.18;
                const my = (e.clientY - r.top - r.height / 2) * 0.28;
                btn.style.transform = `translate(${mx.toFixed(1)}px, ${(my - 3).toFixed(1)}px)`;
            });
            btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
            btn.addEventListener('click', (e) => {
                const r = btn.getBoundingClientRect();
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                const size = Math.max(r.width, r.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (e.clientX - r.left - size / 2) + 'px';
                ripple.style.top = (e.clientY - r.top - size / 2) + 'px';
                btn.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });

        // ---- Hero pointer parallax ----
        const hero = document.querySelector('.hero');
        if (hero) {
            const b1 = hero.querySelector('.hero-blob.b1');
            const b2 = hero.querySelector('.hero-blob.b2');
            const photo = hero.querySelector('.hero-photo');
            hero.addEventListener('pointermove', (e) => {
                if (e.pointerType === 'touch') return;
                const r = hero.getBoundingClientRect();
                const dx = (e.clientX - r.left) / r.width - 0.5;
                const dy = (e.clientY - r.top) / r.height - 0.5;
                if (b1) b1.style.transform = `translate(${dx * 30}px, ${dy * 30}px)`;
                if (b2) b2.style.transform = `translate(${dx * -24}px, ${dy * -24}px)`;
                if (photo) photo.style.transform = `translate(${dx * 12}px, ${dy * 12}px)`;
            });
            hero.addEventListener('pointerleave', () => {
                if (b1) b1.style.transform = '';
                if (b2) b2.style.transform = '';
                if (photo) photo.style.transform = '';
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }
})();
