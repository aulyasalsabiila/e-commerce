/* ══════════════════════════════
   PRODUCT DATA
══════════════════════════════ */
const products = [
  {
    id:1, category:'wanita', brand:'Noir Collection',
    name:'Blazer Struktural Onyx',
    price:1250000, oldPrice:null, badge:'Baru',
    img:'blazer.jpg',
    sizes:['XS','S','M','L'], stock:8,
    rating:4.8, reviewCount:24,
    desc:'Blazer premium dengan siluet struktural yang tegas. Dibuat dari campuran wool berkualitas tinggi dengan detail finishing tangan.',
    reviews:[
      {author:'Dian S.', date:'12 Nov 2024', rating:5, text:'Kualitas sangat premium, ukurannya pas dan bahan nyaman dipakai seharian.'},
      {author:'Rara M.', date:'5 Okt 2024', rating:5, text:'Tampilannya sangat elegan, cocok untuk acara formal maupun semi-formal.'},
    ]
  },
  {
    id:2, category:'wanita', brand:'Noir Essentials',
    name:'Dress Midi Velvet Noir',
    price:1680000, oldPrice:null, badge:'Eksklusif',
    img:'https://images.unsplash.com/photo-1550639525-c97d455acf70?w=600&q=80',
    sizes:['XS','S','M','L','XL'], stock:3,
    rating:4.9, reviewCount:18,
    desc:'Dress midi dari bahan velvet premium dengan cutting yang mempertegas siluet tubuh. Sempurna untuk malam istimewa.',
    reviews:[
      {author:'Putri L.', date:'20 Nov 2024', rating:5, text:'Bahannya mewah sekali, dapat banyak pujian waktu pakai ini.'},
    ]
  },
  {
    id:3, category:'wanita', brand:'Noir Basics',
    name:'Palazzo Wide Leg Linen',
    price:675000, oldPrice:null, badge:'Baru',
    img:'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80',
    sizes:['XS','S','M','L','XL'], stock:15,
    rating:4.5, reviewCount:42,
    desc:'Celana palazzo wide leg dari linen premium. Ringan, breathable, dan sangat nyaman untuk aktivitas harian.',
    reviews:[
      {author:'Sari W.', date:'8 Nov 2024', rating:4, text:'Linen-nya adem banget, tapi perlu disetrika setelah cuci.'},
    ]
  },
  {
    id:4, category:'aksesori', brand:'Noir Atelier',
    name:'Tas Kulit Structured Mini',
    price:2400000, oldPrice:null, badge:'Eksklusif',
    img:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    sizes:[], stock:5,
    rating:4.9, reviewCount:31,
    desc:'Tas structured mini dari genuine leather pilihan. Hardware gold-plated, magnetic closure, tali adjustable.',
    reviews:[
      {author:'Mega D.', date:'1 Des 2024', rating:5, text:'Kulit asli, jahitannya rapi banget, worth every penny!'},
      {author:'Tania H.', date:'15 Nov 2024', rating:5, text:'Ukurannya pas buat daily use, muat essentials semua.'},
    ]
  },
  {
    id:5, category:'aksesori', brand:'Noir Jewel',
    name:'Kalung Rantai Gold Slim',
    price:480000, oldPrice:680000, badge:'Sale',
    img:'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
    sizes:[], stock:20,
    rating:4.6, reviewCount:55,
    desc:'Kalung rantai tipis dari stainless steel berlapis 18k gold. Anti-karat, hypoallergenic, panjang adjustable.',
    reviews:[
      {author:'Nisa K.', date:'3 Des 2024', rating:5, text:'Tidak hitam walau dipakai terus, cantik dan elegan.'},
    ]
  },
  {
    id:6, category:'aksesori', brand:'Noir Atelier',
    name:'Clutch Velvet Midnight',
    price:890000, oldPrice:null, badge:'Baru',
    img:'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80',
    sizes:[], stock:0,
    rating:4.7, reviewCount:12,
    desc:'Clutch dari bahan velvet midnight blue dengan magnetic snap closure dan chain strap yang bisa dilepas.',
    reviews:[
      {author:'Citra A.', date:'28 Nov 2024', rating:5, text:'Warnanya cantik banget, bahannya lembut dan mewah.'},
    ]
  },
];

