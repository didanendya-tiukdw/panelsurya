# Implementation Notes

## Workspace builder

Scene inti dimulai kosong. Pengguna menambahkan seluruh komponen melalui Kotak Alat. Komponen inti (Matahari, Panel Surya, Inverter, Meter DC, Meter AC) dibatasi satu instance. Beban elektronik dapat ditambahkan sampai tiga instance.

## Waktu dan Matahari

Waktu matahari berada pada rentang 00:00 sampai 24:00.

- 06:00: matahari berada di sisi timur/horizon.
- 12:00: matahari berada pada elevasi tertinggi.
- 18:00: matahari berada di sisi barat/horizon.
- Di luar 06:00–18:00, matahari divisualisasikan di bawah horizon dan produksi PV dinonaktifkan.

Drag pada Matahari menggeser jalur lintasannya secara horizontal/depth tanpa memutus hubungan posisi terhadap waktu.

## Model energi

Model PRD dipertahankan. Kondisi waktu ditambahkan sebagai gate operasional:

```text
G_effective = G_user, jika Matahari + Panel ada dan 06:00 <= waktu <= 18:00
G_effective = 0, selain itu

P_solar = G_effective x A x max(0, cos(theta))
P_DC    = P_solar x eta_material
P_AC    = P_DC x eta_inverter, jika Inverter ada
```

Meter berfungsi sebagai visualisasi/alat ukur dan tidak menjadi syarat kalkulasi daya.

## Update layout 720p dan object removal

- UI kini ditargetkan untuk frame 1280 x 720 agar toolbox, workspace, parameter, data real-time, navigasi mode, dan kontrol transport dapat ditampilkan dalam satu layar.
- `title.js` menangani halaman judul secara terpisah dari logika simulasi utama.
- Seleksi objek menggunakan `THREE.BoxHelper`.
- Penghapusan objek dapat dilakukan melalui tombol Hapus, Delete/Backspace, atau drag ke trash zone.
- Reset menghapus semua objek dari workspace.
