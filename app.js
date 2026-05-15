// --- Translations Dictionary ---
const translations = {
    tr: {
        logoText: "Dr. Cahit Cenksoy",
        navHome: "ANA SAYFA",
        navTeam: "EKİBİMİZ",
        navIVF: "TÜP BEBEK (IVF)",
        ivfProcess: "Tüp Bebek Süreci",
        ivfICSI: "Mikroenjeksiyon (ICSI)",
        ivfIMSI: "IMSI",
        navTreatments: "TEDAVİ SEÇENEKLERİ",
        treatmentEggFreezing: "Yumurta Dondurma",
        treatmentDonation: "Donasyon",
        treatmentPGD: "PGT / PGS",
        navTestimonials: "HASTALARIMIZDAN",
        navFAQ: "SIK SORULANLAR",
        navBlogs: "BLOG",
        navContact: "İLETİŞİM",
        
        heroTitle: "Birlikte Mucizeler Yaratıyoruz",
        heroSubtitle: "Uzman bakım ve şefkatle yönlendirilen, ebeveynlik yolculuğunuza özel en son teknoloji tüp bebek tedavileri.",
        heroBtnPrimary: "Danışmanlık Alın",
        heroBtnSecondary: "Tedavileri İncele",
        
        teamTitle: "Ekibimiz",
        teamRole1: "Baş Tüp Bebek Uzmanı",
        teamDesc1: "Üreme tıbbı ve ileri tüp bebek teknolojilerinde 20 yılı aşkın deneyim.",
        teamRole2: "Tüp Bebek Koordinatörü",
        teamRole3: "Embriyolog",
        teamRole4: "Hemşire",
        teamRole5: "Hasta Koordinatörü",
        teamRole6: "Asistan",
        teamRole7: "Uluslararası Koordinatör",
        stat1Num: "3640",
        stat1Label: "TOPLAM IVF SIKLUSU",
        stat2Num: "2260",
        stat2Label: "OOSİT DONASYONU",
        stat2Sub: "%84 BAŞARI",
        stat3Num: "693",
        stat3Label: "IVF",
        stat3Sub: "%84 BAŞARI",
        stat4Num: "538",
        stat4Label: "SPERM DONASYONU",
        stat4Sub: "%67 BAŞARI",
        stat5Num: "610",
        stat5Label: "PGD",
        stat5Sub: "%84 BAŞARI",
        
        contactTitle: "Bize Ulaşın",
        contactInfoTitle: "Klinik Bilgileri",
        contactInfoDesc: "Hasta koordinatörlerimiz sorularınızı yanıtlamaya ve ilk görüşmenizi planlamaya hazırdır.",
        formName: "Ad Soyad",
        formEmail: "E-posta Adresi",
        formMessage: "Mesajınız",
        formSubmit: "Mesaj Gönder",
        
        footerRights: "Tüm hakları saklıdır.",
        footerPagesTitle: "SAYFALARIMIZ",
        footerContactTitle: "İLETİŞİM BİLGİLERİ"
    },
    en: {
        logoText: "Dr. Cahit Cenksoy",
        navHome: "HOME",
        navTeam: "OUR TEAM",
        navIVF: "IVF",
        ivfItem1: "Initial Evaluation",
        ivfItem2: "IVF Medicines",
        ivfItem3: "Stimulation of the ovaries",
        ivfItem4: "Maturation of Eggs",
        ivfItem5: "OPU (Egg Collection)",
        ivfItem6: "Sperm Extraction",
        ivfItem7: "Denudation",
        ivfItem8: "Transfer",
        navTreatments: "TREATMENT OPTIONS",
        navTestimonials: "PATIENTS",
        navFAQ: "FAQ",
        navBlogs: "BLOG",
        navContact: "CONTACT",
        
        heroTitle: "Creating Miracles Together",
        heroSubtitle: "State-of-the-art IVF treatments tailored for your unique journey to parenthood.",
        heroBtnPrimary: "Book Consultation",
        heroBtnSecondary: "Explore Treatments",
        
        stat1Num: "3640",
        stat1Label: "TOTAL IVF CYCLES",
        stat2Num: "2260",
        stat2Label: "OOCYTE DONATION",
        stat2Sub: "84% SUCCESS",
        stat3Num: "693",
        stat3Label: "IVF",
        stat3Sub: "84% SUCCESS",
        stat4Num: "538",
        stat4Label: "SPERM DONATION",
        stat4Sub: "67% SUCCESS",
        stat5Num: "610",
        stat5Label: "PGD",
        stat5Sub: "84% SUCCESS",

        footerRights: "All rights reserved.",
        footerPagesTitle: "PAGES",
        footerContactTitle: "CONTACT INFO"
    },
    // Adding other languages as placeholders to avoid errors, 
    // but focusing on TR/EN for now as requested for "magic" redo
    fr: { logoText: "Dr. Cahit Cenksoy", navHome: "ACCUEIL", navTeam: "EQUIPE", navIVF: "FIV", navTreatments: "TRAITEMENTS", navContact: "CONTACT", footerRights: "Tous droits réservés." },
    ar: { logoText: "د. جاهد جينكسوي", navHome: "الرئيسية", navTeam: "فريقنا", navIVF: "أطفال الأنابيب", navTreatments: "خيارات العلاج", navContact: "اتصل بنا", footerRights: "جميع الحقوق محفوظة." },
    de: { logoText: "Dr. Cahit Cenksoy", navHome: "STARTSEITE", navTeam: "TEAM", navIVF: "IVF", navTreatments: "BEHANDLUNGEN", navContact: "KONTAKT", footerRights: "Alle Rechte vorbehalten." },
    ru: { logoText: "Др. Джахит Дженксой", navHome: "ГЛАВНАЯ", navTeam: "КОМАНДА", navIVF: "ЭКО", navTreatments: "ЛЕЧЕНИЕ", navContact: "КОНТАКТЫ", footerRights: "Все права защищены." }
};

