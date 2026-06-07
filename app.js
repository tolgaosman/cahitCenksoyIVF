// --- Google Translate (Cookie + Reload Method) ---
// We use cookies to tell the Google Translate widget which language to display.
// Reloading the page ensures the Google script reads the cookie and translates perfectly.

var langFlags = { tr: '🇹🇷', en: '🇺🇸', ru: '🇷🇺', de: '🇩🇪', fr: '🇫🇷', ar: '🇸🇦', fa: '🇮🇷' };

window.googleTranslateElementInit = function() {
    try {
        new google.translate.TranslateElement({
            pageLanguage: 'tr',
            includedLanguages: 'tr,en,ru,de,fr,ar,fa',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
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

// Write the googtrans cookie that the Google Translate widget reads on load.
// Set it for the bare path AND (on real domains) for both `host` and `.host`
// variants so the widget finds it whether the page is on apex or www subdomain.
function setGoogtransCookie(langCode) {
    var value = '/tr/' + langCode;
    document.cookie = 'googtrans=' + value + '; path=/;';
    var host = window.location.hostname;
    if (host && host !== 'localhost' && !/^[0-9.]+$/.test(host)) {
        document.cookie = 'googtrans=' + value + '; path=/; domain=' + host;
        document.cookie = 'googtrans=' + value + '; path=/; domain=.' + host;
    }
}

// Delete the googtrans cookie (all variants) so the page restores to Turkish.
function clearGoogtransCookie() {
    var past = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'googtrans=; path=/; ' + past;
    var host = window.location.hostname;
    if (host && host !== 'localhost') {
        document.cookie = 'googtrans=; path=/; domain=' + host + '; ' + past;
        document.cookie = 'googtrans=; path=/; domain=.' + host + '; ' + past;
    }
}

// Flag click handler: set/clear the cookie then reload. On reload the hidden
// #google_translate_element widget reads the cookie and translates the page
// (or, for Turkish with no cookie, leaves the original content as-is).
window.changeLanguage = function(langCode) {
    localStorage.setItem('lang', langCode);
    var sel = document.querySelector('.lang-selector');
    if (sel) sel.classList.remove('active');
    updateLangButton(langCode);

    if (langCode === 'tr') {
        clearGoogtransCookie();
    } else {
        setGoogtransCookie(langCode);
    }

    // Always reload so Google Translate applies the cookie cleanly.
    location.reload();
};

// Restore saved language on load: reflect it on the button and re-assert the
// cookie (in case it expired) so the widget translates on this load too.
document.addEventListener('DOMContentLoaded', function () {
    var savedLang = localStorage.getItem('lang') || 'tr';
    updateLangButton(savedLang);
    if (savedLang !== 'tr') {
        setGoogtransCookie(savedLang);
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
// --- Global Toast Notification Utility ---
function showToast(message, iconClass = 'fa-solid fa-circle-check', duration = 3000) {
    let toast = document.getElementById('globalToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'globalToast';
        toast.className = 'custom-toast';
        document.body.appendChild(toast);
    }
    toast.innerHTML = '<i class="' + iconClass + '"></i> <span>' + message + '</span>';
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, duration);
}

// --- Process Modal Descriptions ---
const procDescriptions = {
    1: {
        title: 'Ön Görüşme',
        desc: 'Tüp bebek tedavisinde, tedavi seçeneği ne olursa olsun öncelikle anne ve baba adayının detaylı bilgileri alınır. Bu bilgilere ek olarak öncesinde yapılmış olan tüm ameliyat, görüntüleme yöntemleri (rahim filmi, vb.), kan ve sperm test sonuçları değerlendirilir. Bu bilgilerin analiz edilmesi tüp bebek başarısında hayati önem taşır. Çifte talep ettikleri tedavi sorulur.'
    },
    2: {
        title: 'Tedavinin Planlanması',
        desc: 'Mevcut veriler ışığında uygun tedavi planlanır. Kıbrıs’ta tüp bebek tedavisi başlamadan önce, ön hazırlığın çiftin yaşadığı ülkede yapılması seyahat süresini kısaltır. Zaman kısıtlaması olmayan veya tedavi sürecinde Kıbrıs’ta tatil planlayan çiftlerin tüm süreci burada geçirmesi tercih edilir. Planlanan tedavi Kıbrıs’ta yumurta donasyonu ise anne adayının hormon düzeyleri adetinin 2. veya 3. günü kontrol edilir. Uygun düzeyde ise rahim duvarı hazırlığına başlanır. Rahim duvarı kalınlığı uygun seviyeye ulaştığı zaman progesteron hormonu tedavisi başlanması gerekir. Progesteron başlanacağı gün eşinin de sperm vermesi gerektiğinden çiftin Kıbrıs’ta olması gerekir. Baba adayı sperm örneğini daha önceden vermiş ise anne adayının transferden sadece bir gün öncesinde Kıbrıs’ta olması yeterlidir. Sperm donasyonunda ise anne adayının yumurtaları toplanmadan (OPU) sadece bir gün önce Kıbrıs’ta olması yeterlidir. Tedavi embriyo donasyonu olacak ise çiftin yine transfer tarihinden sadece bir gün önce Kıbrıs’ta olması yeterlidir.'
    },
    3: {
        title: 'Seyahat',
        desc: 'Kıbrıs’ ta tüp bebek tedavisi için ulaşım yolu genellikle uçak seyahatidir. Deniz yoluyla Türkiye üzerinden deniz otobüsü ile 2-3 saatlik yolculukla da ulaşmak mümkündür. Hava yoluyla Lefkoşa Ercan Havalimanı veya Larnaka havalimanından ulaşım kolaylıkla sağlanabilir. Avrupa üzerinden gelecek olan yolcularımız için Larnaka havalimanına direk uçuşlar bulunmaktadır. Seyahatin en başından sonuna kadar her noktasında merkezimiz istendiği takdirde yardım sağlamaktadır. Havalimanı ulaşımları, uçak biletleri, otelden tüp bebek merkezine ulaşım, turistik amaçlı geziler dahil her türlü ulaşım imkanı sağlanabilir.'
    },
    4: {
        title: 'Konaklama',
        desc: 'Kıbrıs’ta tüp bebek tedavisi sırasında konaklama için oldukça fazla seçenek mevcuttur. Merkeze yürüme mesafesinde beş yıldızlı oldukça konforlu oteller olabileceği gibi, oldukça uygun fiyatlı butik oteller de mevcuttur. Tüp bebek tedavisinin Kıbrıs’ta yapılması tercih etmek anne ve baba adayının stresini azaltır. İklimin hemen hemen her mevsim ılıman olduğu bu güzel adada tatil yaparken bebek sahibi olabilirsiniz.'
    },
    5: {
        title: 'Tedavi',
        desc: 'Kıbrıs’ta Tüp Bebek Tedavisi seçilecek yönteme göre değişkenlik gösterse de tedavilerin oldukça geniş açıklaması ana sayfamızda yer almaktadır. Daha fazla bilgi ve ayrıntı için bizimle iletişime geçebilirsiniz.'
    },
    6: {
        title: 'Gebelik Testi',
        desc: 'Kıbrıs’ta tüp bebek tedavisi sonrası çiftlerin çoğu transferden bir gün sonra kendi yaşadıkları ülkeye dönmektedir. Bizim önerimiz transferden 12 gün sonra kanda gebelik testi (b-HCG ) yapılmasıdır. Öncesinde yapılan idrar veya kan testleri yanıltıcı olabilmektedir.'
    }
};


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
        // Respect reduced motion — no decorative spheres at all.
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
            // 1–2 spheres per band, random horizontal placement.
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
