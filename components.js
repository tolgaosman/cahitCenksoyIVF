/* =====================================================================
   Shared site chrome (navbar + footer) — single source of truth.
   Injected into <div id="site-header"></div> and <div id="site-footer"></div>.
   Load this BEFORE app.js. Injection runs synchronously on script eval,
   so the markup (and the IDs app.js depends on) exists before app.js runs.
   Keeps data-i18n attributes + notranslate so Google Translate still works.
   ===================================================================== */
(function () {
    var NAV_LINKS = [
        { href: 'index.html', i18n: 'navHome', label: 'Ana Sayfa' },
        { href: 'team.html', i18n: 'navTeam', label: 'Ekibimiz' },
        {
            i18n: 'navTreatments', label: 'Tedavi Seçenekleri', dropdown: [
                { href: 'pgd_pgs.html', i18n: 'navTreat1', label: 'PGD/PGS' },
                { href: 'tandem_dongusu.html', i18n: 'navTreat2', label: 'Tandem Döngüsü' },
                { href: 'sperm_bagisi.html', i18n: 'navTreat3', label: 'Sperm Bağışı' },
                { href: 'yumurta_bagisi.html', i18n: 'navTreat4', label: 'Yumurta Bağışı' },
                { href: 'embriyo_donasyonu.html', i18n: 'navTreat5', label: 'Embriyo Donasyonu' },
                { href: 'ngs_tedavisi.html', i18n: 'navTreat6', label: 'NGS Tedavisi' },
                { href: 'icsi_ile_ivf.html', i18n: 'navTreat7', label: 'ICSI ile IVF' },
                { href: 'sperm_ve_yumurta_dondurma.html', i18n: 'navTreat8', label: 'Sperm ve Yumurta Dondurma' }
            ]
        },
        { href: 'testimonials.html', i18n: 'navTestimonials', label: 'Hastalarımızdan' },
        { href: 'faq.html', i18n: 'navFAQ', label: 'Sık Sorulanlar' },
        { href: 'blog.html', i18n: 'navBlog', label: 'Blog' },
        { href: 'contact.html', i18n: 'navContact', label: 'İletişim & Randevu' }
    ];

    var LANGS = [
        { code: 'tr', flag: '🇹🇷' }, { code: 'en', flag: '🇬🇧' }, { code: 'ru', flag: '🇷🇺' },
        { code: 'de', flag: '🇩🇪' }, { code: 'fr', flag: '🇫🇷' }, { code: 'ar', flag: '🇸🇦' }, { code: 'fa', flag: '🇮🇷' }
    ];

    // Current page file name for active-link highlighting
    var path = window.location.pathname.split('/').pop() || 'index.html';
    if (path === '') path = 'index.html';

    function isActive(href) { return href === path; }

    function buildNavLinks() {
        return NAV_LINKS.map(function (item) {
            if (item.dropdown) {
                var childActive = item.dropdown.some(function (c) { return isActive(c.href); });
                var sub = item.dropdown.map(function (c) {
                    return '<li><a href="' + c.href + '" data-i18n="' + c.i18n + '">' + c.label + '</a></li>';
                }).join('');
                return '<li class="dropdown">' +
                    '<a href="javascript:void(0)" class="' + (childActive ? 'nav-link--active' : '') + '" data-i18n="' + item.i18n + '">' +
                    item.label + ' <i class="fa-solid fa-chevron-down"></i></a>' +
                    '<ul class="dropdown-menu">' + sub + '</ul></li>';
            }
            return '<li><a href="' + item.href + '" class="' + (isActive(item.href) ? 'nav-link--active' : '') + '" data-i18n="' + item.i18n + '">' + item.label + '</a></li>';
        }).join('');
    }

    function buildLangMenu() {
        // Flag + code per language; click → changeLanguage() (defined in app.js).
        return LANGS.map(function (l) {
            return '<li><a href="javascript:void(0)" class="lang-option" onclick="changeLanguage(\'' + l.code + '\')">' +
                '<span class="lang-flag">' + l.flag + '</span> ' + l.code.toUpperCase() + '</a></li>';
        }).join('');
    }

    var headerHTML =
        '<div id="google_translate_element"></div>' +
        '<nav class="navbar" id="navbar">' +
        '<div class="nav-container">' +
        '<div class="logo"><a href="index.html"><img src="siyahLogo.png" alt="Dr. Cahit Cenksoy" id="navLogo"></a></div>' +
        '<div class="nav-center"><ul class="nav-links">' + buildNavLinks() + '</ul></div>' +
        '<div class="nav-right">' +
        '<div class="lang-selector notranslate">' +
        '<button class="lang-btn" id="currentLang"><span id="currentLangText">TR</span> <i class="fa-solid fa-globe"></i></button>' +
        '<ul class="dropdown-menu">' + buildLangMenu() + '</ul>' +
        '</div>' +
        '<button id="themeToggle" class="theme-toggle"><i class="fa-solid fa-moon"></i></button>' +
        '<button class="mobile-toggle" id="mobileToggle"><i class="fa-solid fa-bars"></i></button>' +
        '</div>' +
        '</div></nav>';

    var footerHTML =
        '<footer class="site-footer"><div class="container"><div class="footer-container">' +
        '<div class="footer-left">' +
        '<img src="siyahLogo.png" alt="Dr. Cahit Cenksoy Logo" id="footerLogo" style="max-height: 80px; margin-bottom: 20px;">' +
        '<p class="hospital-name"><i class="fa-solid fa-location-dot" style="margin-right: 8px; color: var(--accent-2);"></i> ' +
        '<span data-i18n="footerHospital">Nicosia IVF - Nicosia Sevinç Hospital</span></p>' +
        '<div class="social-links">' +
        '<a href="https://www.instagram.com/drcahitcenksoy/" class="social-box" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-instagram"></i></a>' +
        '<a href="https://www.facebook.com/p/Dr-Cahit-Cenksoy-100064112829620/" class="social-box" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-facebook-f"></i></a>' +
        '</div></div>' +
        '<div class="footer-right">' +
        '<h3 class="contact-title" data-i18n="footerContactTitle">İLETİŞİM BİLGİLERİ</h3>' +
        '<div class="contact-columns">' +
        '<div class="contact-col">' +
        '<h4 class="contact-col-title"><i class="fa-solid fa-phone"></i> <span data-i18n="footerPhone">TELEFON</span></h4>' +
        '<ul class="footer-contact-list">' +
        '<li class="footer-contact-item"><a href="tel:+905488880112" target="_blank" rel="noopener noreferrer" class="footer-link"><span>+90 548 888 0 112</span></a></li>' +
        '<li class="footer-contact-item"><a href="tel:+905428880112" target="_blank" rel="noopener noreferrer" class="footer-link"><span class="ltr-text">+90 542 888 0 112</span></a></li>' +
        '<li class="footer-contact-item"><a href="tel:+903924440112" target="_blank" rel="noopener noreferrer" class="footer-link"><span class="ltr-text">+90 392 444 0 112</span></a></li>' +
        '<li class="footer-contact-item"><a href="tel:+905338681983" target="_blank" rel="noopener noreferrer" class="footer-link"><span class="ltr-text">+90 533 868 1983</span></a></li>' +
        '</ul></div>' +
        '<div class="contact-col">' +
        '<h4 class="contact-col-title"><i class="fa-solid fa-envelope"></i> <span data-i18n="footerEmail">E-POSTA</span></h4>' +
        '<ul class="footer-contact-list">' +
        '<li class="footer-contact-item"><span>c_cenksoy@hotmail.com</span></li>' +
        '<li class="footer-contact-item"><span>ufukozbas0675@gmail.com</span></li>' +
        '</ul></div>' +
        '</div></div>' +
        '</div></div></footer>';

    function inject() {
        var header = document.getElementById('site-header');
        if (header && !header.dataset.injected) { header.innerHTML = headerHTML; header.dataset.injected = '1'; }
        var footer = document.getElementById('site-footer');
        if (footer && !footer.dataset.injected) { footer.innerHTML = footerHTML; footer.dataset.injected = '1'; }
    }

    // Inject immediately for any placeholders already parsed (script sits after them),
    // and again on DOMContentLoaded as a safety net.
    inject();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inject);
    }
})();