const fmt = p => 'Rp ' + p.toLocaleString('id-ID');
const SHIPPING_THRESHOLD = 500000;
const SHIPPING_COST = 45000;

/* ══════════════════════════════
   STATE
══════════════════════════════ */
let cart = [];
let wishlist = new Set();
let activeFilter = 'semua';
let activeSort   = 'default';

/* ══════════════════════════════
   RENDER STARS
══════════════════════════════ */
function renderStars(rating) {
  let html = '<div class="stars">';
  for (let i = 1; i <= 5; i++) {
    html += `<span class="star${i > rating ? ' empty' : ''}">★</span>`;
  }
  return html + '</div>';
}

/* ══════════════════════════════
   RENDER STOCK
══════════════════════════════ */
function renderStock(stock) {
  if (stock === 0) return '';
  const pct = Math.min(100, (stock / 20) * 100);
  const col  = pct > 50 ? '#8b5e1a' : pct > 20 ? '#c0392b' : '#c0392b';
  const txt  = stock === 0 ? 'Habis' : stock <= 5 ? `Sisa ${stock} lagi!` : 'Tersedia';
  const tcol = stock <= 5 && stock > 0 ? '#c0392b' : 'var(--muted)';
  return `<div class="stock-indicator">
    <div class="stock-bar"><div class="score-fill" style="width:${pct}%;background:${col};height:100%;border-radius:2px"></div></div>
    <span class="stock-text" style="color:${tcol}">${txt}</span>
  </div>`;
}

/* ══════════════════════════════
   RENDER PRODUCTS
══════════════════════════════ */
function getFilteredSorted() {
  let list = activeFilter === 'semua' ? [...products]
    : activeFilter === 'sale' ? products.filter(p => p.badge === 'Sale')
    : products.filter(p => p.category === activeFilter);

  switch(activeSort) {
    case 'price-asc':  list.sort((a,b) => a.price - b.price); break;
    case 'price-desc': list.sort((a,b) => b.price - a.price); break;
    case 'rating':     list.sort((a,b) => b.rating - a.rating); break;
    case 'name':       list.sort((a,b) => a.name.localeCompare(b.name)); break;
  }
  return list;
}

function renderProducts() {
  const g = document.getElementById('productsGrid');
  const list = getFilteredSorted();
  document.getElementById('productsCount').textContent = list.length + ' produk';

  if (!list.length) {
    g.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--muted);font-weight:600">Tidak ada produk ditemukan.</p>';
    return;
  }

  g.innerHTML = list.map(p => {
    const soldOut = p.stock === 0;
    const wishlisted = wishlist.has(p.id);
    const badgeClass = p.badge === 'Sale' ? 'product-badge sale-badge' : 'product-badge';
    return `
    <div class="product-card" data-id="${p.id}">
      <div class="product-img-wrap${soldOut ? ' sold-out' : ''}">
        <img src="${p.img}" alt="${p.name}" class="product-img" loading="lazy">
        ${p.badge ? `<div class="${badgeClass}">${p.badge}</div>` : ''}
        <button class="wishlist-btn${wishlisted ? ' active' : ''}" title="Wishlist" onclick="toggleWishlist(${p.id}, this)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="${wishlisted ? 'var(--gold)' : 'none'}" stroke="${wishlisted ? 'var(--gold)' : 'currentColor'}" stroke-width="2.2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        <div class="product-actions">
          <button class="add-cart-btn" onclick="addToCart(${p.id})" ${soldOut ? 'disabled' : ''}>${soldOut ? 'Habis Terjual' : '+ Tambah ke Keranjang'}</button>
          <button class="quick-view-btn" onclick="openModal(${p.id})">⊕ Quick View</button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-brand">${p.brand}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-price-wrap">
          <span class="product-price">${fmt(p.price)}</span>
          ${p.oldPrice ? `<span class="product-price-old">${fmt(p.oldPrice)}</span>` : ''}
        </div>
        <div class="product-rating">
          ${renderStars(Math.round(p.rating))}
          <span class="rating-count">${p.rating} (${p.reviewCount})</span>
        </div>
        ${p.sizes.length ? `<div class="product-sizes">${p.sizes.map(s => `<div class="size-dot">${s}</div>`).join('')}</div>` : ''}
        ${renderStock(p.stock)}
      </div>
    </div>`;
  }).join('');

  // re-attach cursor events
  attachCursorEvents();
}

