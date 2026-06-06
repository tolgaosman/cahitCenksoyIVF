// --- Google Translate (Select-Trigger Method) ---
// We use localStorage to remember the language (works on file://)
// and programmatically trigger Google's hidden <select> dropdown.

// Language code â†’ flag emoji (rendered via the Twemoji polyfill font).
var langFlags = { tr: 'ðŸ‡¹ðŸ‡·', en: 'ðŸ‡ºðŸ‡¸', ru: 'ðŸ‡·ðŸ‡º', de: 'ðŸ‡©ðŸ‡ª', fr: 'ðŸ‡«ðŸ‡·', ar: 'ðŸ‡¸ðŸ‡¦', fa: 'ðŸ‡®ðŸ‡·' };

window.googleTranslateElementInit = function() {
    try {
        new google.translate.TranslateElement({
            pageLanguage: 'tr',
            includedLanguages: 'tr,en,ru,de,fr,ar,fa',
            autoDisplay: false
        }, 'google_translate_element');
    } catch (e) {}
};

function updateLangButton(langCode) {
    var flagEl = document.getElementById('currentLangFlag');
    if (flagEl) flagEl.textContent = langFlags[langCode] || langFlags.tr;
    document.querySelectorAll('.lang-option').forEach(function (a) {
        a.classList.toggle('active', a.dataset.lang === langCode);
    });
}

function triggerGoogleTranslate(langCode) {
    var select = document.querySelector('.goog-te-combo');
    if (select) {
        // If it's already translated, or if we want to restore original
        if (langCode === 'tr') {
            // To restore, we must click the "Show Original" iframe button or clear cookie
            var iframe = document.querySelector('iframe.goog-te-banner-frame');
            if (iframe) {
                var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
                var restoreBtn = innerDoc.getElementById(':1.restore') || innerDoc.getElementById('restore');
                if (restoreBtn) restoreBtn.click();
            }
            // Clear google cookie fallback
            document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            location.reload();
            return;
        }
        
        select.value = langCode;
        select.dispatchEvent(new Event('change'));
    } else {
        // Retry if Google Translate hasn't rendered yet
        setTimeout(function() { triggerGoogleTranslate(langCode); }, 500);
    }
}

// Flag click handler
function changeLanguage(langCode) {
    localStorage.setItem('lang', langCode);
    var sel = document.querySelector('.lang-selector');
    if (sel) sel.classList.remove('active');
    
    updateLangButton(langCode);
    triggerGoogleTranslate(langCode);
}

