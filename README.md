# Solar Energy Conversion Lab 3D - 720p Builder

Prototipe pembelajaran energi surya berbasis **HTML + JavaScript + Three.js**. Implementasi mengikuti konsep PRD Solar Energy Conversion Lab 3D dan menggunakan primitive geometry untuk objek 3D.

## Perubahan versi ini

- Target layout utama **1280 x 720 (720p)** agar seluruh antarmuka terlihat dalam satu layar.
- Halaman judul tampil sebelum simulasi dan didefinisikan terpisah di `title.js`.
- Workspace 3D mulai dalam keadaan kosong.
- Semua komponen ditambahkan dari **Kotak Alat** melalui drag-and-drop atau klik alat lalu klik workspace.
- Semua objek yang telah ditempatkan dapat di-drag kembali di dalam canvas.
- Objek dapat dihapus dengan tiga cara:
  1. klik objek lalu tekan tombol **Hapus** pada toolbar scene;
  2. tekan **Delete/Backspace** setelah objek dipilih;
  3. drag objek ke zona **Lepaskan di sini untuk menghapus** yang muncul saat objek diseret.
- Tombol Reset menghapus seluruh objek dan mengembalikan parameter eksperimen ke kondisi awal.
- Lingkungan memakai futuristic backyard / outdoor energy lab dengan primitive geometry.
- Posisi Matahari mengikuti waktu simulasi.
- Konversi fotovoltaik hanya aktif pukul **06:00-18:00**.
- Material panel: Silicon, FAPbBr3, CdTe, NbSe2.
- Tiga beban elektronik maksimum sesuai PRD.
- Visualisasi aliran foton, DC, dan AC mengikuti posisi objek.

## Struktur file

```text
solar-energy-lab-3d-720p-builder/
├── index.html
├── title.js       # halaman judul / entry screen
├── app.js         # simulasi dan Three.js
├── style.css      # layout 720p dan UI
├── README.md
└── docs/
    ├── PRD.md
    └── IMPLEMENTATION-NOTES.md
```

## Menjalankan

Karena Three.js dimuat melalui CDN, jalankan proyek dari web server lokal.

### Python

```bash
python -m http.server 8080
```

Buka:

```text
http://localhost:8080
```

### Node.js

```bash
npx serve .
```

## Alur penggunaan

1. Buka aplikasi.
2. Pada halaman judul, pilih **Mulai Simulasi**.
3. Drag Matahari, Panel Surya, meter, inverter, dan perangkat dari Kotak Alat ke workspace.
4. Drag kembali objek pada canvas untuk mengatur posisi.
5. Klik objek untuk memilihnya.
6. Gunakan tombol Hapus, keyboard Delete/Backspace, atau drag ke zona tempat sampah jika ingin menghapus objek.
7. Atur waktu Matahari, irradiance, sudut panel, material, dan kondisi beban.
8. Tekan Play untuk menjalankan simulasi waktu.
9. Tekan Reset untuk mengosongkan workspace.

## Model energi inti

```text
P_solar = G_effective × A × max(0, cos(theta))
P_DC    = P_solar × eta_material
P_AC    = P_DC × eta_inverter
P_load  = sum(P_device × state_ON)
P_balance = P_AC - P_load
```

Pada pukul di luar 06:00-18:00, `G_effective = 0 W/m2`.

## Catatan

Simulasi ditujukan untuk pembelajaran konsep. Nilai material tetap perlu divalidasi oleh subject matter expert sebelum publikasi ilmiah atau penggunaan formal.

## Update meja dan ornamen

- Kotak Alat sekarang menyediakan **Meja Eksperimen** berbasis primitive geometry.
- Pengguna dapat menambahkan sampai **3 meja** di workspace.
- Panel surya, inverter, meter, dan perangkat elektronik dapat di-drag ke permukaan meja. Sistem melakukan snapping ke ketinggian permukaan meja.
- Ketika meja dipindahkan, komponen yang sedang berada di atas meja ikut berpindah secara horizontal.
- Jika meja dihapus, komponen yang didukung meja dikembalikan ke lantai workspace.
- Ornamen perimeter ditambah berupa garden bollard lights, bench, stepping stones, dan solar sculpture. Ornamen bersifat non-interaktif dan sengaja ditempatkan di luar area perakitan utama.


## Update: House Load Zone & Device Animation

- Decorative bench/table elements have been removed from the environment.
- The only tables are player-added **Meja Eksperimen**, up to three.
- A new open-front futuristic house is the dedicated **Zona Beban Listrik**.
- Electrical loads animate only when they are ON, receive sufficient AC power, and are positioned inside the house zone.
- Device animations: lamp glow, AC flap motion, TV screen animation, rice-cooker steam, laptop screen pulse, and refrigerator vibration/indicator.
- Daytime sky is slightly darker so the sun and its halo remain visually distinct.


## Revisi kontras lingkungan

- Furnitur dekoratif pada background dihilangkan.
- Meja Eksperimen tetap tersedia dari Kotak Alat, maksimal tiga unit.
- Lantai area perakitan menggunakan slate-gray gelap agar objek putih, abu, biru, dan oranye lebih kontras.
- Rumput dibuat hijau lebih gelap.
- Lantai Rumah / Zona Beban Listrik juga dibuat lebih gelap agar perangkat elektronik mudah dibaca.
- Grid kerja tetap terlihat dengan garis biru-keabuan yang lebih terang.


## Pembaruan Tema Kontras
- Langit dibuat lebih pekat agar matahari terlihat jelas.
- Lantai eksperimen dibuat lebih gelap untuk meningkatkan kontras objek.
- Setiap perangkat listrik yang aktif kini menampilkan indikator cahaya melingkar di sekeliling objek, selain animasi perangkat masing-masing.
