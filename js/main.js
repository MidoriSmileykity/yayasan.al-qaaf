/* ==========================================================
   main.js — Skrip website Al-Qaaf
   1) Jadwal sholat otomatis (API Aladhan, metode Kemenag RI)
   2) Tombol "Salin" nomor rekening
   ========================================================== */

/* ---- PENGATURAN: ganti kota sesuai lokasi yayasan ---- */
const KOTA = 'Bekasi';        // GANTI: nama kota/kabupaten
const NEGARA = 'Indonesia';

/* ---- 1) Jadwal sholat ---- */
const NAMA = {Fajr:'Subuh',Dhuhr:'Dzuhur',Asr:'Ashar',Maghrib:'Maghrib',Isha:'Isya'};

function tampilkanJadwal(t){
  const box = document.getElementById('prayer-grid');
  if(!box) return;
  const now = new Date(), menitNow = now.getHours()*60+now.getMinutes();
  // cari waktu sholat berikutnya agar bisa disorot kuning
  let next = Object.keys(NAMA).find(k=>{const [h,m]=t[k].split(':');return h*60+ +m>menitNow}) || 'Fajr';
  box.innerHTML = Object.keys(NAMA).map(k=>
    `<div class="prayer-item${k===next?' next':''}"><b>${NAMA[k]}</b><span>${t[k].slice(0,5)}</span></div>`).join('');
}

async function muatJadwal(){
  const box = document.getElementById('prayer-grid');
  if(!box) return;
  const hari = new Date().toISOString().slice(0,10);
  try{
    // simpan di localStorage agar hemat request (1x per hari)
    const cache = JSON.parse(localStorage.getItem('jadwal')||'null');
    if(cache && cache.hari===hari){ return tampilkanJadwal(cache.t); }
    const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(KOTA)}&country=${NEGARA}&method=20`;
    const res = await fetch(url);
    const t = (await res.json()).data.timings;
    localStorage.setItem('jadwal',JSON.stringify({hari,t}));
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
