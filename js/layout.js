/* ==========================================================
   layout.js — HEADER & FOOTER dipakai bersama semua halaman
   Ubah menu / footer HANYA di file ini, semua halaman ikut berubah.
   Cara pakai di tiap halaman:
     <div id="site-header"></div> ... <div id="site-footer"></div>
     <script src="js/layout.js" defer></script>
   ========================================================== */
(function () {
  /* ---- DAFTAR MENU (h = tujuan, t = teks, i = ikon Font Awesome) ----
     Tambah halaman baru: tambahkan satu baris di sini. */
  const MENU = [
    { h: 'index.html',      t: 'Beranda',    i: 'fa-house' },
    { h: 'pendidikan.html', t: 'Pendidikan', i: 'fa-graduation-cap' },
    { h: 'masjid.html',     t: 'Masjid',     i: 'fa-mosque' },
    { h: 'galeri.html',     t: 'Galeri',     i: 'fa-images' }
  ];
  const KONTAK = { h: 'index.html#kontak', t: 'Kontak', i: 'fa-phone' };
  const WA = 'https://wa.me/62818983669';          // GANTI jika nomor WhatsApp berubah
  const NAMA = 'Yayasan Al-Qaaf';

  /* Deteksi halaman aktif (juga jika URL tanpa ".html") */
  let p = location.pathname.split('/').pop() || 'index.html';
  if (!p.includes('.')) p += '.html';
  const aktif = h => (h === p ? ' aria-current="page"' : '');

  /* ---- HEADER: logo + menu (menu atas hanya tampil di layar lebar) ---- */
  const header = `<header class="nav"><div class="wrap">
    <a class="brand" href="index.html"><img src="images/logo.png" alt="Logo ${NAMA}" width="44" height="44">${NAMA}</a>
    <nav class="nav-links" aria-label="Menu utama">
      ${MENU.map(m => `<a href="${m.h}"${aktif(m.h)}>${m.t}</a>`).join('')}
      <a class="btn btn-primary btn-sm" href="${KONTAK.h}">${KONTAK.t}</a>
    </nav></div></header>`;

  /* ---- FOOTER ---- */
  const footer = `<footer><div class="wrap">
    <p>&copy; ${new Date().getFullYear()} ${NAMA}. Seluruh hak cipta dilindungi.</p>
    <p>${MENU.map(m => `<a href="${m.h}">${m.t}</a>`).join(' · ')} · <a href="${WA}">WhatsApp</a></p>
    </div></footer>`;

  /* ---- MENU BAWAH (tampil hanya di HP, seperti aplikasi) ---- */
  const bawah = `<nav class="bottom-nav" aria-label="Menu cepat">
    ${MENU.concat(KONTAK).map(m => `<a href="${m.h}"${aktif(m.h)}><i class="fa-solid ${m.i}" aria-hidden="true"></i><span>${m.t}</span></a>`).join('')}
    </nav>`;

  const h = document.getElementById('site-header');
  const f = document.getElementById('site-footer');
  if (h) h.innerHTML = header;
  if (f) f.innerHTML = footer + bawah;
})();
