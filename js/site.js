/* Public site: içerikleri /api/content üzerinden doldurur */

async function loadSite() {
  try {
    const res = await fetch('/api/content');
    if (!res.ok) throw new Error('İçerik yüklenemedi');
    const c = await res.json();
    applyContent(c);
  } catch (e) {
    console.warn(e);
  }
}

function applyContent(c) {
  const brand = c.site?.brand || 'Anadolu Tekstil';
  const mark = c.site?.logoMark || 'AT';

  document.title = brand + ' | Kaliteli Kumaş ve Tekstil Ürünleri';

  document.querySelectorAll('[data-brand]').forEach((el) => { el.textContent = brand; });
  document.querySelectorAll('[data-logo-mark]').forEach((el) => { el.textContent = mark; });

  // Logo text: "Anadolu Tekstil" -> first word + em rest
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
  if (heroCard) {
    if (c.hero?.image) {
      heroCard.innerHTML = `<img src="${c.hero.image}" alt="${brand}" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;">`;
    }
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
    // re-trigger counters if script supports it
    if (typeof window.resetAndAnimateCounters === 'function') {
      window.resetAndAnimateCounters();
    }
  }

  setText('[data-products-eyebrow]', c.products?.eyebrow);
  setText('[data-products-title]', c.products?.title);
  setText('[data-products-subtitle]', c.products?.subtitle);

  const productsBox = document.querySelector('[data-products]');
  if (productsBox && Array.isArray(c.products?.items)) {
    productsBox.innerHTML = c.products.items.map((p) => `
      <article class="product-card ${p.featured ? 'featured' : ''} fade-in visible">
        ${p.image ? `<img src="${p.image}" alt="${escapeAttr(p.title)}" style="width:100%;height:140px;object-fit:cover;border-radius:8px;margin-bottom:14px;">` : `<div class="product-icon">${p.icon || '🧵'}</div>`}
        <h3>${escapeHtml(p.title)}</h3>
        <p>${escapeHtml(p.text)}</p>
      </article>`).join('');
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
  setText('[data-contact-map-label]', c.contact?.mapLabel || 'Haritada Göster / Yol Tarifi');
  setText('[data-footer-text]', c.footer?.text);

  // Konum: lat/lng varsa pin ile aç (share.google kısa linkleri telefonda pinsiz açılır)
  const mapsUrl = buildMapsUrl(c.contact);
  const locationCard = document.getElementById('locationCard');
  if (locationCard && mapsUrl) {
    locationCard.href = mapsUrl;
    locationCard.setAttribute('data-maps-url', mapsUrl);
  }
  const mapEmbed = document.getElementById('mapEmbed');
  if (mapEmbed) {
    if (c.contact?.lat && c.contact?.lng) {
      mapEmbed.src =
        'https://www.google.com/maps?q=' +
        encodeURIComponent(c.contact.lat + ',' + c.contact.lng) +
        '&z=16&output=embed';
    } else if (c.contact?.mapEmbed) {
      mapEmbed.src = c.contact.mapEmbed;
    } else if (c.contact?.address) {
      mapEmbed.src =
        'https://www.google.com/maps?q=' +
        encodeURIComponent(c.contact.address) +
        '&output=embed';
    }
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
}

function buildMapsUrl(contact) {
  if (!contact) return 'https://www.google.com/maps';
  const lat = (contact.lat || '').toString().trim();
  const lng = (contact.lng || '').toString().trim();
  if (lat && lng) {
    // Telefonda Google Haritalar uygulamasında pin açan format
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(lat + ',' + lng);
  }
  const url = (contact.mapUrl || '').trim();
  // share.google / kısa linkler telefonda genelde konum pinsiz açılır
  if (url && !/share\.google|maps\.app\.goo\.gl/i.test(url)) {
    return url;
  }
  if (contact.address) {
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(contact.address);
  }
  return url || 'https://www.google.com/maps';
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
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function escapeAttr(s) {
  return String(s).replace(/"/g, '&quot;');
}

document.addEventListener('DOMContentLoaded', loadSite);
