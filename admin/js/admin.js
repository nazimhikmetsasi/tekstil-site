let content = null;

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function toast(msg, type = 'ok') {
  const el = $('#toast');
  el.textContent = msg;
  el.className = 'toast show ' + type;
  setTimeout(() => el.classList.remove('show'), 2500);
}

async function api(url, options = {}) {
  const res = await fetch(url, {
    credentials: 'same-origin',
    headers: options.body instanceof FormData ? undefined : { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'İstek başarısız');
  return data;
}

async function checkAuth() {
  const me = await api('/api/me');
  if (me.authenticated) {
    showAdmin();
    await loadContent();
  } else {
    showLogin();
  }
}

function showLogin() {
  $('#loginView').classList.remove('hidden');
  $('#adminView').classList.add('hidden');
}

function showAdmin() {
  $('#loginView').classList.add('hidden');
  $('#adminView').classList.remove('hidden');
}

$('#loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const err = $('#loginError');
  err.classList.remove('show');
  try {
    await api('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        username: $('#username').value.trim(),
        password: $('#password').value
      })
    });
    showAdmin();
    await loadContent();
  } catch (ex) {
    err.textContent = ex.message;
    err.classList.add('show');
  }
});

$('#logoutBtn').addEventListener('click', async () => {
  await api('/api/logout', { method: 'POST' });
  showLogin();
});

/* ---------- Navigation ---------- */
$$('.nav-item').forEach((btn) => {
  btn.addEventListener('click', () => {
    $$('.nav-item').forEach((b) => b.classList.remove('active'));
    $$('.panel').forEach((p) => p.classList.remove('active'));
    btn.classList.add('active');
    const id = btn.dataset.panel;
    $('#panel-' + id).classList.add('active');
    $('#panelTitle').textContent = btn.textContent;
  });
});

/* ---------- Load / Fill ---------- */
async function loadContent() {
  content = await api('/api/content');
  fillForms();
}

function fillForms() {
  const c = content;
  $('#hero_eyebrow').value = c.hero.eyebrow || '';
  $('#hero_title').value = c.hero.title || '';
  $('#hero_subtitle').value = c.hero.subtitle || '';
  $('#hero_btnContact').value = c.hero.btnContact || '';
  $('#hero_btnProducts').value = c.hero.btnProducts || '';
  $('#hero_badgeYears').value = c.hero.badgeYears || '';
  $('#hero_badgeLabel').value = c.hero.badgeLabel || '';
  setPreview('#heroPreview', c.hero.image);

  $('#about_eyebrow').value = c.about.eyebrow || '';
  $('#about_title').value = c.about.title || '';
  $('#about_text').value = c.about.text || '';
  setPreview('#aboutPreview', c.about.image);
  renderStats();

  $('#products_eyebrow').value = c.products.eyebrow || '';
  $('#products_title').value = c.products.title || '';
  $('#products_subtitle').value = c.products.subtitle || '';
  renderProducts();

  $('#gallery_eyebrow').value = c.gallery.eyebrow || '';
  $('#gallery_title').value = c.gallery.title || '';
  $('#gallery_subtitle').value = c.gallery.subtitle || '';
  renderGallery();

  $('#contact_eyebrow').value = c.contact.eyebrow || '';
  $('#contact_title').value = c.contact.title || '';
  $('#contact_subtitle').value = c.contact.subtitle || '';
  $('#contact_address').value = c.contact.address || '';
  $('#contact_phone').value = c.contact.phone || '';
  $('#contact_email').value = c.contact.email || '';
  $('#contact_hours').value = c.contact.hours || '';
  $('#contact_instagram').value = c.contact.instagram || '';
  $('#contact_linkedin').value = c.contact.linkedin || '';
  $('#contact_facebook').value = c.contact.facebook || '';
  $('#contact_mapQuery').value = c.contact.mapQuery || c.contact.address || '';
  $('#contact_lat').value = c.contact.lat || '';
  $('#contact_lng').value = c.contact.lng || '';
  $('#contact_mapLabel').value = c.contact.mapLabel || '';
  $('#footer_text').value = c.footer.text || '';
  $('#site_brand').value = c.site.brand || '';
  $('#site_logoMark').value = c.site.logoMark || '';
}

