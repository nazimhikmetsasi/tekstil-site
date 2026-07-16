/* Public site: içerikleri /api/content üzerinden doldurur */

async function loadSite() {
  try {
    const res = await fetch('/api/content', { cache: 'no-store' });
    if (!res.ok) throw new Error('İçerik yüklenemedi');
    const c = await res.json();
    applyContent(c);
  } catch (e) {
    console.warn(e);
    // API yoksa bile konum kartını boş bırakma
    applyLocationFallback();
  }
}

function applyLocationFallback() {
  const card = document.getElementById('locationCard');
  const queryEl = document.querySelector('[data-contact-map-query]');
  const fallback =
    (card && card.getAttribute('data-fallback-query')) ||
    (queryEl && queryEl.getAttribute('data-fallback')) ||
    'Bursa';
  applyLocationOnly({
    mapQuery: fallback,
    address: fallback,
    mapLabel: 'Haritada Göster / Yol Tarifi'
  });
}

function applyContent(c) {
  const brand = c.site?.brand || 'Anadolu Tekstil';
  const mark = c.site?.logoMark || 'AT';

  document.title = brand + ' | Kaliteli Kumaş ve Tekstil Ürünleri';

  document.querySelectorAll('[data-brand]').forEach((el) => { el.textContent = brand; });
  document.querySelectorAll('[data-logo-mark]').forEach((el) => { el.textContent = mark; });

  document.querySelectorAll('[data-logo-text]').forEach((el) => {
    const parts = brand.split(' ');
    if (parts.length > 1) {
      el.innerHTML = parts[0] + ' <em>' + parts.slice(1).join(' ') + '</em>';
    } else {
      el.innerHTML = brand;
    }
  });

  setText('[data-hero-eyebrow]', c.hero?.eyebrow);
  setHtml('[data-hero-title]', c.hero?.title);
  setText('[data-hero-subtitle]', c.hero?.subtitle);
  setText('[data-hero-btn-contact]', c.hero?.btnContact);
  setText('[data-hero-btn-products]', c.hero?.btnProducts);
  setText('[data-hero-badge-years]', c.hero?.badgeYears);
  setText('[data-hero-badge-label]', c.hero?.badgeLabel);

  const heroCard = document.querySelector('[data-hero-image]');
  if (heroCard && c.hero?.image) {
    heroCard.innerHTML = `<img src="${c.hero.image}" alt="${brand}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`;
  }

  setText('[data-about-eyebrow]', c.about?.eyebrow);
  setText('[data-about-title]', c.about?.title);
  setText('[data-about-text]', c.about?.text);

  const aboutImg = document.querySelector('[data-about-image]');
  if (aboutImg && c.about?.image) {
    aboutImg.innerHTML = `<img src="${c.about.image}" alt="Hakkımızda" style="width:100%;height:100%;object-fit:cover;">`;
  }

  const statsBox = document.querySelector('[data-stats]');
  if (statsBox && Array.isArray(c.about?.stats)) {
    statsBox.innerHTML = c.about.stats.map((s) => `
      <div class="stat-item">
        <strong data-count="${s.value}">0</strong>
        <span>${escapeHtml(s.label)}</span>
      </div>`).join('');
    if (typeof window.resetAndAnimateCounters === 'function') {
      window.resetAndAnimateCounters();
    }
  }

  setText('[data-products-eyebrow]', c.products?.eyebrow);
  setText('[data-products-title]', c.products?.title);
  setText('[data-products-subtitle]', c.products?.subtitle);

  const productsBox = document.querySelector('[data-products]');
  if (productsBox && Array.isArray(c.products?.items)) {
    productsBox.innerHTML = c.products.items.map((p, i) => {
      const num = String(i + 1).padStart(2, '0');
      const img = p.image
        ? `<img class="product-thumb" src="${p.image}" alt="${escapeAttr(p.title)}">`
        : '';
      return `
      <article class="product-card ${p.featured ? 'featured' : ''} fade-in visible">
        ${img}
        <span class="product-num">${num}</span>
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.text)}</p>
      </article>`;
    }).join('');
  }

  setText('[data-gallery-eyebrow]', c.gallery?.eyebrow);
  setText('[data-gallery-title]', c.gallery?.title);
  setText('[data-gallery-subtitle]', c.gallery?.subtitle);

  const galleryBox = document.querySelector('[data-gallery]');
  if (galleryBox) {
    const items = c.gallery?.items || [];
    if (items.length === 0) {
      galleryBox.innerHTML = `
        <div class="gallery-item-m h-md fade-in visible" data-caption="Örnek"><span>01</span></div>
        <div class="gallery-item-m h-lg fade-in visible" data-caption="Örnek"><span>02</span></div>
        <div class="gallery-item-m h-sm fade-in visible" data-caption="Örnek"><span>03</span></div>
        <div class="gallery-item-m h-md fade-in visible" data-caption="Örnek"><span>04</span></div>`;
    } else {
      const sizes = ['h-md', 'h-lg', 'h-sm', 'h-lg', 'h-sm', 'h-md'];
      galleryBox.innerHTML = items.map((g, i) => `
        <div class="gallery-item-m ${g.size || sizes[i % sizes.length]} fade-in visible" data-caption="${escapeAttr(g.caption || '')}"
          style="background:url('${g.image}') center/cover no-repeat;">
        </div>`).join('');
    }
  }

  setText('[data-contact-eyebrow]', c.contact?.eyebrow);
  setText('[data-contact-title]', c.contact?.title);
  setText('[data-contact-subtitle]', c.contact?.subtitle);
  setText('[data-contact-address]', c.contact?.address);
  setText('[data-contact-phone]', c.contact?.phone);
  setText('[data-contact-email]', c.contact?.email);
  setText('[data-contact-hours]', c.contact?.hours);
  setText('[data-footer-text]', c.footer?.text);

  applyLocationOnly(c.contact || {});

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
}

