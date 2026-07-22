/**
 * WishlistPanel — same pattern as CartPanel: reads `wishlist` straight from
 * the shared store. ProductGrid's heart-toggle button is the only other
 * place that touches this state, and neither component knows the other
 * exists.
 */

function renderWishlistPanel() {
  const panel = document.getElementById("sidePanel");
  const overlay = document.getElementById("overlay");
  const { activePanel, wishlist } = store.getState();

  if (activePanel !== "wishlist") return;

  overlay.classList.add("visible");
  panel.classList.add("visible");

  panel.innerHTML = `
    <div class="panel-header">
      <h2>Your Wishlist</h2>
      <button class="close-btn" id="closePanel">✕</button>
    </div>
    <div class="panel-body">
      ${
        wishlist.length === 0
          ? `<div class="empty-state small">
               <div class="empty-icon">♡</div>
               <p class="empty-title">Your wishlist is empty</p>
               <p class="empty-subtitle">Tap the heart on any product to save it here.</p>
             </div>`
          : wishlist
              .map(
                (item) => `
              <div class="panel-item">
                <span class="panel-item-emoji">${item.emoji}</span>
                <div class="panel-item-info">
                  <p>${item.name}</p>
                  <span>${currency(item.price)}</span>
                </div>
                <button class="remove-btn" data-id="${item.id}">Remove</button>
              </div>`
              )
              .join("")
      }
    </div>
  `;

  document.getElementById("closePanel").addEventListener("click", closePanel);
  panel.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      store.setState((s) => ({ wishlist: s.wishlist.filter((item) => item.id !== id) }));
    });
  });
}

store.subscribe((state) => {
  if (state.activePanel === "wishlist") {
    renderWishlistPanel();
  }
});