function setPreview(sel, url) {
  const img = $(sel);
  if (url) {
    img.src = url;
    img.classList.remove('hidden');
  } else {
    img.removeAttribute('src');
    img.classList.add('hidden');
  }
}

function renderStats() {
  const box = $('#statsFields');
  box.innerHTML = '';
  (content.about.stats || []).forEach((s, i) => {
    box.innerHTML += `
      <div class="form-group">
        <label>İstatistik ${i + 1} — sayı</label>
        <input data-stat-value="${i}" type="number" value="${s.value}">
      </div>
      <div class="form-group">
        <label>İstatistik ${i + 1} — yazı</label>
        <input data-stat-label="${i}" value="${escapeAttr(s.label)}">
      </div>`;
  });
}

function renderProducts() {
  const box = $('#productsList');
  box.innerHTML = '';
  (content.products.items || []).forEach((p, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'product-admin';
    wrap.innerHTML = `
      <div class="head">
        <strong>Ürün ${i + 1}</strong>
        <button type="button" class="btn btn-danger btn-sm" data-del-product="${i}">Sil</button>
      </div>
      <div class="grid-2">
        <div class="form-group"><label>Öne çıkan kart</label>
          <select data-p-featured="${i}">
            <option value="false" ${!p.featured ? 'selected' : ''}>Hayır</option>
            <option value="true" ${p.featured ? 'selected' : ''}>Evet</option>
          </select>
        </div>
        <div class="form-group full"><label>Başlık</label><input data-p-title="${i}" value="${escapeAttr(p.title || '')}"></div>
        <div class="form-group full"><label>Açıklama</label><textarea data-p-text="${i}" rows="2">${escapeHtml(p.text || '')}</textarea></div>
      </div>
      <div class="upload-actions" style="margin-top:10px;">
        <label class="upload-box" for="pUpload${i}">
          <strong>Ürün görseli yükle</strong>
          <span>${p.image ? 'Mevcut görsel değiştirilecek' : 'Opsiyonel — JPG, PNG veya WEBP'}</span>
        </label>
        <input type="file" id="pUpload${i}" accept="image/*" class="hidden" data-p-upload="${i}">
        ${p.image ? `<img src="${p.image}" class="preview-img" alt="">` : ''}
      </div>`;
    box.appendChild(wrap);
  });

  $$('[data-del-product]').forEach((btn) => {
    btn.addEventListener('click', () => {
      content.products.items.splice(+btn.dataset.delProduct, 1);
      renderProducts();
    });
  });

  $$('[data-p-upload]').forEach((input) => {
    input.addEventListener('change', async () => {
      if (!input.files[0]) return;
      try {
        const url = await uploadFile(input.files[0], 'products');
        content.products.items[+input.dataset.pUpload].image = url;
        renderProducts();
        toast('Ürün görseli yüklendi');
      } catch (e) {
        toast(e.message, 'err');
      }
    });
  });
}

function renderGallery() {
  const grid = $('#galleryGrid');
  grid.innerHTML = '';
  (content.gallery.items || []).forEach((item, i) => {
    const el = document.createElement('div');
    el.className = 'media-item';
    el.innerHTML = `
      ${item.image ? `<img src="${item.image}" alt="">` : '<div class="ph">Görsel yok</div>'}
      <div class="meta">
        <input data-g-caption="${i}" value="${escapeAttr(item.caption || '')}" placeholder="Açıklama">
        <div class="row">
          <button type="button" class="btn btn-danger btn-sm" data-del-gallery="${i}">Sil</button>
        </div>
      </div>`;
    grid.appendChild(el);
  });

  $$('[data-del-gallery]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const idx = +btn.dataset.delGallery;
      const item = content.gallery.items[idx];
      if (item && item.image) {
        try { await api('/api/upload', { method: 'DELETE', body: JSON.stringify({ url: item.image }) }); } catch (_) {}
      }
      content.gallery.items.splice(idx, 1);
      renderGallery();
    });
  });
}

