# Product Requirements Document

## Solar Energy Conversion Lab 3D

**Jenis produk:** Simulasi pembelajaran interaktif berbasis web 3D  
**Platform utama:** Browser desktop dan mobile  
**Ekspansi platform:** WebXR / Virtual Reality  
**Teknologi utama:** Three.js, JavaScript ES Modules, HTML5, CSS3, Vite  
**Versi dokumen:** 1.0  
**Tanggal:** 15 September 2026  
**Status:** Draft pengembangan  

---

## 1. Ringkasan Eksekutif

Solar Energy Conversion Lab 3D adalah simulasi pembelajaran interaktif berbasis browser yang memperlihatkan proses perubahan energi matahari menjadi energi listrik dan pemanfaatannya oleh perangkat elektronik. Produk mengadaptasi prinsip pengalaman belajar eksploratif yang umum ditemukan pada simulasi PhET, tetapi menggunakan visualisasi tiga dimensi dan fokus khusus pada material sel surya, daya listrik DC, inverter, daya listrik AC, serta manajemen beban.

Pengguna dapat memilih material aktif sel surya, mengubah intensitas cahaya dan sudut panel, menjalankan waktu simulasi, memilih perangkat elektronik, menyalakan atau mematikan beban, serta mengamati perubahan nilai energi dan aliran daya secara real-time. Representasi visual menggunakan partikel, warna, animasi, alat ukur virtual, indikator status, dan panel data.

Produk dikembangkan dengan pendekatan desktop-first. Mode WebXR disiapkan sebagai pengembangan lanjutan setelah model ilmiah, pengalaman pembelajaran, aksesibilitas, dan performa versi browser standar dinyatakan stabil.

---

## 2. Latar Belakang

Konsep perubahan energi, efisiensi sel surya, listrik DC, konversi DC ke AC, dan keseimbangan daya sering sulit dipahami apabila hanya disampaikan melalui rumus atau gambar statis. Pengguna membutuhkan media yang memperlihatkan hubungan sebab-akibat secara langsung.

Gambar konsep awal memperlihatkan komponen berikut:

1. Matahari sebagai sumber energi.
2. Digital timer.
3. Struktur sel surya yang terdiri atas glass, anode, material aktif, dan cathode.
4. Pilihan material Silicon, FAPbBr3, CdTe, dan NbSe2.
5. Indikator arus dan daya DC.
6. Inverter.
7. Tiga slot perangkat elektronik.
8. Pilihan beban berupa fridge, lamp, AC, TV, rice cooker, laptop, dan none.
9. Tombol ON dan OFF untuk setiap perangkat.

Produk menerjemahkan konsep tersebut menjadi laboratorium virtual 3D yang memungkinkan pengguna melakukan eksperimen berulang secara aman dan memperoleh umpan balik langsung.

---

## 3. Pernyataan Masalah

Media pembelajaran statis belum memadai untuk menunjukkan hubungan dinamis antara intensitas cahaya, sudut datang cahaya, jenis material, efisiensi konversi, rugi-rugi inverter, kebutuhan daya perangkat, dan perubahan energi terhadap waktu.

Produk harus menyediakan simulasi interaktif yang:

- Memvisualisasikan proses yang tidak dapat diamati secara langsung.
- Memungkinkan perubahan parameter secara bebas.
- Menghasilkan perhitungan yang konsisten dan dapat dijelaskan.
- Memberikan indikasi ketika daya mencukupi atau mengalami defisit.
- Mendukung eksplorasi mandiri dan eksperimen terpandu.
- Tetap dapat digunakan pada perangkat tanpa dukungan VR.

---

## 4. Visi Produk

> Menyediakan laboratorium energi surya 3D yang interaktif, mudah dipahami, inklusif, dan dapat diakses melalui browser untuk membantu pengguna memahami hubungan antara energi matahari, teknologi sel surya, konversi daya, dan konsumsi listrik.

---

## 5. Tujuan Produk

### 5.1 Tujuan Pembelajaran

Setelah menggunakan simulasi, pengguna diharapkan mampu:

1. Menjelaskan perubahan energi matahari menjadi energi listrik.
2. Mengidentifikasi fungsi lapisan dasar sel surya pada model yang disederhanakan.
3. Membandingkan pengaruh efisiensi beberapa material terhadap daya keluaran.
4. Menjelaskan perbedaan daya DC dan daya AC.
5. Menjelaskan fungsi inverter dan dampak efisiensinya.
6. Menghitung daya total dari beberapa perangkat elektronik.
7. Menentukan kondisi surplus, seimbang, dan defisit daya.
8. Menganalisis pengaruh intensitas cahaya dan sudut panel terhadap keluaran sistem.
9. Melakukan dan mendokumentasikan eksperimen virtual.

### 5.2 Tujuan Bisnis dan Implementasi

- Menghasilkan simulasi yang dapat dijalankan tanpa instalasi aplikasi khusus.
- Menyediakan produk yang dapat digunakan dalam demonstrasi kelas dan pembelajaran mandiri.
- Menyediakan arsitektur modular agar rumus, material, perangkat, bahasa, dan mode pembelajaran dapat diperluas.
- Memungkinkan pengembangan menuju WebXR tanpa menulis ulang inti simulasi.
- Menyediakan fondasi pengujian ilmiah, teknis, dan pengalaman pengguna.

---

## 6. Sasaran Pengguna

### 6.1 Pelajar atau Mahasiswa

Kebutuhan utama:

- Memahami konsep melalui manipulasi langsung.
- Melihat hasil perubahan parameter secara real-time.
- Mendapat instruksi eksperimen yang jelas.
- Mengulang eksperimen tanpa risiko kerusakan alat.

### 6.2 Guru, Dosen, atau Fasilitator

Kebutuhan utama:

- Mendemonstrasikan perubahan energi secara visual.
- Menyiapkan skenario eksperimen.
- Menggunakan simulasi pada proyektor atau laboratorium komputer.
- Membandingkan hasil beberapa konfigurasi.

### 6.3 Pengguna Mandiri

