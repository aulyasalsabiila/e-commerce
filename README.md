# NOIR — Luxury Fashion E-Commerce

Platform e-commerce fashion dengan nuansa luxury: katalog produk, filter & sort, quick view, keranjang belanja, wishlist, pencarian, dan newsletter signup.

**Live demo:** https://noir-fashion.netlify.app/

## Fitur

- Filter produk berdasarkan kategori & sale, plus sorting
- Quick View modal — lihat detail produk (ukuran, kuantitas) tanpa pindah halaman
- Keranjang belanja dengan update kuantitas dan checkout
- Wishlist produk
- Pencarian produk
- Share produk ke sosial media
- Newsletter signup
- Custom cursor mengikuti pointer

## Struktur File

```
noir-fashion/
├── index.html   # Struktur halaman
├── style.css    # Seluruh styling
├── script.js    # Logika aplikasi (cart, wishlist, modal, filter, dst.)
└── README.md
```

## Tech Stack

- HTML5, CSS3 (custom properties, tanpa framework)
- JavaScript murni (vanilla, tanpa library)
- Font: Cormorant Garamond, Jost (Google Fonts)

## Menjalankan secara lokal

```bash
python3 -m http.server 8000
```

lalu buka `http://localhost:8000`.

## Catatan

Custom cursor (`cursor:none`) di project ini masih diterapkan langsung di `body` tanpa fallback — kalau JavaScript gagal dimuat atau dibuka di perangkat sentuh, kursor asli bisa hilang. Ini sudah pernah diperbaiki di project portfolio utama; kalau mau, pola pengamanan yang sama bisa diterapkan di sini juga.