function escapeAttr(s) {
  return String(s).replace(/"/g, '&quot;');
}
function escapeHtml(s) {
  return String(s).replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function parseDmsToLatLng(text) {
  if (!text) return null;
  const s = String(text).trim();
  let m = s.match(/^(-?\d+(?:\.\d+)?)\s*[,;\s]\s*(-?\d+(?:\.\d+)?)$/);
  if (m) return { lat: m[1], lng: m[2] };
  const dms =
    /(-?\d+)[°\s]+(\d+)['′\s]+(\d+(?:\.\d+)?)["″]?\s*([NSns])?\s*[,\s]*(-?\d+)[°\s]+(\d+)['′\s]+(\d+(?:\.\d+)?)["″]?\s*([EWew])?/;
  m = s.match(dms);
  if (!m) return null;
  let lat = Number(m[1]) + Number(m[2]) / 60 + Number(m[3]) / 3600;
  let lng = Number(m[5]) + Number(m[6]) / 60 + Number(m[7]) / 3600;
  if ((m[4] || '').toUpperCase() === 'S') lat = -Math.abs(lat);
  if ((m[8] || '').toUpperCase() === 'W') lng = -Math.abs(lng);
  return { lat: String(+lat.toFixed(6)), lng: String(+lng.toFixed(6)) };
}

/* ---------- Collect from forms ---------- */
function collectFromForms() {
  content.hero.eyebrow = $('#hero_eyebrow').value;
  content.hero.title = $('#hero_title').value;
  content.hero.subtitle = $('#hero_subtitle').value;
  content.hero.btnContact = $('#hero_btnContact').value;
  content.hero.btnProducts = $('#hero_btnProducts').value;
  content.hero.badgeYears = $('#hero_badgeYears').value;
  content.hero.badgeLabel = $('#hero_badgeLabel').value;

  content.about.eyebrow = $('#about_eyebrow').value;
  content.about.title = $('#about_title').value;
  content.about.text = $('#about_text').value;
  content.about.stats = (content.about.stats || []).map((_, i) => ({
    value: Number($(`[data-stat-value="${i}"]`).value) || 0,
    label: $(`[data-stat-label="${i}"]`).value
  }));

  content.products.eyebrow = $('#products_eyebrow').value;
  content.products.title = $('#products_title').value;
  content.products.subtitle = $('#products_subtitle').value;
  content.products.items = (content.products.items || []).map((p, i) => ({
    ...p,
    icon: '',
    title: $(`[data-p-title="${i}"]`)?.value || p.title,
    text: $(`[data-p-text="${i}"]`)?.value || p.text,
    featured: $(`[data-p-featured="${i}"]`)?.value === 'true'
  }));

  content.gallery.eyebrow = $('#gallery_eyebrow').value;
  content.gallery.title = $('#gallery_title').value;
  content.gallery.subtitle = $('#gallery_subtitle').value;
  content.gallery.items = (content.gallery.items || []).map((g, i) => ({
    ...g,
    caption: $(`[data-g-caption="${i}"]`)?.value || g.caption
  }));

  content.contact.eyebrow = $('#contact_eyebrow').value;
  content.contact.title = $('#contact_title').value;
  content.contact.subtitle = $('#contact_subtitle').value;
  content.contact.address = $('#contact_address').value;
  content.contact.phone = $('#contact_phone').value;
  content.contact.email = $('#contact_email').value;
  content.contact.hours = $('#contact_hours').value;
  content.contact.instagram = $('#contact_instagram').value;
  content.contact.linkedin = $('#contact_linkedin').value;
  content.contact.facebook = $('#contact_facebook').value;
  content.contact.mapQuery = ($('#contact_mapQuery').value || '').trim();
  // Konum boşsa adres alanını kullan (istediği yeri yazabilsin)
  if (!content.contact.mapQuery && content.contact.address) {
    content.contact.mapQuery = content.contact.address.trim();
  }
  content.contact.lat = ($('#contact_lat').value || '').trim();
  content.contact.lng = ($('#contact_lng').value || '').trim();
  content.contact.mapLabel = $('#contact_mapLabel').value;

  // Derece formatı (40°13'59.7"N ...) yazıldıysa otomatik ondalığa çevir
  const parsed = parseDmsToLatLng(content.contact.mapQuery);
  if (parsed && !content.contact.lat && !content.contact.lng) {
    content.contact.lat = parsed.lat;
    content.contact.lng = parsed.lng;
  }

  const queryText =
    (content.contact.lat && content.contact.lng)
      ? content.contact.lat + ',' + content.contact.lng
      : (content.contact.mapQuery || content.contact.address || '');

  if (queryText) {
    const q = encodeURIComponent(queryText);
    content.contact.mapUrl = 'https://www.google.com/maps/search/?api=1&query=' + q;
    content.contact.mapEmbed = 'https://maps.google.com/maps?q=' + q + '&z=16&output=embed';
  } else {
    content.contact.mapUrl = '';
    content.contact.mapEmbed = '';
  }
  content.footer.text = $('#footer_text').value;
  content.site.brand = $('#site_brand').value;
  content.site.logoMark = $('#site_logoMark').value;
}

$('#saveBtn').addEventListener('click', async () => {
  try {
    collectFromForms();
    await api('/api/content', { method: 'PUT', body: JSON.stringify(content) });
    toast('Kaydedildi — sitede görünecek');
  } catch (e) {
    toast(e.message, 'err');
  }
});

$('#addProduct').addEventListener('click', () => {
  collectFromForms();
  content.products.items.push({
    id: 'p' + Date.now(),
    icon: '',
    title: 'Yeni Ürün',
    text: 'Açıklama yazın...',
    featured: false,
    image: ''
  });
  renderProducts();
});

/* ---------- Uploads ---------- */
async function uploadFile(file, folder) {
  if (!file) throw new Error('Dosya seçilmedi');
  // Bazı telefonlar image/* dışında seçim engelleyebilir; yine de dene
  const fd = new FormData();
  fd.append('file', file, file.name || ('foto-' + Date.now() + '.jpg'));
  const res = await fetch('/api/upload?folder=' + encodeURIComponent(folder), {
    method: 'POST',
    credentials: 'same-origin',
    body: fd
  });
  let data = {};
  try { data = await res.json(); } catch (_) {}
  if (!res.ok) throw new Error(data.error || ('Yükleme başarısız (' + res.status + ')'));
  return data.url;
}

$('#heroUpload').addEventListener('change', async () => {
  const file = $('#heroUpload').files[0];
  if (!file) return;
  try {
    content.hero.image = await uploadFile(file, 'hero');
    setPreview('#heroPreview', content.hero.image);
    toast('Hero görseli yüklendi — Kaydet’e basın');
  } catch (e) { toast(e.message, 'err'); }
});

$('#heroClear').addEventListener('click', () => {
  content.hero.image = '';
  setPreview('#heroPreview', '');
});

$('#aboutUpload').addEventListener('change', async () => {
  const file = $('#aboutUpload').files[0];
  if (!file) return;
  try {
    content.about.image = await uploadFile(file, 'about');
    setPreview('#aboutPreview', content.about.image);
    toast('Hakkımızda görseli yüklendi — Kaydet’e basın');
  } catch (e) { toast(e.message, 'err'); }
});

$('#aboutClear').addEventListener('click', () => {
  content.about.image = '';
  setPreview('#aboutPreview', '');
});

$('#galleryUpload').addEventListener('change', async () => {
  const files = Array.from($('#galleryUpload').files || []);
  for (const file of files) {
    try {
      const url = await uploadFile(file, 'gallery');
      content.gallery.items.push({
        id: 'g' + Date.now() + Math.random(),
        image: url,
        caption: file.name.replace(/\.[^.]+$/, ''),
        size: 'h-md'
      });
    } catch (e) {
      toast(e.message, 'err');
    }
  }
  renderGallery();
  $('#galleryUpload').value = '';
  toast('Fotoğraflar eklendi — Kaydet’e basın');
});

checkAuth();