Kebutuhan utama:

- Menjelajahi sistem tanpa panduan formal.
- Mendapat penjelasan istilah dan komponen.
- Menggunakan kontrol yang intuitif.

### 6.4 Administrator Konten, Fase Lanjutan

Kebutuhan utama:

- Memperbarui material dan nilai parameter.
- Menambahkan perangkat elektronik.
- Menambahkan tantangan atau eksperimen.
- Mengelola teks antarmuka dan lokalisasi.

---

## 7. Ruang Lingkup Produk

### 7.1 Termasuk dalam MVP

- Scene laboratorium 3D.
- Kamera orbit untuk desktop dan kontrol sentuh untuk mobile.
- Matahari atau solar simulator.
- Panel surya berlapis dalam bentuk model edukatif.
- Pilihan empat material.
- Pengaturan intensitas cahaya.
- Pengaturan sudut panel.
- Timer simulasi.
- Perhitungan daya matahari, daya DC, daya AC, beban, dan energi.
- Meter DC dan AC.
- Inverter dengan efisiensi yang dapat dikonfigurasi.
- Tiga slot perangkat elektronik.
- Pilihan tujuh jenis beban termasuk None.
- Tombol ON/OFF per slot.
- Visualisasi aliran energi.
- Indikator normal, mendekati batas, dan overload.
- Panel data real-time.
- Tombol play, pause, reset, dan bantuan.
- Antarmuka Bahasa Indonesia.
- Dukungan keyboard dasar.
- Desain responsif untuk desktop dan tablet.

### 7.2 Termasuk dalam Rilis Edukasi Lengkap

- Mode Explore.
- Guided Experiment.
- Challenge Mode.
- Compare Mode.
- Grafik daya dan energi terhadap waktu.
- Penyimpanan hasil eksperimen secara lokal.
- Ekspor data eksperimen ke CSV.
- Bahasa Indonesia dan Inggris.
- Exploded view lapisan panel.
- Tooltip dan panel penjelasan konsep.
- Pengaturan kualitas grafis.
- Dukungan aksesibilitas lanjutan.
- Audio feedback opsional.

### 7.3 Termasuk dalam Fase WebXR

- Mode immersive VR.
- Interaksi controller.
- Teleportasi.
- Grab and place perangkat.
- Interaksi tombol dalam ruang 3D.
- Spatial user interface.
- Eksplorasi lapisan panel dalam skala diperbesar.
- Optimasi untuk headset standalone.

### 7.4 Tidak Termasuk dalam Versi Awal

- Simulasi semikonduktor tingkat atom yang sepenuhnya akurat.
- Perhitungan cuaca dunia nyata secara online.
- Integrasi perangkat panel surya fisik atau IoT.
- Multiplayer sinkron.
- Learning Management System terintegrasi.
- Akun pengguna berbasis server.
- Penyimpanan cloud.
- Simulasi instalasi listrik rumah yang bersertifikasi.
- Perhitungan desain sistem surya untuk penggunaan profesional.

---

## 8. Prinsip Desain Pengalaman

### 8.1 Eksplorasi Langsung

Setiap perubahan input harus segera memperbarui keluaran numerik dan visual tanpa membutuhkan proses submit terpisah.

### 8.2 Hubungan Sebab-Akibat

Pengguna harus dapat memahami alasan perubahan hasil. Contoh:

- Intensitas naik menyebabkan energi masuk meningkat.
- Sudut panel tidak optimal menyebabkan daya turun.
- Efisiensi material lebih tinggi menghasilkan daya DC lebih besar.
- Efisiensi inverter menimbulkan selisih daya DC dan AC.
- Penambahan perangkat meningkatkan beban.

### 8.3 Visualisasi Konsep Tak Terlihat

- Foton direpresentasikan dengan partikel kuning.
- Aliran DC direpresentasikan dengan partikel biru.
- Aliran AC direpresentasikan dengan partikel oranye.
- Kecepatan atau kepadatan partikel berubah mengikuti daya.
- Animasi harus bersifat representasional dan tidak diklaim sebagai visualisasi mikroskopis literal.

### 8.4 Kesalahan sebagai Bagian Eksperimen

Pengguna diperbolehkan membuat konfigurasi yang tidak efisien atau overload. Sistem harus menjelaskan kondisi, bukan hanya mencegah tindakan.

### 8.5 Sederhana tetapi Dapat Diperdalam

Tampilan awal hanya menampilkan kontrol utama. Parameter lanjutan tersedia melalui panel Advanced Settings.

### 8.6 Inklusif

Semua interaksi utama 3D harus memiliki padanan dalam antarmuka HTML agar dapat digunakan melalui keyboard dan teknologi asistif.

---

## 9. Alur Pengguna Utama

### 9.1 Memulai Eksperimen Bebas

1. Pengguna membuka aplikasi.
2. Aplikasi menampilkan halaman pembuka singkat.
3. Pengguna memilih mode Explore.
4. Scene laboratorium dimuat.
5. Pengguna memilih material panel.
6. Pengguna mengatur intensitas dan sudut panel.
7. Pengguna memilih perangkat pada tiga slot.
8. Pengguna menekan tombol Play.
9. Pengguna menyalakan perangkat.
10. Sistem memperbarui daya dan visualisasi aliran energi.
11. Pengguna mengamati status sistem dan grafik.
12. Pengguna mengubah konfigurasi atau menekan Reset.

### 9.2 Menjalankan Guided Experiment

1. Pengguna memilih Guided Experiment.
2. Sistem menampilkan tujuan eksperimen.
3. Sistem memberikan satu instruksi per langkah.
4. Sistem memeriksa apakah konfigurasi sesuai dengan instruksi.
5. Pengguna mencatat atau menyimpan hasil.
6. Sistem meminta pengguna mengubah satu variabel.
7. Sistem menampilkan perbandingan hasil.
8. Pengguna menjawab pertanyaan refleksi.
9. Sistem menampilkan ringkasan eksperimen.

### 9.3 Menyelesaikan Tantangan