function filterProducts(btn, f) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeFilter = f;
  renderProducts();
}

function applySortFilter() {
  activeSort = document.getElementById('sortSelect').value;
  renderProducts();
}

/* ══════════════════════════════
   WISHLIST
══════════════════════════════ */
function toggleWishlist(id, btn) {
  const p = products.find(x => x.id === id);
  if (wishlist.has(id)) {
    wishlist.delete(id);
    showToast(`${p.name} dihapus dari wishlist`);
  } else {
    wishlist.add(id);
    showToast(`${p.name} ditambahkan ke wishlist ♥`);
  }
  renderProducts();
}

/* ══════════════════════════════
   CART
══════════════════════════════ */
function addToCart(id, size = null, qty = 1) {
  const p = products.find(x => x.id === id);
  if (!p || p.stock === 0) return;
  const key = id + (size ? '-' + size : '');
  const ex  = cart.find(i => i.key === key);
  if (ex) ex.qty = Math.min(ex.qty + qty, p.stock);
  else cart.push({ ...p, key, selectedSize: size, qty });
  updateCart();
  const cartCount = document.getElementById('cartCount');
  cartCount.classList.remove('bump');
  void cartCount.offsetWidth;
  cartCount.classList.add('bump');
  showToast(`${p.name}${size ? ` (${size})` : ''} ditambahkan ke keranjang ✓`);
}

function changeQty(key, delta) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  const p = products.find(x => x.id === item.id);
  item.qty = Math.max(1, Math.min(item.qty + delta, p?.stock || 99));
  updateCart();
}

function removeFromCart(key) {
  cart = cart.filter(i => i.key !== key);
  updateCart();
}

