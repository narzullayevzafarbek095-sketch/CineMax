# CineMax — Online Kino Platformasi 🎬

**CineMax** — zamonaviy, premium ko‘rinishdagi to‘liq interaktiv online kino platformasi. Loyiha Netflix va HBO Max kabi jahon darajasidagi striming xizmatlari dizayni asosida, qulay UX va ilg‘or funksiyalar bilan boyitilgan.

---

## 🌟 Asosiy Imkoniyatlar va Funksiyalar

### 1. 🎨 Premium Dizayn va Vizual Ko‘rinish
- **Ranglar uyg‘unligi**: Chuqur qora (`#08080a`), to‘q kulrang (`#101015`) va yorqin kinoteatr qizili (`#e50914`).
- **Glassmorphism va Vignette**: Shaffof muzlatilgan shisha effektlari (`backdrop-filter: blur`), yorqin neon soya effektlari.
- **Tipografiya**: Google Fonts (`Outfit` va `Plus Jakarta Sans`) hamda FontAwesome 6 ikonkalari.
- **Mikro-animatsiyalar**: Posterlarning 3D masshtablanishi, silliq hover effektlari, tugmalar animatsiyasi.
- **To‘liq Responsive**: Mobil smartfonlar, planshetlar va kompyuterlar uchun 100% moslashuvchan.

### 2. 🏠 Bosh Sahifa (Hero Showcase & Karusellar)
- **Katta Dinamik Banner**:
  - Mashhur filmning keng formatli foni va nomi.
  - Reyting (IMDb 8.6+), yosh chegarasi (16+), sifati (4K Ultra HD), davomiyligi va janri.
  - Qisqacha qiziqarli tavsif.
  - **“▶ Film haqida”** va **“＋ Sevimlilarga qo‘shish”** interaktiv tugmalari.
  - Avtomatik va qo‘lda boshqariladigan silliq slayder nuqtalari.
- **Netflix Uslubidagi Karusellar**:
  - 🔥 *Hozir trenddagi kinolar*
  - ⭐ *Yuqori IMDb reytingli durdonalar*
  - 📺 *Mashhur seriallar to‘plami*
  - 🎬 *Sizga tavsiya etilgan sara kinolar*

### 3. 📂 Kengaytirilgan Kinolar Katalogi (24+ Film va Serial)
- 9 ta to‘liq janr filtrlari:
  1. **Jangari** (Action)
  2. **Komediya** (Comedy)
  3. **Fantastika** (Sci-Fi)
  4. **Sarguzasht** (Adventure)
  5. **Drama** (Drama)
  6. **Dahshat** (Horror)
  7. **Multfilm** (Animation)
  8. **Detektiv** (Mystery)
  9. **Romantik** (Romance)
- **Har bir kino kartasida**:
  - Yuqori sifatli kino posteri.
  - Film nomi va original nomi.
  - Chiqqan yili.
  - Janr tegi.
  - IMDb aniq reytingi (masalan: `★ 8.9`).
  - Tezkor sevimlilarga saqlash yurakcha tugmasi (`♥`).
  - “Batafsil” tugmasi va tezkor Play ikonka effekti.

### 4. 🔍 Aqlli Qidiruv Tizimi (Instant Smart Search)
- Foydalanuvchi klaviaturada yozishi bilanoq natijalar jonli yangilanadi.
- Qidiruv quyidagilar bo‘yicha amalga oshiriladi:
  - Kino nomi (o‘zbekcha va inglizcha).
  - Janri.
  - Chiqqan yili.
  - Rejissyor va bosh rol ijrochilari.
- Hech narsa topilmasa, **“Kino topilmadi”** chiroyli xabari va filtrlarni tozalash tugmasi chiqadi.
- Klaviatura yordamida tez ochish: `Ctrl + K`.

### 5. 🎞️ Kino Haqida Batafsil Sahifa (Interactive Modal)
Har bir kartaga bosilganda ochiluvchi mukammal sahifa:
- Katta fon rasmi va sifatli poster.
- Film nomi, original sarlavhasi, yili, davomiyligi, yosh toifasi, sifati, audio tili.
- Rejissyor va aktyorlar chiplari.
- **4 ta interaktiv bo‘lim (Tablar)**:
  1. **Film haqida**: To‘liq syujet tavsifi va batafsil texnik ma'lumotlar.
  2. **Treyler & Video Player**: Haqiqiy boshqaruv tugmalariga ega video player.
  3. **Ijodkorlar**: Rejissyor va bosh qahramonlar ro‘yxati.
  4. **Sharhlar va Baholar**: Foydalanuvchilar fikri va yangi sharh qoldirish shakli.