1. Pengguna memilih Challenge Mode.
2. Sistem menampilkan target, batasan, dan indikator keberhasilan.
3. Pengguna mengatur sistem.
4. Sistem memvalidasi hasil secara real-time.
5. Sistem memberikan umpan balik tanpa langsung memberikan jawaban.
6. Tantangan selesai ketika seluruh kriteria terpenuhi.

---

## 10. Kebutuhan Fungsional

### FR-001: Inisialisasi Aplikasi

Sistem harus memuat scene 3D, konfigurasi awal, aset, data material, dan data perangkat. Sistem harus menampilkan loading progress dan pesan kegagalan yang dapat dipahami.

**Kriteria penerimaan:**

- Progress loading terlihat.
- Scene dapat digunakan setelah aset penting selesai dimuat.
- Aset opsional yang gagal tidak menyebabkan aplikasi berhenti total.
- Tersedia tombol mencoba kembali.

### FR-002: Navigasi Kamera

Sistem harus menyediakan orbit, zoom, dan pan terbatas pada mode desktop serta kontrol sentuh yang sesuai pada perangkat mobile.

**Kriteria penerimaan:**

- Kamera tidak menembus lantai atau keluar dari area laboratorium.
- Tersedia tombol Reset Camera.
- Kontrol kamera dapat dinonaktifkan ketika pengguna mengoperasikan slider atau objek tertentu.

### FR-003: Pemilihan Material

Sistem harus menyediakan pilihan material awal berikut:

- Silicon, efisiensi awal 27,3%.
- FAPbBr3, efisiensi awal 24,2%.
- CdTe, efisiensi awal 21,0%.
- NbSe2, efisiensi awal 0%.

Nilai tersebut harus ditempatkan dalam berkas konfigurasi, bukan ditanam langsung pada renderer. Nilai final wajib divalidasi oleh subject matter expert dan disertai sumber ilmiah pada rilis publik.

**Kriteria penerimaan:**

- Hanya satu material aktif pada satu waktu.
- Perubahan material langsung memperbarui hasil.
- Nama dan efisiensi material ditampilkan.
- Sistem dapat menampilkan informasi atau catatan sumber material.

### FR-004: Pengaturan Intensitas Cahaya

Pengguna harus dapat mengatur irradiance dari 0 sampai 1.200 W/m². Nilai awal adalah 1.000 W/m².

**Kriteria penerimaan:**

- Nilai dapat diubah melalui slider dan input numerik.
- Nilai di luar rentang ditolak atau disesuaikan ke batas terdekat.
- Intensitas visual matahari dan partikel berubah secara proporsional tanpa menyilaukan pengguna.

### FR-005: Pengaturan Sudut Panel

Pengguna harus dapat mengubah sudut datang cahaya terhadap normal panel.

**Kriteria penerimaan:**

- Rentang sudut yang digunakan aplikasi dijelaskan pada UI.
- Faktor sudut diperbarui ketika panel diputar.
- Sistem menyediakan tombol kembali ke sudut optimal.

### FR-006: Timer Simulasi

Sistem harus menyediakan fungsi Play, Pause, Step, Reset, dan pengaturan laju waktu.

**Kriteria penerimaan:**

- Timer tidak bertambah ketika simulasi dijeda.
- Reset mengembalikan waktu dan energi terakumulasi ke nol.
- Perubahan frame rate tidak mengubah hasil perhitungan energi secara signifikan.

### FR-007: Perhitungan Daya DC

Sistem harus menghitung daya DC berdasarkan irradiance, luas panel, faktor sudut, efisiensi material, dan faktor tambahan yang telah dikonfigurasi.

**Kriteria penerimaan:**

- Hasil untuk input yang sama selalu konsisten.
- Unit W ditampilkan.
- Pembulatan tampilan tidak mengubah nilai internal.
- Rumus dapat diuji secara terpisah dari scene 3D.

### FR-008: Inverter

Sistem harus mengubah daya DC menjadi daya AC menggunakan efisiensi inverter yang dapat dikonfigurasi.

**Kriteria penerimaan:**

- Daya AC tidak melebihi daya DC apabila efisiensi inverter tidak lebih dari 100%.
- Rugi-rugi daya ditampilkan.
- Inverter memiliki status OFF, standby, normal, near limit, dan overload.

### FR-009: Pemilihan Perangkat

Setiap dari tiga slot harus dapat memilih satu perangkat:

- Fridge, 150 W.
- Lamp, 5 W.
- AC, 300 W.
- TV, 100 W.
- Rice cooker, 300 W.
- Laptop, 60 W.
- None, 0 W.

Nilai beban harus disimpan dalam konfigurasi dan dapat diperbarui.

**Kriteria penerimaan:**

- Perangkat terpilih terlihat pada scene dan panel kontrol.
- Pemilihan None mengosongkan slot.
- Perubahan pilihan perangkat memperbarui potensi total beban.

### FR-010: Sakelar Perangkat

Setiap perangkat harus memiliki kontrol ON/OFF.

**Kriteria penerimaan:**

- Perangkat None tidak dapat dinyalakan.
- Status sakelar terlihat melalui teks, bentuk, dan warna.
- Total beban hanya menghitung perangkat yang ON.
- Perangkat memberikan animasi operasional ketika mendapat daya yang cukup.

### FR-011: Manajemen Defisit Daya

Sistem harus menyediakan dua mode:

1. **Conceptual:** seluruh perangkat dapat tetap divisualisasikan aktif, tetapi defisit dijelaskan.
2. **Realistic:** perangkat yang tidak memperoleh daya cukup gagal menyala atau diputus berdasarkan aturan prioritas.

**Kriteria penerimaan:**

- Mode aktif ditampilkan dengan jelas.
- Overload menghasilkan indikator visual dan teks.
- Aplikasi tidak menggunakan efek kedipan cepat.
- Aturan prioritas pada mode Realistic dapat dijelaskan kepada pengguna.

### FR-012: Visualisasi Aliran Energi