function updateCart() {
  const count = cart.reduce((a, i) => a + i.qty, 0);
  const subtotal = cart.reduce((a, i) => a + i.price * i.qty, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  document.getElementById('cartCount').textContent = count;
  document.getElementById('cartSubtotal').textContent = fmt(subtotal);
  document.getElementById('cartShipping').textContent = subtotal === 0 ? '—' : shipping === 0 ? 'GRATIS ✓' : fmt(shipping);
  document.getElementById('cartTotal').textContent = fmt(total);

  const ci = document.getElementById('cartItems');
  if (!cart.length) {
    ci.innerHTML = '<p class="cart-empty">Keranjang Anda kosong</p>';
    return;
  }
  ci.innerHTML = cart.map(i => `
    <div class="cart-item">
      <img src="${i.img}" class="cart-item-img" alt="${i.name}">
      <div class="cart-item-info">
        <div class="cart-item-brand">${i.brand}</div>
        <div class="cart-item-name">${i.name}</div>
        ${i.selectedSize ? `<div class="cart-item-size">Ukuran: ${i.selectedSize}</div>` : ''}
        <div class="cart-item-bottom">
          <span class="cart-item-price">${fmt(i.price * i.qty)}</span>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty('${i.key}',-1)">−</button>
            <span class="qty-num">${i.qty}</span>
            <button class="qty-btn" onclick="changeQty('${i.key}',1)">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart('${i.key}')">Hapus</button>
      </div>
    </div>`).join('');
}

function toggleCart() {
  const sb = document.getElementById('cartSidebar');
  const ov = document.getElementById('sidebarOverlay');
  const isOpen = sb.classList.toggle('open');
  ov.classList.toggle('active', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function handleCheckout() {
  if (!cart.length) { showToast('Keranjang Anda masih kosong'); return; }
  showToast('Memproses pesanan Anda...');
  setTimeout(() => { toggleCart(); showToast('Terima kasih! Pesanan sedang diproses ✓'); }, 800);
}

/* ══════════════════════════════
   QUICK VIEW MODAL
══════════════════════════════ */
let modalQty = 1;
let modalSelectedSize = null;
let modalProductId = null;

function openModal(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  modalProductId = id;
  modalQty = 1;
  modalSelectedSize = p.sizes.length ? null : 'N/A';

  document.getElementById('modalImg').src = p.img;
  document.getElementById('modalImg').alt = p.name;

  const soldOut = p.stock === 0;
  const body = document.getElementById('modalBody');
  body.innerHTML = `
    <div class="modal-brand">${p.brand}</div>
    <div class="modal-name">${p.name}</div>
    <div class="modal-price-wrap">
      <span class="modal-price">${fmt(p.price)}</span>
      ${p.oldPrice ? `<span class="modal-price-old">${fmt(p.oldPrice)}</span>` : ''}
    </div>
    <div class="product-rating">
      ${renderStars(Math.round(p.rating))}
      <span class="rating-count">${p.rating} · ${p.reviewCount} ulasan</span>
    </div>
    <div class="modal-desc">${p.desc}</div>
    ${p.sizes.length ? `
      <div>
        <div class="modal-section-label">Pilih Ukuran</div>
        <div class="size-grid" id="modalSizeGrid">
          ${p.sizes.map(s => `<button class="size-btn" onclick="selectModalSize('${s}', this)">${s}</button>`).join('')}
        </div>
      </div>
    ` : ''}
    <div>
      <div class="modal-section-label">Jumlah</div>
      <div class="qty-selector">
        <button class="qty-btn" onclick="changeModalQty(-1)">−</button>
        <span class="qty-num" id="modalQtyNum">1</span>
        <button class="qty-btn" onclick="changeModalQty(1)">+</button>
        ${p.stock > 0 && p.stock <= 10 ? `<span style="font-size:.68rem;color:#c0392b;margin-left:.5rem;font-weight:700">Sisa ${p.stock}</span>` : ''}
      </div>
    </div>
    <div class="modal-actions">
      <button class="modal-add-btn" id="modalAddBtn" onclick="modalAddToCart()" ${soldOut ? 'disabled' : ''}>
        ${soldOut ? 'Habis Terjual' : '+ Tambah ke Keranjang'}
      </button>
    </div>
    <div class="modal-share">
      <span class="share-label">Bagikan</span>
      <button class="share-btn" onclick="shareProduct('instagram','${p.name}')" title="Instagram">IG</button>
      <button class="share-btn" onclick="shareProduct('whatsapp','${p.name}')" title="WhatsApp">WA</button>
      <button class="share-btn" onclick="shareProduct('copy','${p.name}')" title="Salin link">🔗</button>
    </div>
    ${p.reviews.length ? `
      <div>
        <div class="modal-section-label">Ulasan (${p.reviewCount})</div>
        <div class="reviews-list">
          ${p.reviews.map(r => `
            <div class="review-item">
              <div class="review-stars">${renderStars(r.rating)}</div>
              <div class="review-header">
                <span class="review-author">${r.author}</span>
                <span class="review-date">${r.date}</span>
              </div>
              <div class="review-text">${r.text}</div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;

  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function selectModalSize(size, btn) {
  modalSelectedSize = size;
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  updateModalAddBtn();
}

function changeModalQty(delta) {
  const p = products.find(x => x.id === modalProductId);
  const max = p?.stock || 99;
  modalQty = Math.max(1, Math.min(modalQty + delta, max));
  document.getElementById('modalQtyNum').textContent = modalQty;
}

function updateModalAddBtn() {
  const p = products.find(x => x.id === modalProductId);
  const btn = document.getElementById('modalAddBtn');
  if (!btn || !p) return;
  const needsSize = p.sizes.length > 0 && !modalSelectedSize;
  btn.disabled = p.stock === 0 || needsSize;
  if (needsSize) btn.textContent = 'Pilih ukuran terlebih dahulu';
  else if (p.stock === 0) btn.textContent = 'Habis Terjual';
  else btn.textContent = '+ Tambah ke Keranjang';
}

function modalAddToCart() {
  const p = products.find(x => x.id === modalProductId);
  if (!p) return;
  if (p.sizes.length > 0 && !modalSelectedSize) {
    showToast('Silakan pilih ukuran terlebih dahulu'); return;
  }
  addToCart(p.id, modalSelectedSize === 'N/A' ? null : modalSelectedSize, modalQty);
  closeModal();
  setTimeout(() => toggleCart(), 300);
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function handleModalOverlayClick(e) {
  if (e.target === document.getElementById('modalOverlay')) closeModal();
}

/* ══════════════════════════════
   SHARE
══════════════════════════════ */
function shareProduct(platform, name) {
  const url = window.location.href;
  const text = `Lihat produk ini dari NOIR: ${name}`;
  if (platform === 'whatsapp') {
    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
  } else if (platform === 'instagram') {
    navigator.clipboard.writeText(url).then(() => showToast('Link disalin! Tempel di Instagram Story ✓'));
  } else {
    navigator.clipboard.writeText(url).then(() => showToast('Link produk berhasil disalin ✓'));
  }
}

/* ══════════════════════════════
   SEARCH
══════════════════════════════ */
function openSearch() {
  document.getElementById('searchBar').classList.add('open');
  setTimeout(() => document.getElementById('searchInput').focus(), 350);
  document.body.style.overflow = 'hidden';
}

function closeSearch() {
  document.getElementById('searchBar').classList.remove('open');
  document.getElementById('searchInput').value = '';
  document.getElementById('searchResults').innerHTML = '';
  document.getElementById('searchResults').classList.remove('has-results');
  document.body.style.overflow = '';
}

document.getElementById('searchInput').addEventListener('input', function() {
  const q = this.value.trim().toLowerCase();
  const res = document.getElementById('searchResults');
  if (!q) { res.innerHTML=''; res.classList.remove('has-results'); return; }

  const matches = products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );

  if (!matches.length) {
    res.innerHTML = `<div class="search-no-result">Produk "<strong>${q}</strong>" tidak ditemukan</div>`;
    res.classList.add('has-results');
    return;
  }

  res.innerHTML = matches.map(p => `
    <div class="search-result-item" onclick="closeSearch();openModal(${p.id})">
      <img class="sr-img" src="${p.img}" alt="${p.name}">
      <div class="sr-info">
        <div class="sr-brand">${p.brand}</div>
        <div class="sr-name">${p.name}</div>
        <div class="sr-price">${fmt(p.price)}</div>
      </div>
    </div>`).join('');
  res.classList.add('has-results');
});

/* ══════════════════════════════
   SCROLL TO TOP
══════════════════════════════ */
window.addEventListener('scroll', () => {
  const btn = document.getElementById('scrollTop');
  btn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

/* ══════════════════════════════
   NEWSLETTER
══════════════════════════════ */
function handleNewsletter(btn) {
  const input = btn.previousElementSibling;
  const email = input.value.trim();
  if (!email || !email.includes('@')) {
    showToast('Masukkan alamat email yang valid');
    input.focus(); return;
  }
  input.value = '';
  showToast('Terima kasih! Anda berhasil mendaftar newsletter ✓');
}

/* ══════════════════════════════
   CURSOR
══════════════════════════════ */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx=0, my=0, rx=0, ry=0;
document.addEventListener('mousemove', e => {
  mx=e.clientX; my=e.clientY;
  cursor.style.left=mx+'px'; cursor.style.top=my+'px';
});
(function tick(){
  rx+=(mx-rx)*.12; ry+=(my-ry)*.12;
  ring.style.left=rx+'px'; ring.style.top=ry+'px';
  requestAnimationFrame(tick);
})();

function attachCursorEvents() {
  document.querySelectorAll('a,button,.product-card,.cat-card,.size-dot,.sort-select').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ══════════════════════════════
   TOAST
══════════════════════════════ */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}

/* ══════════════════════════════
   KEYBOARD
══════════════════════════════ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeSearch();
    closeModal();
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('active');
    document.body.style.overflow = '';
  }
});

/* ══════════════════════════════
   INIT
══════════════════════════════ */
renderProducts();
attachCursorEvents();