---

## 🚀 Loyihaga Qo‘shilgan Qo‘shimcha Eksklyuziv Imkoniyatlar (Extra Features)

1. 🎬 **Haqiqiy Interaktiv Video Player**:
   - Play / Pause (Klaviatura orqali `Space` tugmasi ham ishlaydi).
   - 10 soniya orqaga / oldinga o‘tkazish.
   - Vaqt chizig‘i (Progress scrub bar) va vaqt ko‘rsatkichi (`MM:SS`).
   - Ovoz balandligini sozlash va Mute funksiyasi.
   - Tezlik tanlash (0.75x, 1.0x, 1.25x, 1.5x, 2.0x).
   - To‘liq ekranga yoyish (Fullscreen mode).

2. ⭐ **Sevimlilar (Watchlist) Tizimi**:
   - Bir marta bosish orqali filmlarni sevimlilar ro‘yxatiga kiritish va o‘chirish.
   - Barcha ma'lumotlar brauzerning `localStorage` xotirasida xavfsiz saqlanadi.
   - Navigatsiya menyusida va mobil panelda jonli sanagich (`Badge count`).
   - Alohida **“Sevimlilar”** bo‘limi va bo‘sh holat (`Empty state`) dizayni.

3. 🎲 **“Bugun nima ko‘ramiz?” (Tasodifiy Kino Tanlash / Roulette)**:
   - Nima ko‘rishni bilmayotgan foydalanuvchilar uchun interaktiv ruletka animatsiyasi.
   - 7.5 dan yuqori reytingli ajoyib film tavsiya qilinadi va darhol ko‘rish imkoniyati beriladi.

4. 💬 **Fikr-mulohazalar va Yulduzcha Baholash (Reviews & Ratings)**:
   - Foydalanuvchilar 1 dan 5 gacha yulduzcha tanlab o‘z taassurotlarini qoldirishi mumkin.
   - Sharhlar `localStorage` orqali saqlanib, film sahifasida doimiy ko‘rinib turadi.

5. 🔔 **Interaktiv Toast Bildirishnomalar**:
   - “Sevimlilarga qo‘shildi”, “Havola nusxalandi”, “Sharhingiz saqlandi” kabi zamonaviy qalqib chiquvchi xabarlar.

6. 📱 **Mobil Ilova Uslubidagi Pastki Menyu (Bottom Navigation Bar)**:
   - Smartfonlarda xuddi mobil ilova kabi qulay boshqaruv paneli (Bosh sahifa, Katalog, Janrlar, Sevimlilar, Haqida).

7. 📤 **Film Havolasini Ulashish**:
   - Bir tugma bilan film havolasini nusxalash va do‘stlar bilan ulashish.

---

## 📁 Fayllar Tuzilishi

```
New folder (3)/
├── index.html            # Asosiy HTML5 tuzilmasi va semantik belgilashlar
├── css/
│   └── style.css         # Dizayn tizimi, neon effektlar, grid va video player stillari
├── js/
│   ├── movies-data.js    # 24 ta film va serial ma'lumotlar bazasi (o'zbek tilida)
│   └── app.js            # To'liq reaktiv dastur logikasi, qidiruv, filtrlar va pleyer
└── README.md             # Loyiha hujjatlari va yo'riqnoma
```

---

## 💻 Qanday Ishga Tushiriladi?

Loyiha sof HTML5, zamonaviy CSS3 va Vanilla JavaScript asosida yaratilgan. Uni ishga tushirish uchun hech qanday qo‘shimcha dasturlar yoki server o‘rnatish talab etilmaydi!

1. Papkadagi [index.html](file:///c:/Users/user/Desktop/New%20folder%20(3)/index.html) faylini sichqoncha bilan ikki marta bosing.
2. Sahifa sizning sevimli brauzeringizda (Google Chrome, Microsoft Edge, Mozilla Firefox va h.k.) ochiladi va to‘liq ishga tushadi!