Sistem harus memperlihatkan aliran dari matahari ke panel, panel ke meter DC, meter ke inverter, serta inverter ke perangkat aktif.

**Kriteria penerimaan:**

- Arah aliran mudah dikenali.
- Jalur tidak aktif terlihat berbeda dari jalur aktif.
- Visualisasi dapat dikurangi atau dimatikan melalui Reduce Motion.
- Kecepatan partikel memiliki batas agar tetap nyaman dan stabil.

### FR-013: Panel Data Real-Time

Panel data harus menampilkan minimal:

- Irradiance.
- Luas panel.
- Sudut panel.
- Faktor sudut.
- Efisiensi material.
- Daya matahari yang diterima.
- Daya DC.
- Efisiensi inverter.
- Daya AC.
- Total beban.
- Surplus atau defisit.
- Energi DC dan AC terakumulasi.
- Waktu simulasi.
- Status sistem.

### FR-014: Grafik

Rilis edukasi lengkap harus menyediakan grafik terhadap waktu untuk daya DC, daya AC, total beban, dan energi.

**Kriteria penerimaan:**

- Grafik dapat dijeda dan direset.
- Legenda dapat dibaca tanpa hanya mengandalkan warna.
- Jumlah sampel dibatasi agar performa tetap stabil.
- Data grafik dapat diekspor ke CSV.

### FR-015: Reset

Sistem harus menyediakan:

- Reset eksperimen.
- Reset kamera.
- Reset grafik.
- Reset semua pengaturan.

Reset harus menampilkan konsekuensi tindakan secara jelas, terutama jika terdapat data eksperimen yang belum disimpan.

### FR-016: Bantuan Kontekstual

Pengguna harus dapat memilih komponen untuk melihat nama, fungsi, unit, dan penjelasan singkat.

### FR-017: Exploded View

Rilis edukasi lengkap harus memungkinkan lapisan panel dipisahkan secara visual untuk memperlihatkan glass, anode, material aktif, cathode, serta jalur terminal.

Visual harus diberi catatan bahwa model disederhanakan untuk pembelajaran.

### FR-018: Penyimpanan Lokal

Rilis edukasi lengkap harus dapat menyimpan konfigurasi dan hasil eksperimen pada perangkat pengguna melalui penyimpanan lokal browser.

### FR-019: Ekspor Data

Pengguna harus dapat mengunduh data eksperimen sebagai CSV yang berisi timestamp simulasi, parameter input, daya DC, daya AC, beban, keseimbangan daya, dan energi.

### FR-020: Lokalisasi

Sistem harus mendukung Bahasa Indonesia pada MVP dan Bahasa Indonesia serta Inggris pada rilis edukasi lengkap.

Semua teks harus dipisahkan dari logika aplikasi.

### FR-021: WebXR

Pada fase WebXR, sistem harus:

- Mendeteksi dukungan perangkat dan browser.
- Hanya menampilkan tombol Enter VR ketika mode didukung.
- Tetap menyediakan mode inline apabila VR tidak tersedia.
- Menangani controller yang terputus.
- Mengembalikan pengguna ke mode desktop secara aman setelah sesi berakhir.

---

## 11. Model Ilmiah dan Rumus

### 11.1 Daya Matahari yang Diterima

```text
P_solar = G x A x F_theta
```

Keterangan:

- `P_solar`: daya radiasi yang diterima panel, W.
- `G`: irradiance matahari, W/m².
- `A`: luas panel, m².
- `F_theta`: faktor sudut datang cahaya.

### 11.2 Faktor Sudut

```text
F_theta = max(0, cos(theta))
```

`theta` adalah sudut antara arah datang cahaya dan garis normal permukaan panel. Implementasi harus menggunakan definisi sudut yang konsisten pada UI, model matematika, dan rotasi objek 3D.

### 11.3 Daya DC

```text
P_DC = P_solar x eta_material
```

Keterangan:

- `P_DC`: daya DC keluaran panel, W.
- `eta_material`: efisiensi material dalam bentuk desimal.

### 11.4 Daya AC

```text
P_AC = P_DC x eta_inverter
```

Keterangan:

- `P_AC`: daya AC yang tersedia, W.
- `eta_inverter`: efisiensi inverter dalam bentuk desimal.

### 11.5 Total Beban

```text
P_load = sum(P_device_i x S_i)
```

`S_i` bernilai 1 apabila perangkat ON dan 0 apabila perangkat OFF.

### 11.6 Keseimbangan Daya

```text
P_balance = P_AC - P_load
```

Interpretasi:

- `P_balance > 0`: surplus.
- `P_balance = 0`: seimbang.
- `P_balance < 0`: defisit.

### 11.7 Energi

Apabila waktu dinyatakan dalam detik:

```text
E_Wh = P_W x delta_t_seconds / 3600
```

Perhitungan energi harus menggunakan delta time, bukan asumsi jumlah frame tetap.

### 11.8 Contoh Perhitungan

Konfigurasi:

- Irradiance: 1.000 W/m².
- Luas panel: 2 m².
- Faktor sudut: 1.
- Efisiensi Silicon: 0,273.
- Efisiensi inverter: 0,92.

Hasil:

```text
P_solar = 1.000 x 2 x 1 = 2.000 W
P_DC    = 2.000 x 0,273 = 546 W
P_AC    = 546 x 0,92 = 502,32 W
```

Apabila AC 300 W, TV 100 W, dan laptop 60 W dinyalakan:

```text
P_load    = 300 + 100 + 60 = 460 W
P_balance = 502,32 - 460 = 42,32 W surplus
```

### 11.9 Asumsi dan Batasan Model

- Model mengutamakan pemahaman konsep, bukan perancangan instalasi profesional.
- Nilai daya perangkat adalah nilai nominal yang disederhanakan.
- Lonjakan daya awal perangkat tidak dihitung pada MVP.
- Temperatur panel, shading parsial, degradasi, MPPT, karakteristik I-V, dan perubahan spektrum belum dihitung pada MVP.
- Efisiensi material pada rancangan awal harus diverifikasi oleh ahli sebelum publikasi.
- NbSe2 dengan efisiensi 0% diperlakukan sebagai konfigurasi pembanding sampai data final divalidasi.

