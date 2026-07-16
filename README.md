# Anadolu Tekstil — Tanıtım Sitesi

Bu proje, bir tekstil firması için hazırlanmış, sipariş/e-ticaret özelliği **olmayan**, sadece kurumsal tanıtım amaçlı statik bir web sitesidir.

## İçerik

- `index.html` — Sitenin tüm bölümleri (Anasayfa, Hakkımızda, Ürünler, Galeri, İletişim, Footer)
- `css/style.css` — Tasarım ve responsive (mobil uyumlu) stiller
- `js/script.js` — Dil değiştirme (TR/EN), mobil menü, kaydırma animasyonları, sayaçlar, form davranışı

Şu anda tüm firma bilgileri (isim, adres, telefon, ürün açıklamaları, görseller) **örnek/placeholder** içeriktir. Gerçek bilgilerle değiştirilmesi gerekiyor.

## İçeriği Kendi Bilgilerinizle Değiştirme

1. **Firma adı / logo:** `index.html` içinde `Anadolu Tekstil` ve `AT` (logo baş harfleri) geçen yerleri değiştirin. Aynı metinler `js/script.js` içindeki çeviri (translations) nesnesinde de varsa güncelleyin.
2. **Metinler:** Türkçe metinler `index.html` içinde görünür durumda, İngilizce metinler ise `js/script.js` içindeki `translations.en` nesnesinde. İkisini birbirine paralel güncelleyin.
3. **İletişim bilgileri:** Adres, telefon, e-posta `index.html` içindeki `#contact` bölümünde.
4. **Görseller:** Şu an "Fabrika Görseli", "Üretim Hattı 1" gibi kutucuklar CSS ile oluşturulan yer tutuculardır. Gerçek fotoğraflarınızı `images/` klasörüne koyup, `about-image` ve `gallery-item` elemanlarındaki `placeholder-block`/`<span>` içeriklerini `<img src="images/dosya-adi.jpg" alt="...">` ile değiştirin.
5. **Form:** İletişim formu şu anda gönderim yapmıyor (demo). Gerçek gönderim için aşağıdaki "Form nasıl çalışır hale gelir" bölümüne bakın.

### Form nasıl çalışır hale gelir?

Statik bir site kendi başına e-posta gönderemez. En kolay ücretsiz çözümler:

- **Formspree** (formspree.io) veya **Web3Forms** (web3forms.com): Ücretsiz plan var, `<form>` etiketine `action="https://formspree.io/f/xxxxx"` gibi bir adres eklemeniz yeterli, kod yazmaya gerek yok.
- Netlify'da barındırırsanız **Netlify Forms** otomatik çalışır (aşağıda).

## Siteyi Yerelde Görüntüleme

`index.html` dosyasına çift tıklayıp tarayıcıda açabilirsiniz. Daha sağlıklı test için basit bir yerel sunucu ile açmanız önerilir (bazı tarayıcı özellikleri `file://` ile kısıtlı çalışabilir):

```bash
# Proje klasöründeyken:
python -m http.server 8080
# Tarayıcıda: http://localhost:8080
```

---

## Yayınlama (Hosting) — İleride Ne İle Yayınlarız?

Bu bir **statik site** (HTML/CSS/JS, sunucu tarafı kod veya veritabanı yok). Bu, hem çok ucuz/ücretsiz hem de sorunsuz, kalıcı biçimde yayında tutmayı çok kolaylaştırır. İşte önerilen seçenekler:

### 1. Ücretsiz statik hosting + kendi alan adınız (Önerilen)

En yaygın ve güvenilir üçü: **Netlify**, **Vercel**, **Cloudflare Pages**. Üçü de:

- Statik siteleri **ücretsiz ve süresiz** barındırır (makul trafik sınırları içinde, tanıtım sitesi için fazlasıyla yeterli).
- Otomatik **HTTPS (SSL) sertifikası** sağlar (tarayıcıda "güvenli" kilit ikonu).
- Kendi alan adınızı (`www.anadolutekstil.com` gibi) bağlayabilirsiniz.
- Klasörü sürükle-bırak yaparak veya bir Git deposu (GitHub) bağlayarak yayınlarsınız; sonraki güncellemeler otomatik yayına alınır.
- Büyük şirketler (Cloudflare, Netlify, Vercel) tarafından işletildiği için "birden kaybolma" riski çok düşüktür.

**Maliyet:** Hosting tarafı 0 TL. Tek maliyet, isterseniz alacağınız alan adı (domain) — yıllık ortalama 150–400 TL (.com.tr veya .com için).

### 2. Türkiye merkezli klasik hosting (cPanel)

Natro, Turhost, İsimtescil gibi firmalardan yıllık ~200-600 TL'ye paylaşımlı hosting + domain paketi alıp dosyaları FTP/cPanel ile yüklemek. Artısı: Türkçe destek, Türk Lirası ile ödeme, tanıdık panel. Eksisi: Netlify/Vercel'e göre biraz daha fazla maliyet ve manuel güncelleme gerekir.

### 3. GitHub Pages

Kod GitHub'da tutulursa tamamen ücretsiz barındırma sağlar. Küçük tanıtım siteleri için idealdir, ancak formlar için mutlaka Formspree gibi 3. parti bir servise ihtiyaç duyulur (yukarıda belirtildi).

### Alan Adı (Domain) Hakkında

- "Süresiz yayında kalması" için asıl garanti, **alan adı kaydınızı düzenli olarak (genelde her yıl) yenilemenizdir**. Domain kaydı bir kerelik değildir, süre dolunca yenilenmezse site erişilemez hale gelir.
- Otomatik yenileme (auto-renew) seçeneğini kayıt firmasında açık tutmak, kartınızda geçerli bir ödeme yöntemi bırakmak "sıkıntı olmasın" isteğiniz için en kritik adımdır.
- Alan adını Türkiye'de **nic.tr** üzerinden (.com.tr için) veya Namecheap/GoDaddy gibi uluslararası kayıt firmalarından (.com için) alabilirsiniz.

### Özet Öneri

Bütçe ve teknik bakımı en aza indirmek istiyorsanız: **Domain'i bir kayıt firmasından alın (otomatik yenileme açık) → Siteyi Netlify veya Cloudflare Pages'e ücretsiz yükleyin → Domain'i buraya bağlayın.** Bu kurulum, ek bakım gerektirmeden yıllarca sorunsuz ve kalıcı biçimde yayında kalır; tek yapmanız gereken domain faturasının her yıl ödendiğinden emin olmaktır.

Site içeriğini (metin, görsel, iletişim bilgileri) gerçek verilerle güncelledikten sonra, yayına alma adımını birlikte yapabiliriz — hangi seçeneği tercih ettiğinizi söylemeniz yeterli.