// Restore saved language on load
document.addEventListener('DOMContentLoaded', function () {
    var savedLang = localStorage.getItem('lang') || 'tr';
    updateLangButton(savedLang);
    if (savedLang !== 'tr') {
        // Wait for Google script to inject the combo box
        setTimeout(function() { triggerGoogleTranslate(savedLang); }, 1000);
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

        // Handle language pick (flag click) â†’ translate via reload
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
// Scatters the two hero sphere designs (glossy pink + lavender) at random
// points across the ENTIRE page, top to bottom, in a full-height overlay
// layer that sits behind the content. Spheres are distributed in vertical
// bands so they reach all the way to the footer without clumping.
(function initDecoSpheres() {
    // Only the two hero looks are used. `sm/md/lg` pick a size variant.
    const PINK = ['pink-sm', 'pink-md', 'pink-lg'];
    const LAV  = ['lav-sm', 'lav-md', 'lav-lg'];
    const ANIMS = ['float', 'floatSlow', 'floatFast'];

    function rand(min, max) { return min + Math.random() * (max - min); }
    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    let layer = null;

    function build() {
        // Respect reduced motion â€” no decorative spheres at all.
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        // Full-page overlay layer (absolute, spans the whole document height).
        if (!layer) {
            layer = document.createElement('div');
            layer.className = 'deco-sphere-layer';
            document.body.appendChild(layer);
        }
        layer.innerHTML = '';

        const docH = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight
        );
        const vw = window.innerWidth;

        // Pin the layer to the full document height explicitly. A CSS height:100%
        // on an absolutely-positioned element resolves against the viewport, not
        // the document, so without this only the first screen would show spheres.
        layer.style.height = docH + 'px';

        // One sphere per ~360px of page height (a bit denser on wide screens),
        // distributed band-by-band so coverage reaches the bottom evenly.
        const bandH = 360;
        const bands = Math.max(4, Math.ceil(docH / bandH));

        for (let b = 0; b < bands; b++) {
            // 1â€“2 spheres per band, random horizontal placement.
            const count = Math.random() < 0.5 ? 1 : 2;
            for (let i = 0; i < count; i++) {
                const el = document.createElement('div');
                // Alternate the two hero designs, randomly sized.
                const usePink = Math.random() < 0.5;
                el.className = 'deco-sphere ' + pick(usePink ? PINK : LAV);

                // Vertical position: somewhere inside this band.
                const top = (b * bandH) + rand(0, bandH);
                // Horizontal: allow slight bleed off both edges like the hero.
                const left = rand(-4, 96);

                el.style.top = top.toFixed(0) + 'px';
                el.style.left = left.toFixed(1) + '%';
                el.style.opacity = rand(0.28, 0.6).toFixed(2);

                el.style.animationName = pick(ANIMS);
                el.style.animationDuration = rand(7, 12).toFixed(1) + 's';
                el.style.animationDelay = '-' + rand(0, 8).toFixed(1) + 's';

                layer.appendChild(el);
            }
        }
        // On narrow phones, thin out so it doesn't crowd the content.
        if (vw <= 768) {
            Array.from(layer.children).forEach((el, idx) => {
                if (idx % 2 === 0) el.remove();
            });
        }
    }

    // Rebuild on load (document height known) and after late content (Firebase
    // team cards) lands; debounce resizes.
    let resizeTimer = null;
    function scheduleRebuild() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(build, 250);
    }

    function start() {
        build();
        // Re-measure once images/fonts/Firebase content settle.
        window.addEventListener('load', scheduleRebuild);
        setTimeout(build, 1500);
        window.addEventListener('resize', scheduleRebuild, { passive: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
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
/ /   - - -   P r o c e s s   M o d a l   D e s c r i p t i o n s   ( T u r k i s h   o n l y   -   G o o g l e   T r a n s l a t e   h a n d l e s   o t h e r   l a n g u a g e s )   - - -  
 c o n s t   p r o c D e s c r i p t i o n s   =   {  
         1 :   {  
                 t i t l e :   " %û n   G %Â r %]%<%_m e " ,  
                 d e s c :   " T %]%p   b e b e k   t e d a v i s i n d e ,   t e d a v i   s e %e n e  %_i   n e   o l u r s a   o l s u n   %Â n c e l i k l e   a n n e   v e   b a b a   a d a y  %’%n  %’%n   d e t a y l  %’%  b i l g i l e r i   a l  %’%n  %’%r .   B u   b i l g i l e r e   e k   o l a r a k   %Â n c e s i n d e   y a p  %’%l m  %’%<%_  o l a n   t %]%m   a m e l i y a t , g %Â r %]%n t %]%l e m e   y %Â n t e m l e r i   ( r a h i m   f i l m i ,   v b . ) ,   k a n   v e   s p e r m   t e s t   s o n u %l a r  %’%  d e  %_e r l e n d i r i l i r .   B u   b i l g i l e r i n   a n a l i z   e d i l m e s i   t %]%p   b e b e k   b a <%_a r  %’%s  %’%n d a   h a y a t i   %Â n e m   t a <%_ %’%r .   %ç i f t e   t a l e p   e t t i k l e r i   t e d a v i   s o r u l u r . "  
         } ,  
         2 :   {  
                 t i t l e :   " T e d a v i n i n   P l a n l a n m a s  %’%" ,  
                 d e s c :   " M e v c u t   v e r i l e r    %’%<%_ %’% %_ %’%n d a   u y g u n   t e d a v i   p l a n l a n  %’%r .   K  %’%b r  %’%s Ô Ç Ö t a   t %]%p   b e b e k   t e d a v i s i   b a <%_l a m a d a n   %Â n c e ,   %Â n   h a z  %’%r l  %’% %_ %’%n   %i f t i n   y a <%_a d  %’% %_ %’%  %]%l k e d e   y a p  %’%l m a s  %’%  s e y a h a t   s %]%r e s i n i   k  %’%s a l t  %’%r .   Z a m a n   k  %’%s  %’%t l a m a s  %’%  o l m a y a n   v e y a   t e d a v i   s %]%r e c i n d e   K  %’%b r  %’%s Ô Ç Ö t a   t a t i l   p l a n l a y a n   %i f t l e r i n   t %]%m   s %]%r e c i   b u r a d a   g e %i r m e s i   t e r c i h   e d i l i r .   P l a n l a n a n   t e d a v i   K  %’%b r  %’%s Ô Ç Ö t a   y u m u r t a   d o n a s y o n u   i s e   a n n e   a d a y  %’%n  %’%n   h o r m o n   d %]%z e y l e r i   a d e t i n i n   2 .   v e y a   3 .   g %]%n %]%  k o n t r o l   e d i l i r .   U y g u n   d %]%z e y d e   i s e   r a h i m   d u v a r  %’%  h a z  %’%r l  %’% %_ %’%n a   b a <%_l a n  %’%r .   R a h i m   d u v a r  %’%  k a l  %’%n l  %’% %_ %’%  u y g u n   s e v i y e y e   u l a <%_t  %’% %_ %’%  z a m a n   p r o g e s t e r o n   h o r m o n u   t e d a v i s i   b a <%_l a n m a s  %’%  g e r e k i r .   P r o g e s t e r o n   b a <%_l a n a c a  %_ %’%  g %]%n   e <%_i n i n   d e   s p e r m   v e r m e s i   g e r e k t i  %_i n d e n   %i f t i n   K  %’%b r  %’%s Ô Ç Ö t a   o l m a s  %’%  g e r e k i r .   B a b a   a d a y  %’%  s p e r m   %Â r n e  %_i n i   d a h a   %Â n c e d e n   v e r m i <%_  i s e   a n n e   a d a y  %’%n  %’%n   t r a n s f e r d e n   s a d e c e   b i r   g %]%n   %Â n c e s i n d e   K  %’%b r  %’%s Ô Ç Ö t a   o l m a s  %’%  y e t e r l i d i r .   S p e r m   d o n a s y o n u n d a   i s e   a n n e   a d a y  %’%n  %’%n   y u m u r t a l a r  %’%  t o p l a n m a d a n   ( O P U )   s a d e c e   b i r   g %]%n   %Â n c e   K  %’%b r  %’%s Ô Ç Ö t a   o l m a s  %’%  y e t e r l i d i r .   T e d a v i   e m b r i y o   d o n a s y o n u   o l a c a k   i s e   %i f t i n   y i n e   t r a n s f e r   t a r i h i n d e n   s a d e c e   b i r   g %]%n   %Â n c e   K  %’%b r  %’%s Ô Ç Ö t a   o l m a s  %’%  y e t e r l i d i r . "  
         } ,  
         3 :   {  
                 t i t l e :   " S e y a h a t " ,  
                 d e s c :   " K  %’%b r  %’%s Ô Ç Ö   t a   t %]%p   b e b e k   t e d a v i s i   i %i n   u l a <%_ %’%m   y o l u   g e n e l l i k l e   u %a k   s e y a h a t i d i r .   D e n i z   y o l u y l a   T %]%r k i y e   %]%z e r i n d e n   d e n i z   o t o b %]%s %]%  i l e   2 - 3   s a a t l i k   y o l c u l u k l a   d a   u l a <%_m a k   m %]%m k %]%n d %]%r .   H a v a   y o l u y l a   L e f k o <%_a   E r c a n   H a v a l i m a n  %’%  v e y a   L a r n a k a   h a v a l i m a n  %’%n d a n   u l a <%_ %’%m   k o l a y l  %’%k l a   s a  %_l a n a b i l i r .   A v r u p a   %]%z e r i n d e n   g e l e c e k   o l a n   y o l c u l a r  %’%m  %’%z   i %i n   L a r n a k a   h a v a l i m a n  %’%n a   d i r e k   u %u <%_l a r   b u l u n m a k t a d  %’%r .   S e y a h a t i n   e n   b a <%_ %’%n d a n   s o n u n a   k a d a r   h e r   n o k t a s  %’%n d a   m e r k e z i m i z   i s t e n d i  %_i   t a k d i r d e   y a r d  %’%m   s a  %_l a m a k t a d  %’%r .   H a v a l i m a n  %’%  u l a <%_ %’%m l a r  %’%,   u %a k   b i l e t l e r i ,   o t e l d e n   t %]%p   b e b e k   m e r k e z i n e   u l a <%_ %’%m ,   t u r i s t i k   a m a %l  %’%  g e z i l e r   d a h i l   h e r   t %]%r l %]%  u l a <%_ %’%m   i m k a n  %’%  s a  %_l a n a b i l i r . "  
         } ,  
         4 :   {  
                 t i t l e :   " K o n a k l a m a " ,  
                 d e s c :   " K  %’%b r  %’%s Ô Ç Ö t a   t %]%p   b e b e k   t e d a v i s i   s  %’%r a s  %’%n d a   k o n a k l a m a   i %i n   o l d u k %a   f a z l a   s e %e n e k   m e v c u t t u r .   M e r k e z e   y %]%r %]%m e   m e s a f e s i n d e   b e <%_  y  %’%l d  %’%z l  %’%  o l d u k %a   k o n f o r l u   o t e l l e r   o l a b i l e c e  %_i   g i b i ,   o l d u k %a   u y g u n   f i y a t l  %’%  b u t i k   o t e l l e r   d e   m e v c u t t u r .   T %]%p   b e b e k   t e d a v i s i n i n   K  %’%b r  %’%s Ô Ç Ö t a   y a p  %’%l m a s  %’%  t e r c i h   e t m e k   a n n e   v e   b a b a   a d a y  %’%n  %’%n   s t r e s i n i   a z a l t  %’%r .    %‘%k l i m i n   h e m e n   h e m e n   h e r   m e v s i m    %’%l  %’%m a n   o l d u  %_u   b u   g %]%z e l   a d a d a   t a t i l   y a p a r k e n   b e b e k   s a h i b i   o l a b i l i r s i n i z . "  
         } ,  
         5 :   {  
                 t i t l e :   " T e d a v i " ,  
                 d e s c :   " K  %’%b r  %’%s Ô Ç Ö t a   T %]%p   B e b e k   T e d a v i s i   s e %i l e c e k   y %Â n t e m e   g %Â r e   d e  %_i <%_k e n l i k   g %Â s t e r s e   d e   t e d a v i l e r i n   o l d u k %a   g e n i <%_  a % %’%k l a m a s  %’%  a n a   s a y f a m  %’%z d a   y e r   a l m a k t a d  %’%r .   D a h a   f a z l a   b i l g i   v e   a y r  %’%n t  %’%  i %i n   b i z i m l e   i l e t i <%_i m e   g e %e b i l i r s i n i z . "  
         } ,  
         6 :   {  
                 t i t l e :   " G e b e l i k   T e s t i " ,  
                 d e s c :   " K  %’%b r  %’%s Ô Ç Ö t a   t %]%p   b e b e k   t e d a v i s i   s o n r a s  %’%  %i f t l e r i n   %o  %_u   t r a n s f e r d e n   b i r   g %]%n   s o n r a   k e n d i   y a <%_a d  %’%k l a r  %’%  %]%l k e y e   d %Â n m e k t e d i r .   B i z i m   %Â n e r i m i z   t r a n s f e r d e n   1 2   g %]%n   s o n r a   k a n d a   g e b e l i k   t e s t i   ( b - H C G   )   y a p  %’%l m a s  %’%d  %’%r .   %û n c e s i n d e   y a p  %’%l a n   i d r a r   v e y a   k a n   t e s t l e r i   y a n  %’%l t  %’%c  %’%  o l a b i l m e k t e d i r . "  
         }  
 } ;  
 