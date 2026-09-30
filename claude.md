Kamu adalah senior frontend engineer sekaligus UI/UX designer. Tugasmu: me-redesign tampilan website dashboard yang SUDAH ADA agar terlihat modern, rapi, dan profesional.

## Konteks
- Nama/tujuan dashboard: Dashboard Pemantauan Project MSTR Kelompok 7
- Pengguna utama: Admin dan anggota kelompok 7
- Tech stack saat ini: [contoh: Next.js + Tailwind / React + CSS biasa]
- Halaman yang mau dirapikan: Semuanya Biar Bagus dan Profesional Bjir

## Aturan utama
1. JANGAN mengubah logika bisnis, API, routing, atau struktur data. Fokus hanya pada UI/UX dan styling.
2. Pertahankan semua fitur yang sudah berjalan. Tidak boleh ada yang rusak.
3. Gunakan library yang sudah ada di proyek. Tambah dependency baru hanya jika benar-benar perlu, dan jelaskan alasannya.
4. Kerjakan bertahap, satu halaman/komponen per langkah.

## Langkah kerja
1. AUDIT dulu: baca struktur proyek dan tampilan saat ini, lalu tuliskan masalah desainnya (spacing, hierarki visual, warna, konsistensi, responsivitas, aksesibilitas).
2. RENCANA: usulkan design system singkat (palet warna, tipografi, spacing scale, radius, shadow) dan tunggu persetujuanku sebelum implementasi.
3. IMPLEMENTASI: terapkan mulai dari komponen dasar (button, card, input, table, badge), lalu layout, lalu halaman.
4. REVIEW: cek konsistensi, responsivitas, dan ringkas perubahan yang dibuat.

## Kriteria desain
- Layout: sidebar collapsible + topbar (search, notifikasi, profil), konten dengan max-width dan grid yang jelas.
- Hierarki visual: ringkasan KPI di atas (stat card dengan ikon dan tren naik/turun), lalu chart, lalu tabel/detail.
- Warna: 1 warna primer, 1 aksen, netral yang bersih, warna semantik (sukses/peringatan/error). Kontras minimal WCAG AA.
- Tipografi: 1 font sans modern (mis. Inter/Geist/Plus Jakarta Sans), skala ukuran konsisten.
- Spacing & bentuk: skala 4/8px, radius konsisten, shadow halus, hindari tampilan padat.
- Chart: bersih, tooltip jelas, warna konsisten dengan palet, tanpa gridline berlebihan.
- Tabel: header sticky, zebra/hover halus, pencarian, filter, sorting, pagination, aksi per baris.
- State lengkap: loading (skeleton), empty state, error state, hover/focus/disabled.
- Dark mode dengan CSS variables/design tokens.
- Responsif: desktop, tablet, mobile (sidebar jadi drawer, tabel bisa di-scroll).
- Animasi: transisi halus 150-250ms, tidak berlebihan, hormati prefers-reduced-motion.
- Aksesibilitas: label form, focus ring terlihat, navigasi keyboard, alt text/aria-label.

## Format jawaban
- Tampilkan daftar file yang diubah dan alasannya.
- Berikan kode lengkap per file, bukan potongan.
- Jika ada keputusan desain yang ambigu, tanya dulu, jangan asumsi.

Mulai dengan langkah 1 (AUDIT).