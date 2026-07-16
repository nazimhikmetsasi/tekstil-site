require('dotenv').config();

const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DATA_FILE = path.join(ROOT, 'data', 'content.json');
const UPLOADS_DIR = path.join(ROOT, 'uploads');

// Admin bilgileri .env dosyasından okunur (GitHub'a gönderilmez)
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS_HASH =
  process.env.ADMIN_PASS_HASH ||
  bcrypt.hashSync(process.env.ADMIN_PASS || 'admin123', 10);

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
['gallery', 'hero', 'about', 'products'].forEach((folder) => {
  const p = path.join(UPLOADS_DIR, folder);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'tekstil-admin-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 8 } // 8 saat
  })
);

app.use('/uploads', express.static(UPLOADS_DIR));
app.use('/css', express.static(path.join(ROOT, 'css')));
app.use('/js', express.static(path.join(ROOT, 'js')));
app.use('/admin', express.static(path.join(ROOT, 'admin')));

function readContent() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeContent(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function requireAuth(req, res, next) {
  if (req.session && req.session.authenticated) return next();
  return res.status(401).json({ error: 'Oturum gerekli' });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const folder = req.query.folder || 'gallery';
    const allowed = ['gallery', 'hero', 'about', 'products'];
    const dir = path.join(UPLOADS_DIR, allowed.includes(folder) ? folder : 'gallery');
    cb(null, dir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const safe = Date.now() + '-' + Math.round(Math.random() * 1e6) + ext;
    cb(null, safe);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    const ok = /\.(jpe?g|png|webp|gif)$/i.test(file.originalname);
    cb(ok ? null : new Error('Sadece görsel dosyaları yüklenebilir (jpg, png, webp, gif)'), ok);
  }
});

/* ---------- Auth ---------- */
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username === ADMIN_USER && bcrypt.compareSync(password || '', ADMIN_PASS_HASH)) {
    req.session.authenticated = true;
    return res.json({ ok: true });
  }
  return res.status(401).json({ error: 'Kullanıcı adı veya şifre hatalı' });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get('/api/me', (req, res) => {
  res.json({ authenticated: !!(req.session && req.session.authenticated) });
});

/* ---------- Content ---------- */
app.get('/api/content', (req, res) => {
  try {
    res.json(readContent());
  } catch (e) {
    res.status(500).json({ error: 'İçerik okunamadı' });
  }
});

app.put('/api/content', requireAuth, (req, res) => {
  try {
    writeContent(req.body);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'İçerik kaydedilemedi' });
  }
});

/* ---------- Upload ---------- */
app.post('/api/upload', requireAuth, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'Dosya seçilmedi' });
    const folder = req.query.folder || 'gallery';
    const url = `/uploads/${folder}/${req.file.filename}`;
    res.json({ ok: true, url, filename: req.file.filename });
  });
});

app.delete('/api/upload', requireAuth, (req, res) => {
  try {
    const fileUrl = req.body && req.body.url;
    if (!fileUrl || !fileUrl.startsWith('/uploads/')) {
      return res.status(400).json({ error: 'Geçersiz dosya' });
    }
    const parts = fileUrl.replace(/^\//, '').split('/');
    const filePath = path.join(ROOT, ...parts);
    if (!filePath.startsWith(UPLOADS_DIR)) {
      return res.status(400).json({ error: 'Geçersiz dosya yolu' });
    }
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Dosya silinemedi' });
  }
});

/* ---------- Pages ---------- */
app.get('/', (req, res) => {
  res.sendFile(path.join(ROOT, 'index-template1.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(ROOT, 'admin', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Site:  http://localhost:${PORT}`);
  console.log(`Admin: http://localhost:${PORT}/admin`);
  console.log(`Giriş:  kullanıcı=${ADMIN_USER}  şifre=${process.env.ADMIN_PASS || 'admin123'}`);
});