// --- Language Switching Logic ---
let currentLang = localStorage.getItem('lang') || 'tr';

function changeLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem('lang', lang);

    const langBtn = document.getElementById('currentLang');
    if (langBtn) {
        langBtn.innerHTML = `${lang.toUpperCase()} <i class="fa-solid fa-globe"></i>`;
    }

    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[lang][key];
            } else {
                el.textContent = translations[lang][key];
            }
        }
    });

    if (typeof renderFAQs === 'function') renderFAQs(lang);
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) navLinks.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
    changeLanguage(currentLang);
    
    // --- Scroll Reveal Logic ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section, .card, .stat-box, .team-card').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });
});

// --- Theme Toggle ---
const themeToggleBtn = document.getElementById('themeToggle');
const body = document.documentElement;

themeToggleBtn?.addEventListener('click', () => {
    const isDark = body.getAttribute('data-theme') === 'dark';
    if (isDark) {
        body.removeAttribute('data-theme');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
    }
});

if (localStorage.getItem('theme') === 'dark') {
    body.setAttribute('data-theme', 'dark');
    if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

// --- Mobile Nav ---
const mobileToggle = document.getElementById('mobileToggle');
const navLinksMenu = document.querySelector('.nav-links');
mobileToggle?.addEventListener('click', () => {
    navLinksMenu?.classList.toggle('active');
});

// --- FAQ Rendering ---
function renderFAQs(lang) {
    const faqContainer = document.getElementById('faqAccordion');
    if (!faqContainer || typeof faqData === 'undefined') return;

    faqContainer.innerHTML = '';
    const questions = faqData[lang] || faqData['tr'];

    questions.forEach((item) => {
        const accordionItem = document.createElement('div');
        accordionItem.className = 'accordion-item';
        accordionItem.innerHTML = `
            <button class="accordion-header">
                <span>${item.q}</span>
                <i class="fa-solid fa-chevron-down"></i>
            </button>
            <div class="accordion-content">
                <p>${item.a}</p>
            </div>
        `;
        const header = accordionItem.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const isActive = accordionItem.classList.contains('active');
            document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
            if (!isActive) accordionItem.classList.add('active');
        });
        faqContainer.appendChild(accordionItem);
    });
}
