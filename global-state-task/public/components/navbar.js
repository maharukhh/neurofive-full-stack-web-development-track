/**
 * Navbar — shows live cart & wishlist counts.
 *
 * Notice this component never receives cart/wishlist as props from a parent.
 * It subscribes to the store directly and re-renders whenever cart or
 * wishlist change anywhere else in the app (e.g. clicking "Add to Cart"
 * inside ProductGrid, a completely separate component/file).
 * This is exactly the prop-drilling problem the task asks us to remove.
 */

function renderNavbar() {
  const el = document.getElementById("navbar");
  const { cart, wishlist } = store.getState();

  el.innerHTML = `
    <div class="nav-inner">
      <span class="brand">🛍️ StateShop</span>
      <div class="nav-actions">
        <button class="nav-btn" id="wishlistBtn">
          ♡ Wishlist <span class="badge">${wishlist.length}</span>
        </button>
        <button class="nav-btn primary" id="cartBtn">
          🛒 Cart <span class="badge">${cart.length}</span>
        </button>
      </div>
    </div>
  `;

  document.getElementById("cartBtn").addEventListener("click", () => {
    store.setState((s) => ({ activePanel: s.activePanel === "cart" ? null : "cart" }));
  });
  document.getElementById("wishlistBtn").addEventListener("click", () => {
    store.setState((s) => ({ activePanel: s.activePanel === "wishlist" ? null : "wishlist" }));
  });
}

store.subscribe(renderNavbar);