---

## 12. Aturan Status Sistem

### OFF

Kondisi ketika irradiance nol, sistem dimatikan, atau simulasi belum dijalankan.

### Standby

Terdapat daya AC, tetapi tidak ada perangkat yang aktif.

### Normal

Daya AC mencukupi untuk seluruh beban aktif dan beban berada di bawah ambang near limit.

### Near Limit

Total beban mencapai ambang yang dapat dikonfigurasi, misalnya 90% dari daya AC tersedia.

### Overload

Total beban melebihi daya AC yang tersedia.

### No Conversion

Energi matahari diterima, tetapi model menghasilkan daya DC nol karena efisiensi material nol atau sistem konversi tidak aktif.

### Error

Terjadi kondisi data, aset, atau perhitungan yang tidak valid dan tidak dapat dipulihkan secara otomatis.

---

## 13. Mode Pembelajaran

### 13.1 Explore Mode

Pengguna bebas mengubah parameter dan mengamati hasil. Semua parameter utama tersedia.

### 13.2 Guided Experiment

Contoh eksperimen:

**Judul:** Perbandingan Efisiensi Material  
**Tujuan:** Membandingkan daya DC dan AC yang dihasilkan oleh material berbeda pada kondisi yang sama.

Langkah:

1. Atur irradiance 1.000 W/m².
2. Atur sudut optimal.
3. Pilih Silicon.
4. Jalankan simulasi selama 60 detik.
5. Catat daya DC, daya AC, dan energi.
6. Ulangi dengan FAPbBr3 dan CdTe.
7. Bandingkan hasil.
8. Jelaskan hubungan efisiensi dan energi keluaran.

### 13.3 Challenge Mode

Contoh tantangan:

- Nyalakan TV, laptop, dan kulkas tanpa overload.
- Hasilkan minimal 400 W daya AC.
- Temukan sudut panel yang menghasilkan setidaknya 80% dari daya maksimum.
- Pilih konfigurasi paling efisien untuk melayani beban tertentu.

### 13.4 Compare Mode

Pengguna menyimpan dua konfigurasi dan membandingkan:

- Material.
- Intensitas.
- Sudut.
- Daya DC.
- Daya AC.
- Beban.
- Energi.
- Status sistem.

---

## 14. Desain Antarmuka

### 14.1 Struktur Layar Desktop

```text
+----------------------------------------------------------------+
| Header: judul | mode | bahasa | bantuan | pengaturan           |
+----------------------+-----------------------------------------+
|                      | Panel kontrol                           |
|                      | - material                              |
| Scene laboratorium   | - irradiance                            |
| 3D                   | - sudut                                 |
|                      | - timer                                 |
|                      | - perangkat I, II, III                  |
+----------------------+-----------------------------------------+
| Panel data dan grafik real-time                                |
+----------------------------------------------------------------+
```

### 14.2 Struktur Layar Mobile

- Scene 3D memenuhi area utama.
- Panel kontrol disajikan sebagai bottom sheet.
- Panel data dapat diciutkan.
- Tombol Play, Pause, dan Reset selalu mudah dijangkau.
- Kontrol memiliki area sentuh minimum yang nyaman.

### 14.3 Objek 3D Utama

- Matahari atau solar simulator.
- Panel surya.
- Struktur lapisan panel.
- Meter DC.
- Inverter.
- Jalur distribusi.
- Tiga soket atau terminal perangkat.
- Model sederhana setiap perangkat.
- Lantai dan elemen laboratorium non-distraktif.

### 14.4 Skema Visual Energi

- Foton: kuning.
- DC: biru.
- AC: oranye.
- Normal: hijau dan ikon centang.
- Near limit: kuning dan ikon peringatan.
- Overload: merah dan ikon peringatan.
- Tidak aktif: abu-abu.

Warna tidak boleh menjadi satu-satunya pembeda status.

---

## 15. Arsitektur Teknis

### 15.1 Stack

- Three.js untuk rendering 3D.
- JavaScript ES Modules untuk implementasi aplikasi.
- Vite untuk development server dan bundling.
- HTML5 dan CSS3 untuk antarmuka serta accessibility layer.
- Chart.js atau pustaka ekuivalen untuk grafik.
- Vitest untuk unit test.
- GLTF/GLB untuk aset model 3D.
- WebXR API melalui integrasi Three.js untuk fase VR.

### 15.2 Prinsip Arsitektur

1. Logika ilmiah dipisahkan dari renderer.
2. State menjadi sumber data tunggal.
3. UI 2D dan scene 3D membaca state yang sama.
4. Data material dan perangkat berbasis konfigurasi.
5. Modul WebXR tidak menjadi dependensi wajib MVP.
6. Setiap fitur utama dapat diuji secara terpisah.

### 15.3 Diagram Komponen

```text
User Input
    |
    v
UI Controller / 3D Interaction
    |
    v
Simulation State
    |
    +-------------------+
    |                   |
    v                   v
Energy Calculator   Timer Engine
    |                   |
    +---------+---------+
              |
     +--------+---------+----------------+
     |                  |                |
     v                  v                v
Three.js Renderer   Data Panel      Chart Manager
     |                  |                |
     +------------------+----------------+
                        |
              Accessibility Layer
```

### 15.4 Struktur Direktori