function applyLocationOnly(contact) {
  const display =
    (contact.mapQuery || contact.address || '').toString().trim() || 'Konum';
  setText('[data-contact-map-label]', contact.mapLabel || 'Haritada Göster / Yol Tarifi');
  setText('[data-contact-map-query]', display);

  const mapsUrl = buildMapsUrl(contact);
  const locationCard = document.getElementById('locationCard');
  if (locationCard) {
    locationCard.href = mapsUrl;
    locationCard.setAttribute('data-maps-url', mapsUrl);
  }

  const mapEmbed = document.getElementById('mapEmbed');
  if (mapEmbed) {
    const q = mapsQueryText(contact);
    if (q) {
      // Mobilde iframe bazen boş kalır; yine de doldur. Asıl tıklama ile Maps açılır.
      mapEmbed.src =
        'https://maps.google.com/maps?q=' + encodeURIComponent(q) + '&z=16&output=embed';
    }
  }
}

/** "40°13'59.7\"N 28°59'11.2\"E" veya "40.23325, 28.98644" -> {lat,lng} */
function parseLatLng(text) {
  if (!text) return null;
  const s = String(text).trim();

  // Ondalık: 40.233, 28.986
  let m = s.match(/^(-?\d+(?:\.\d+)?)\s*[,;\s]\s*(-?\d+(?:\.\d+)?)$/);
  if (m) return { lat: m[1], lng: m[2] };

  // Derece formatı: 40°13'59.7"N 28°59'11.2"E
  const dms =
    /(-?\d+)[°\s]+(\d+)['′\s]+(\d+(?:\.\d+)?)["″]?\s*([NSns])?\s*[,\s]*(-?\d+)[°\s]+(\d+)['′\s]+(\d+(?:\.\d+)?)["″]?\s*([EWew])?/;
  m = s.match(dms);
  if (m) {
    let lat = Number(m[1]) + Number(m[2]) / 60 + Number(m[3]) / 3600;
    let lng = Number(m[5]) + Number(m[6]) / 60 + Number(m[7]) / 3600;
    if ((m[4] || '').toUpperCase() === 'S') lat = -Math.abs(lat);
    if ((m[8] || '').toUpperCase() === 'W') lng = -Math.abs(lng);
    return { lat: String(lat), lng: String(lng) };
  }
  return null;
}

function mapsQueryText(contact) {
  if (!contact) return '';
  const lat = (contact.lat || '').toString().trim();
  const lng = (contact.lng || '').toString().trim();
  if (lat && lng) return lat + ',' + lng;

  const raw = (contact.mapQuery || contact.address || '').toString().trim();
  const parsed = parseLatLng(raw);
  if (parsed) return parsed.lat + ',' + parsed.lng;
  return raw;
}

function buildMapsUrl(contact) {
  const q = mapsQueryText(contact);
  if (!q) return 'https://www.google.com/maps';
  // Telefonda Google Haritalar uygulamasında pin açmak için
  return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);
}

function setText(sel, val) {
  if (val == null) return;
  document.querySelectorAll(sel).forEach((el) => { el.textContent = val; });
}
function setHtml(sel, val) {
  if (val == null) return;
  document.querySelectorAll(sel).forEach((el) => { el.innerHTML = val; });
}
function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escapeAttr(s) {
  return String(s).replace(/"/g, '&quot;');
}

document.addEventListener('DOMContentLoaded', () => {
  loadSite();

  // Mobilde tıklanınca kesin Maps'e gitsin (href güncellenmese bile)
  const locationCard = document.getElementById('locationCard');
  if (locationCard) {
    locationCard.addEventListener('click', (e) => {
      const url =
        locationCard.getAttribute('data-maps-url') ||
        locationCard.href ||
        '';
      if (!url || url === '#' || url.endsWith('/maps') || url.includes('about:blank')) {
        e.preventDefault();
        const q =
          document.querySelector('[data-contact-map-query]')?.textContent?.trim() ||
          locationCard.getAttribute('data-fallback-query') ||
          'Bursa';
        if (q === 'Konum yükleniyor...') {
          window.open(
            'https://www.google.com/maps/search/?api=1&query=' +
              encodeURIComponent(locationCard.getAttribute('data-fallback-query') || 'Bursa'),
            '_blank'
          );
          return;
        }
        window.open(
          'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q),
          '_blank'
        );
        return;
      }
      // Normal link çalışsın; sorunluysa zorla aç
      if (/share\.google|about:blank/i.test(url)) {
        e.preventDefault();
        const q =
          document.querySelector('[data-contact-map-query]')?.textContent?.trim() ||
          locationCard.getAttribute('data-fallback-query') ||
          'Bursa';
        window.open(
          'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q),
          '_blank'
        );
      }
    });
  }
});
