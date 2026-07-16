/* =========================================================
   Anadolu Tekstil — Tanıtım Sitesi Scriptleri
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Çeviri (TR / EN) ---------- */
  const translations = {
    tr: {
      nav_home: 'Anasayfa', nav_about: 'Hakkımızda', nav_products: 'Ürünler', nav_gallery: 'Galeri', nav_contact: 'İletişim',
      hero_eyebrow: "1998'DEN BUGÜNE",
      hero_title: 'Kumaşta Kalite,<br>Üretimde Güven',
      hero_sub: 'Pamuklu, örme ve dokuma kumaş üretiminde deneyim, sürdürülebilirlik ve titiz kalite kontrolünü bir araya getiriyoruz.',
      hero_btn_contact: 'Bize Ulaşın', hero_btn_products: 'Ürünlerimiz',
      ph_factory: 'Fabrika Görseli', badge_years: 'Yıllık Tecrübe',
      about_eyebrow: 'HAKKIMIZDA',
      about_title: 'Tekstilde Nesiller Boyu Süren Ustalık',
      about_text: 'Anadolu Tekstil, 1998 yılından itibaren yerli ve yabancı markalara yüksek kaliteli kumaş üretimi sunmaktadır. Modern makine parkurumuz ve deneyimli ekibimizle; pamuklu, örme, dokuma ve karışım kumaşlarda müşterilerimizin ihtiyaçlarına özel çözümler geliştiriyoruz. Sürdürülebilir üretim anlayışımız ve sıkı kalite kontrol süreçlerimizle sektörde güvenilir bir tedarikçi olmayı sürdürüyoruz.',
      stat_years: 'Yıllık Tecrübe', stat_staff: 'Çalışan', stat_countries: 'İhracat Ülkesi', stat_clients: 'Kurumsal Müşteri',
      products_eyebrow: 'ÜRÜN & HİZMETLERİMİZ', products_title: 'Neler Üretiyoruz',
      products_sub: 'Geniş ürün yelpazemizle her sektörün ihtiyacına uygun kumaş çözümleri sunuyoruz.',
      p1_title: 'Pamuklu Kumaşlar', p1_text: 'Nefes alabilen, yumuşak dokulu, hazır giyim ve ev tekstili için ideal pamuklu kumaş çeşitleri.',
      p2_title: 'Örme Kumaşlar', p2_text: 'Esnek yapılı, konforlu ve dayanıklı örme kumaşlarımızla spor ve günlük giyim koleksiyonlarına destek.',
      p3_title: 'Dokuma Kumaşlar', p3_text: 'Yüksek mukavemetli, şık görünümlü dokuma kumaşlar ile klasik ve modern koleksiyonlar için çözümler.',
      p4_title: 'Ev Tekstili', p4_text: 'Nevresim, perde ve döşemelik kumaş üretiminde konfor ve estetiği bir araya getiriyoruz.',
      p5_title: 'Özel Tasarım & Baskı', p5_text: 'Markanıza özel renk, desen ve baskı çözümleriyle fark yaratan koleksiyonlar tasarlıyoruz.',
      p6_title: 'Sürdürülebilir Üretim', p6_text: 'Çevreye duyarlı hammadde tercihi ve enerji verimli üretim süreçleriyle geleceğe katkı sağlıyoruz.',
      gallery_eyebrow: 'GALERİ', gallery_title: 'Üretimden Kareler',
      gallery_sub: 'Tesisimizden ve ürünlerimizden görseller (örnek görsellerdir, gerçek fotoğraflarla değiştirilecektir).',
      contact_eyebrow: 'İLETİŞİM', contact_title: 'Bizimle İletişime Geçin',
      contact_sub: 'Sorularınız ve iş birliği teklifleriniz için aşağıdaki bilgilerden veya formdan bize ulaşabilirsiniz.',
      contact_address_label: 'Adres', contact_address_value: 'Organize Sanayi Bölgesi, 5. Cadde No:12, Bursa / Türkiye',
      contact_phone_label: 'Telefon', contact_email_label: 'E-posta',
      contact_hours_label: 'Çalışma Saatleri', contact_hours_value: 'Pazartesi - Cuma, 08:30 - 18:00',
      form_name: 'Ad Soyad', form_email: 'E-posta', form_subject: 'Konu', form_message: 'Mesajınız',
      form_submit: 'Mesaj Gönder', form_note: '* Bu form şu an demo amaçlıdır. Gönderim aktif hale getirilecektir.',
      footer_text: 'Kumaşta kalite ve güveni bir arada sunan köklü tekstil markası.', footer_rights: 'Tüm hakları saklıdır.'
    },
    en: {
      nav_home: 'Home', nav_about: 'About Us', nav_products: 'Products', nav_gallery: 'Gallery', nav_contact: 'Contact',
      hero_eyebrow: 'SINCE 1998',
      hero_title: 'Quality in Fabric,<br>Trust in Production',
      hero_sub: 'We combine decades of experience, sustainability and rigorous quality control in cotton, knitted and woven fabric manufacturing.',
      hero_btn_contact: 'Contact Us', hero_btn_products: 'Our Products',
      ph_factory: 'Factory Image', badge_years: 'Years of Experience',
      about_eyebrow: 'ABOUT US',
      about_title: 'Generations of Craftsmanship in Textiles',
      about_text: 'Since 1998, Anadolu Tekstil has been supplying high-quality fabrics to domestic and international brands. With our modern machinery and experienced team, we develop tailored solutions in cotton, knitted, woven and blended fabrics. We continue to be a trusted supplier in the industry through sustainable production and strict quality control processes.',
      stat_years: 'Years of Experience', stat_staff: 'Employees', stat_countries: 'Export Countries', stat_clients: 'Corporate Clients',
      products_eyebrow: 'PRODUCTS & SERVICES', products_title: 'What We Produce',
      products_sub: 'We offer fabric solutions suited to every industry need with our wide product range.',
      p1_title: 'Cotton Fabrics', p1_text: 'Breathable, soft-textured cotton fabrics ideal for apparel and home textiles.',
      p2_title: 'Knitted Fabrics', p2_text: 'Flexible, comfortable and durable knitted fabrics supporting sportswear and daily wear collections.',
      p3_title: 'Woven Fabrics', p3_text: 'High-strength, elegant woven fabrics offering solutions for classic and modern collections.',
      p4_title: 'Home Textiles', p4_text: 'Bringing comfort and aesthetics together in bedding, curtain and upholstery fabric production.',
      p5_title: 'Custom Design & Printing', p5_text: 'We design distinctive collections with custom colors, patterns and printing solutions for your brand.',
      p6_title: 'Sustainable Production', p6_text: 'We contribute to the future through eco-friendly raw material choices and energy-efficient production.',
      gallery_eyebrow: 'GALLERY', gallery_title: 'Snapshots from Production',
      gallery_sub: 'Images from our facility and products (sample placeholders, to be replaced with real photos).',
      contact_eyebrow: 'CONTACT', contact_title: 'Get in Touch With Us',
      contact_sub: 'You can reach us via the information below or the form for your questions and collaboration proposals.',
      contact_address_label: 'Address', contact_address_value: 'Organized Industrial Zone, 5th Street No:12, Bursa / Turkey',
      contact_phone_label: 'Phone', contact_email_label: 'Email',
      contact_hours_label: 'Working Hours', contact_hours_value: 'Monday - Friday, 08:30 - 18:00',
      form_name: 'Full Name', form_email: 'Email', form_subject: 'Subject', form_message: 'Your Message',
      form_submit: 'Send Message', form_note: '* This form is currently a demo. Submission will be activated later.',
      footer_text: 'A well-established textile brand offering quality and trust in fabric.', footer_rights: 'All rights reserved.'
    }
  };

  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    const langTr = langToggle.querySelector('.lang-tr');
    const langEn = langToggle.querySelector('.lang-en');

    function applyLanguage(lang) {
      document.documentElement.lang = lang;
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key] !== undefined) {
          el.innerHTML = translations[lang][key];
        }
      });
      if (langTr) langTr.classList.toggle('active', lang === 'tr');
      if (langEn) langEn.classList.toggle('active', lang === 'en');
      localStorage.setItem('site_lang', lang);
    }

    langToggle.addEventListener('click', () => {
      const current = document.documentElement.lang === 'en' ? 'en' : 'tr';
      applyLanguage(current === 'tr' ? 'en' : 'tr');
    });

    const savedLang = localStorage.getItem('site_lang');
    if (savedLang) applyLanguage(savedLang);
  }

  /* ---------- Header scroll durumu ---------- */
  const header = document.getElementById('header');
  if (header) {
    function updateHeader() {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', updateHeader);
    updateHeader();
  }

  /* ---------- Mobil menü ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });
    mainNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mainNav.classList.remove('open'));
    });
  }

  /* ---------- Aktif nav linki (scroll takibi) ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  function updateActiveNav() {
    if (!sections.length) return;
    let current = sections[0].id;
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  /* ---------- Fade-in görünürlük animasyonu ---------- */
  const faders = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  faders.forEach(el => observer.observe(el));

  /* ---------- Sayaç animasyonu (istatistikler) ---------- */
  let countersStarted = false;
  function animateCounters() {
    if (countersStarted) return;
    const statsSection = document.querySelector('.stats');
    if (!statsSection) return;
    const rect = statsSection.getBoundingClientRect();
    if (rect.top > window.innerHeight * 0.85) return;
    const counters = document.querySelectorAll('.stat-item strong');
    if (!counters.length) return;
    countersStarted = true;
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'), 10);
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        counter.textContent = Math.floor(progress * target);
        if (progress < 1) requestAnimationFrame(tick);
        else counter.textContent = target;
      }
      requestAnimationFrame(tick);
    });
  }
  window.resetAndAnimateCounters = function () {
    countersStarted = false;
    animateCounters();
  };
  window.addEventListener('scroll', animateCounters);
  animateCounters();

  /* ---------- Yukarı çık butonu ---------- */
  const toTop = document.getElementById('toTop');
  if (toTop) {
    window.addEventListener('scroll', () => {
      toTop.classList.toggle('visible', window.scrollY > 500);
    });
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- İletişim formu (demo) ---------- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Teşekkürler! Bu bir demo formdur; mesajlar henüz gönderilmiyor.');
      form.reset();
    });
  }

  /* ---------- Footer yılı ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