```text
solar-energy-lab-3d/
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── docs/
│   ├── PRD.md
│   ├── SCIENTIFIC-MODEL.md
│   └── TEST-PLAN.md
├── public/
│   ├── models/
│   ├── textures/
│   ├── icons/
│   └── audio/
├── src/
│   ├── main.js
│   ├── style.css
│   ├── config/
│   │   ├── materials.js
│   │   ├── devices.js
│   │   └── simulation-config.js
│   ├── core/
│   │   ├── SceneManager.js
│   │   ├── CameraManager.js
│   │   ├── RendererManager.js
│   │   ├── AssetManager.js
│   │   └── InteractionManager.js
│   ├── simulation/
│   │   ├── EnergyCalculator.js
│   │   ├── SolarModel.js
│   │   ├── PanelModel.js
│   │   ├── InverterModel.js
│   │   ├── LoadModel.js
│   │   ├── SimulationClock.js
│   │   └── SimulationState.js
│   ├── visual/
│   │   ├── PhotonParticles.js
│   │   ├── DCCurrentParticles.js
│   │   ├── ACCurrentParticles.js
│   │   ├── EnergyFlow.js
│   │   └── StatusIndicator.js
│   ├── ui/
│   │   ├── ControlPanel.js
│   │   ├── DeviceSelector.js
│   │   ├── DataDisplay.js
│   │   ├── ExperimentGuide.js
│   │   └── ChartManager.js
│   ├── accessibility/
│   │   ├── KeyboardController.js
│   │   ├── ScreenReaderStatus.js
│   │   └── AudioFeedback.js
│   ├── localization/
│   │   ├── id.js
│   │   └── en.js
│   └── xr/
│       ├── XRManager.js
│       └── XRInteraction.js
└── tests/
    ├── energy-calculator.test.js
    ├── load-model.test.js
    └── simulation-clock.test.js
```

### 15.5 Contoh Struktur Data Material

```javascript
export const materials = [
  {
    id: 'silicon',
    name: 'Silicon',
    efficiency: 0.273,
    color: '#4f8f45',
    source: null,
    verified: false
  }
];
```

### 15.6 Contoh Struktur Data Perangkat

```javascript
export const devices = [
  {
    id: 'fridge',
    name: 'Fridge',
    powerWatt: 150,
    modelUrl: '/models/fridge.glb'
  }
];
```

---

## 16. Kebutuhan Nonfungsional

### NFR-001: Performa

- Target 60 FPS pada perangkat desktop menengah.
- Minimum yang dapat diterima 30 FPS pada perangkat target rendah.
- Waktu muat awal yang ditargetkan kurang dari 5 detik pada koneksi dan perangkat yang memadai.
- Aset 3D harus dikompresi dan menggunakan level of detail jika diperlukan.
- Jumlah partikel harus menyesuaikan kualitas perangkat.

### NFR-002: Responsivitas

Aplikasi harus dapat digunakan pada:

- Desktop dengan resolusi 1366 x 768 atau lebih tinggi.
- Tablet landscape.
- Mobile modern dengan adaptasi UI.

### NFR-003: Kompatibilitas

Versi desktop harus ditargetkan pada versi stabil terbaru browser berbasis Chromium, Firefox, dan Safari yang mendukung WebGL2. Dukungan aktual harus dicatat pada matriks pengujian menjelang rilis.

### NFR-004: Maintainability

- Tidak ada rumus penting yang disimpan di komponen visual.
- Tidak ada nilai material atau perangkat yang tersebar di banyak modul.
- Kode menggunakan penamaan konsisten.
- Setiap modul memiliki tanggung jawab terbatas.
- Dokumentasi harus diperbarui bersama perubahan model ilmiah.

### NFR-005: Keandalan

- Input tidak valid harus ditangani.
- Pause dan resume tidak boleh menggandakan timer.
- Perubahan tab browser tidak boleh menghasilkan lompatan energi yang tidak terkendali.
- Kehilangan konteks WebGL harus ditangani sejauh memungkinkan.

### NFR-006: Privasi

MVP tidak memerlukan akun dan tidak mengirimkan data pribadi. Penyimpanan eksperimen dilakukan secara lokal kecuali fitur server ditambahkan pada fase berikutnya.

### NFR-007: Keamanan

- Dependensi diperbarui dan diperiksa secara berkala.
- Tidak mengeksekusi teks pengguna sebagai kode.
- File ekspor harus dihasilkan dari data internal yang telah divalidasi.
- Deployment menggunakan HTTPS, terutama untuk kebutuhan WebXR.

### NFR-008: Kualitas Ilmiah

- Rumus dan asumsi harus terdokumentasi.
- Nilai parameter harus memiliki sumber atau status verifikasi.
- Perubahan model harus melalui review subject matter expert.
- Visualisasi konseptual harus dibedakan dari representasi ilmiah literal.

---

## 17. Aksesibilitas

### 17.1 Keyboard

Seluruh fungsi utama harus dapat digunakan melalui keyboard:

- Tab dan Shift+Tab untuk berpindah kontrol.
- Enter atau Space untuk aktivasi.
- Tombol panah untuk slider.
- Escape untuk menutup panel.
- Shortcut opsional untuk Play/Pause dan Reset.

### 17.2 Parallel DOM

Setiap objek 3D interaktif harus mempunyai kontrol HTML atau representasi semantik yang setara. Canvas 3D tidak menjadi satu-satunya cara berinteraksi.

### 17.3 Screen Reader

- Kontrol memiliki label yang bermakna.
- Perubahan status penting diumumkan melalui area live.
- Nilai daya diumumkan dengan unit.
- Pengumuman real-time dibatasi agar tidak terlalu sering.

### 17.4 Visual

- Kontras teks memenuhi pedoman aksesibilitas yang berlaku.
- Status tidak dibedakan hanya melalui warna.
- Tersedia high contrast mode.
- Ukuran teks dapat diperbesar tanpa merusak fungsi.

### 17.5 Gerakan dan Audio

- Tersedia Reduce Motion.
- Animasi partikel dapat dimatikan.
- Audio bersifat opsional.
- Informasi penting tidak hanya disampaikan melalui suara.

---

## 18. Analitik Produk

Jika analitik ditambahkan, implementasi harus memperhatikan persetujuan dan privasi. Metrik yang dapat digunakan:

- Jumlah sesi.
- Durasi sesi.
- Mode yang paling sering digunakan.
- Eksperimen yang diselesaikan.
- Tantangan yang diselesaikan.
- Fitur yang sering dibuka.
- Perangkat dan ukuran layar secara agregat.
- Error aplikasi.
- Frame rate dan waktu muat secara agregat.

