/* ==========================================================
   main.js — Skrip website Al-Qaaf
   1) Jadwal sholat otomatis (API Aladhan, metode Kemenag RI)
   2) Tombol "Salin" nomor rekening
   Dipakai di index.html (halaman lain aman: fungsi berhenti jika elemennya tidak ada).
   ========================================================== */

/* ---- PENGATURAN: koordinat yayasan (sama dengan titik peta di index.html) ----
   Memakai koordinat lebih andal daripada nama kota. */
const LAT = -6.2577176;     // GANTI jika lokasi berubah
const LNG = 106.7491481;
const ZONA = 'Asia/Jakarta'; // WIB; ganti 'Asia/Makassar' (WITA) atau 'Asia/Jayapura' (WIT) bila perlu

/* ---- 1) Jadwal sholat ---- */
const NAMA = {Fajr:'Subuh',Dhuhr:'Dzuhur',Asr:'Ashar',Maghrib:'Maghrib',Isha:'Isya'};

/* Ubah "04:41" (atau "04:41 (WIB)") menjadi menit sejak tengah malam */
function keMenit(s){const [h,m]=s.split(':');return parseInt(h,10)*60+parseInt(m,10);}

function tampilkanJadwal(t){
  const box = document.getElementById('prayer-grid');
  if(!box) return;
  // jam sekarang menurut zona yayasan (bukan zona perangkat pengunjung)
  const sekarang = new Date().toLocaleTimeString('en-GB',{timeZone:ZONA,hour:'2-digit',minute:'2-digit',hour12:false});
  const menitNow = keMenit(sekarang);
  // cari waktu sholat berikutnya agar disorot; lewat Isya -> Subuh besok
  const next = Object.keys(NAMA).find(k=>keMenit(t[k])>menitNow) || 'Fajr';
  box.innerHTML = Object.keys(NAMA).map(k=>
    `<div class="prayer-item${k===next?' next':''}"><b>${NAMA[k]}</b><span>${t[k].slice(0,5)}</span></div>`).join('');
}

async function muatJadwal(){
  const box = document.getElementById('prayer-grid');
  if(!box) return;
  const d = new Date();
  // kunci cache memuat tanggal LOKAL + lokasi, agar tidak memakai jadwal hari/kota lain
  const kunci = `jadwal|${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}|${LAT},${LNG}`;
  try{
    const cache = JSON.parse(localStorage.getItem('jadwal')||'null');
    if(cache && cache.kunci===kunci){ return tampilkanJadwal(cache.t); }
  }catch(e){ /* cache rusak: abaikan, ambil ulang */ }
  try{
    const url = `https://api.aladhan.com/v1/timings?latitude=${LAT}&longitude=${LNG}&method=20&timezonestring=${ZONA}`;
    const res = await fetch(url);
    if(!res.ok) throw new Error('HTTP '+res.status);
    const t = (await res.json()).data.timings;
    try{ localStorage.setItem('jadwal',JSON.stringify({kunci,t})); }catch(e){}
    tampilkanJadwal(t);
  }catch(e){
    box.innerHTML = '<p>Jadwal sholat belum dapat dimuat. Silakan muat ulang halaman.</p>';
  }
}
muatJadwal();

/* ---- 2) Salin nomor rekening ---- */
document.querySelectorAll('.copy-btn').forEach(b=>b.addEventListener('click',async()=>{
  try{ await navigator.clipboard.writeText(b.dataset.copy); b.textContent='Tersalin ✓'; }
  catch(e){ b.textContent='Salin manual'; }
  setTimeout(()=>b.textContent='Salin nomor',2000);
}));
