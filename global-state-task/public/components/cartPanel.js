/**
 * CartPanel — a slide-in panel. It reads `cart` from the same store that
 * ProductGrid writes to. No parent component passes cart data down to it.
 */

function renderCartPanel() {
  const panel = document.getElementById("sidePanel");
  const overlay = document.getElementById("overlay");
  const { activePanel, cart } = store.getState();

  if (activePanel !== "cart") return; // wishlistPanel.js handles its own case

  overlay.classList.add("visible");
  panel.classList.add("visible");

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  panel.innerHTML = `
    <div class="panel-header">
      <h2>Your Cart</h2>
      <button class="close-btn" id="closePanel">✕</button>
    </div>
    <div class="panel-body">
      ${
        cart.length === 0
          ? `<div class="empty-state small">
               <div class="empty-icon">🛒</div>
               <p class="empty-title">Your cart is empty</p>
               <p class="empty-subtitle">Add something from the catalog to see it here.</p>
             </div>`
          : cart
              .map(
                (item, index) => `
              <div class="panel-item">
                <span class="panel-item-emoji">${item.emoji}</span>
                <div class="panel-item-info">
                  <p>${item.name}</p>
                  <span>${currency(item.price)}</span>
                </div>
                <button class="remove-btn" data-index="${index}">Remove</button>
              </div>`
              )
              .join("")
      }
    </div>
    ${
      cart.length > 0
        ? `<div class="panel-footer"><span>Total</span><strong>${currency(total)}</strong></div>`
        : ""
    }
  `;

  document.getElementById("closePanel").addEventListener("click", closePanel);
  panel.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = Number(btn.dataset.index);
      store.setState((s) => ({ cart: s.cart.filter((_, i) => i !== index) }));
    });
  });
}

function closePanel() {
  store.setState({ activePanel: null });
}

store.subscribe((state) => {
  if (state.activePanel === "cart") {
    renderCartPanel();
  } else if (state.activePanel === null) {
    document.getElementById("overlay").classList.remove("visible");
    document.getElementById("sidePanel").classList.remove("visible");
  }
});