Analitik tidak boleh merekam jawaban atau identitas tanpa kebutuhan dan persetujuan yang jelas.

---

## 19. Strategi Pengujian

### 19.1 Unit Test

Modul yang wajib diuji:

- Faktor sudut.
- Perhitungan daya matahari.
- Perhitungan daya DC.
- Perhitungan daya AC.
- Total beban.
- Surplus dan defisit.
- Akumulasi energi.
- Timer.
- Perubahan state.

### 19.2 Integration Test

- Perubahan slider memperbarui state dan tampilan.
- Perubahan material memperbarui kalkulasi dan visual.
- ON/OFF perangkat memperbarui beban.
- Reset mengembalikan kondisi awal.
- Grafik menerima data sesuai kalkulasi.
- Pause menghentikan akumulasi energi.

### 19.3 Visual Test

- Posisi objek tidak tumpang tindih.
- Label dapat dibaca.
- Partikel mengikuti jalur energi.
- Status visual konsisten.
- Tampilan tidak rusak pada ukuran layar target.

### 19.4 Accessibility Test

- Semua kontrol dapat dicapai keyboard.
- Urutan fokus logis.
- Screen reader mengumumkan label dan status.
- Reduce Motion bekerja.
- Informasi tetap dapat dipahami tanpa warna.

### 19.5 Performance Test

- FPS pada perangkat target.
- Penggunaan memori selama eksperimen panjang.
- Waktu muat aset.
- Stabilitas jumlah partikel.
- Performa ketika grafik menyimpan banyak sampel.

### 19.6 Scientific Validation

- Review rumus oleh ahli.
- Perbandingan keluaran dengan perhitungan manual.
- Verifikasi definisi sudut.
- Verifikasi satuan.
- Verifikasi sumber nilai efisiensi material.
- Dokumentasi batasan model.

### 19.7 User Acceptance Test

Minimal melibatkan:

- Pengguna pelajar atau mahasiswa.
- Guru atau dosen.
- Pengguna dengan tingkat pengalaman teknologi berbeda.

Tugas pengujian:

1. Menghasilkan daya AC tertentu.
2. Membandingkan dua material.
3. Menyalakan tiga perangkat tanpa overload.
4. Menjelaskan alasan daya berubah.
5. Menyelesaikan satu eksperimen terpandu.

---

## 20. Kriteria Penerimaan MVP

MVP dinyatakan selesai apabila:

1. Aplikasi dapat dijalankan melalui browser tanpa instalasi khusus oleh pengguna akhir.
2. Scene 3D dapat dinavigasi pada desktop dan tablet target.
3. Empat material dapat dipilih.
4. Intensitas dan sudut panel dapat diubah.
5. Perhitungan manual dan hasil aplikasi sesuai dalam toleransi pembulatan.
6. Inverter menampilkan daya AC dan rugi-rugi.
7. Tiga perangkat dapat dipilih dan diaktifkan secara independen.
8. Surplus dan defisit daya ditampilkan dengan benar.
9. Energi terakumulasi sesuai waktu simulasi.
10. Play, Pause, dan Reset bekerja konsisten.
11. Aliran energi divisualisasikan dari sumber sampai beban.
12. Fungsi utama dapat dijalankan melalui UI HTML dan keyboard.
13. Tidak terdapat error kritis pada browser target.
14. Dokumentasi model ilmiah dan asumsi tersedia.
15. Subject matter expert telah meninjau parameter material sebelum publikasi.

---

## 21. Risiko dan Mitigasi

### Risiko: Simulasi Terlihat Menarik tetapi Konsep Tidak Jelas

**Mitigasi:** Uji pembelajaran sejak prototipe awal, batasi dekorasi, dan pastikan visual selalu terkait variabel yang sedang dipelajari.

### Risiko: Nilai Efisiensi Tidak Akurat atau Tidak Sejajar

**Mitigasi:** Pisahkan data dari kode, tambahkan metadata sumber, dan lakukan validasi ahli sebelum publikasi.

### Risiko: Pengguna Menganggap Model sebagai Alat Desain Profesional

**Mitigasi:** Tampilkan batasan dan label simulasi edukatif pada halaman informasi dan dokumentasi.

### Risiko: Performa Rendah pada Perangkat Mobile

**Mitigasi:** Gunakan adaptive quality, kompresi GLB, pembatasan partikel, baked lighting, dan resolusi dinamis.

### Risiko: Kontrol 3D Sulit Digunakan

**Mitigasi:** Sediakan panel HTML sebagai alternatif, onboarding singkat, reset camera, dan target interaksi berukuran besar.

### Risiko: WebXR Tidak Didukung Semua Perangkat

**Mitigasi:** Pertahankan mode desktop sebagai pengalaman lengkap dan jadikan XR sebagai progressive enhancement.

### Risiko: Scope Creep

**Mitigasi:** Gunakan pembagian MVP, rilis edukasi, dan WebXR serta terapkan definition of done per fase.

### Risiko: Aset 3D Menghambat Pengembangan

**Mitigasi:** Gunakan primitive geometry pada prototipe dan ganti dengan GLB teroptimasi setelah mekanisme pembelajaran stabil.

---

## 22. Roadmap Pengembangan

### Fase 0: Discovery dan Validasi, 1 Minggu

- Finalisasi tujuan pembelajaran.
- Validasi rumus.
- Validasi material dan parameter.
- Menentukan target perangkat.
- Menyusun wireframe.
- Menentukan kriteria keberhasilan pembelajaran.

### Fase 1: MVP Desktop 3D, 3 sampai 4 Minggu

- Setup Vite dan Three.js.
- Scene, kamera, cahaya, dan layout.
- Panel dan matahari.
- Mesin kalkulasi.
- Material selector.
- Intensitas dan sudut.
- Inverter dan meter.
- Tiga slot perangkat.
- Timer dan reset.
- Visualisasi aliran energi.
- Panel data.
- Unit test inti.

### Fase 2: Rilis Edukasi, 3 sampai 4 Minggu

