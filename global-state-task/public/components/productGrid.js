/**
 * ProductGrid — fetches product data and renders it.
 *
 * "Add to Cart" / "Add to Wishlist" write straight to the shared store.
 * Navbar and the side panels pick up the change instantly through their
 * own subscriptions — no callback props passed down, no lifting state up.
 */

function currency(paisa) {
  return "Rs. " + paisa.toLocaleString("en-PK");
}

function renderProductGrid() {
  const el = document.getElementById("productGrid");
  const { products, productsLoading, productsError, cart, wishlist } = store.getState();

  // ---------- Loading state: skeleton cards, never a blank screen ----------
  if (productsLoading) {
    el.innerHTML = `
      <div class="grid">
        ${Array.from({ length: 6 })
          .map(
            () => `
          <div class="card skeleton-card">
            <div class="skeleton skeleton-thumb"></div>
            <div class="skeleton skeleton-line" style="width: 70%"></div>
            <div class="skeleton skeleton-line" style="width: 40%"></div>
            <div class="skeleton skeleton-btn"></div>
          </div>`
          )
          .join("")}
      </div>
    `;
    return;
  }

  // ---------- Error state ----------
  if (productsError) {
    el.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">⚠️</div>
        <p class="empty-title">${productsError}</p>
        <button class="nav-btn primary" id="retryBtn">Retry</button>
      </div>
    `;
    document.getElementById("retryBtn").addEventListener("click", () => {
      fetchProducts(store.getState().activeCategory);
    });
    return;
  }

  // ---------- Empty state: zero data, not just an empty list ----------
  if (products.length === 0) {
    el.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <p class="empty-title">No products in this category yet</p>
        <p class="empty-subtitle">Try a different category, or check back later.</p>
      </div>
    `;
    return;
  }

  // ---------- Normal state ----------
  el.innerHTML = `
    <div class="grid">
      ${products
        .map((p) => {
          const inCart = cart.some((item) => item.id === p.id);
          const inWishlist = wishlist.some((item) => item.id === p.id);
          return `
          <div class="card" data-id="${p.id}">
            <div class="thumb">${p.emoji}</div>
            <p class="product-name">${p.name}</p>
            <p class="product-price">${currency(p.price)}</p>
            <div class="card-actions">
              <button class="icon-btn wishlist-toggle ${inWishlist ? "active" : ""}" data-id="${p.id}" title="Add to wishlist">
                ${inWishlist ? "♥" : "♡"}
              </button>
              <button class="nav-btn primary cart-toggle" data-id="${p.id}" ${inCart ? "disabled" : ""}>
                ${inCart ? "In Cart" : "Add to Cart"}
              </button>
            </div>
          </div>`;
        })
        .join("")}
    </div>
  `;

  el.querySelectorAll(".cart-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const product = store.getState().products.find((p) => p.id === id);
      store.setState((s) => ({ cart: [...s.cart, product] }));
      showToast(`${product.name} added to cart`, "success");
    });
  });

  el.querySelectorAll(".wishlist-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const product = store.getState().products.find((p) => p.id === id);
      const { wishlist } = store.getState();
      const exists = wishlist.some((item) => item.id === id);
      store.setState((s) => ({
        wishlist: exists ? s.wishlist.filter((item) => item.id !== id) : [...s.wishlist, product],
      }));
    });
  });
}

store.subscribe(renderProductGrid);