- Guided Experiment.
- Challenge Mode.
- Compare Mode.
- Grafik.
- Ekspor CSV.
- Exploded view.
- Lokalisasi Inggris.
- Penyempurnaan aksesibilitas.
- User testing.

### Fase 3: WebXR, 3 sampai 5 Minggu

- Capability detection.
- VR camera dan session.
- Controller interaction.
- Teleportasi.
- Grab and place.
- Spatial UI.
- Optimasi headset.
- Pengujian perangkat XR.

### Estimasi Total Part-Time

Dengan alokasi sekitar 3 sampai 4 jam per hari:

- MVP desktop 3D: 3 sampai 4 minggu.
- Rilis edukasi lengkap: 6 sampai 8 minggu kumulatif.
- Desktop, edukasi, dan WebXR: 9 sampai 13 minggu kumulatif.

Estimasi harus diperbarui setelah validasi jumlah aset 3D, kompleksitas panel, dan perangkat pengujian.

---

## 23. Prioritas Backlog

### Must Have

- Model kalkulasi energi.
- Scene 3D utama.
- Pemilihan material.
- Irradiance dan sudut.
- Inverter.
- Tiga perangkat.
- ON/OFF.
- Timer.
- Panel data.
- Surplus dan defisit.
- Reset.
- Unit test kalkulasi.

### Should Have

- Grafik.
- Guided Experiment.
- Compare Mode.
- Exploded view.
- Penyimpanan lokal.
- Ekspor CSV.
- Bahasa Inggris.
- High contrast dan Reduce Motion.

### Could Have

- Challenge Mode lanjutan.
- Audio feedback.
- Achievement lokal.
- PWA dan offline mode.
- Integrasi LMS.
- WebXR.

### Won't Have pada MVP

- Multiplayer.
- Backend akun.
- Cloud synchronization.
- IoT panel surya.
- Simulasi semikonduktor atomistik.

---

## 24. Dependensi

- Persetujuan model ilmiah.
- Sumber nilai material yang dapat dipertanggungjawabkan.
- Aset 3D atau kapasitas pembuatan aset.
- Perangkat desktop dan mobile untuk pengujian.
- Headset yang kompatibel untuk fase WebXR.
- HTTPS pada hosting untuk fitur WebXR.
- Reviewer pendidikan atau subject matter expert.

---

## 25. Deliverables

### MVP

- Source code.
- Build production.
- README instalasi dan deployment.
- Dokumen model ilmiah.
- PRD.
- Test plan.
- Unit test.
- Aset 3D teroptimasi.
- Panduan pengguna singkat.

### Rilis Edukasi

- Paket guided experiments.
- Challenge scenarios.
- Grafik dan ekspor data.
- Bahasa Indonesia dan Inggris.
- Laporan uji pengguna.
- Accessibility checklist.

### WebXR

- Mode VR.
- Panduan perangkat kompatibel.
- Panduan kontrol VR.
- Laporan pengujian headset.

---

## 26. Definition of Done

Sebuah fitur dinyatakan selesai apabila:

1. Kriteria penerimaan terpenuhi.
2. Kode telah direview.
3. Unit test atau integration test relevan lulus.
4. Tidak terdapat error kritis pada console.
5. Fungsi dapat digunakan melalui metode input target.
6. Dokumentasi diperbarui.
7. Teks tersedia dalam bahasa rilis yang diwajibkan.
8. Dampak aksesibilitas telah diperiksa.
9. Dampak performa telah diperiksa.
10. Perubahan model ilmiah telah divalidasi.

---

## 27. Pertanyaan Terbuka

1. Apakah nilai efisiensi pada gambar merupakan nilai yang harus dipertahankan atau hanya contoh visual?
2. Apakah luas panel harus tetap atau dapat diubah pengguna?
3. Apakah sistem menggunakan matahari alami atau solar simulator laboratorium?
4. Apakah sudut yang ditampilkan adalah sudut panel terhadap horizontal atau sudut datang terhadap normal panel?
5. Berapa efisiensi inverter yang disepakati?
6. Apakah overload mematikan semua perangkat atau hanya perangkat terakhir?
7. Apakah perangkat memiliki prioritas?
8. Apakah dibutuhkan lonjakan daya awal perangkat?
9. Apakah hasil eksperimen perlu dinilai otomatis?
10. Apakah produk akan digunakan pada sekolah, perguruan tinggi, atau keduanya?
11. Apakah mode offline wajib?
12. Headset apa yang menjadi target fase WebXR?
13. Apakah aplikasi perlu diintegrasikan dengan LMS?
14. Apakah pengguna perlu mengunduh lembar kerja atau laporan PDF?

---

## 28. Referensi Teknis dan Desain

- PhET Energy Forms and Changes: https://phet.colorado.edu/sims/html/energy-forms-and-changes/latest/energy-forms-and-changes_all.html
- PhET Inclusive Features: https://phet.colorado.edu/en/accessibility
- Three.js Documentation: https://threejs.org/docs/
- Three.js WebXRManager: https://threejs.org/docs/pages/WebXRManager.html
- Immersive Web: https://immersiveweb.dev/
- Babylon.js WebXR sebagai referensi alternatif: https://doc.babylonjs.com/features/featuresDeepDive/webXR

Referensi PhET digunakan sebagai inspirasi prinsip interaksi dan pembelajaran. Produk tidak boleh menyalin aset, kode, identitas visual, atau komponen berhak cipta tanpa izin yang sesuai.

---

## 29. Riwayat Perubahan

| Versi | Tanggal | Perubahan |
|---|---|---|
| 1.0 | 15 September 2026 | Dokumen awal PRD Solar Energy Conversion Lab 3D |

---

## 30. Persetujuan

| Peran | Nama | Status | Tanggal |
|---|---|---|---|
| Product Owner |  | Draft |  |
| Subject Matter Expert |  | Belum ditinjau |  |
| Technical Lead |  | Belum ditinjau |  |
| UI/UX Reviewer |  | Belum ditinjau |  |
| Accessibility Reviewer |  | Belum ditinjau |  |
