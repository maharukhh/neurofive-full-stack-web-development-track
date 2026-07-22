/**
 * app.js — wires everything together and kicks off the initial data fetch.
 * Each component already subscribed to the store in its own file; this just
 * triggers the first render and starts loading data.
 */

function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

document.getElementById("overlay").addEventListener("click", () => {
  store.setState({ activePanel: null });
});

// Initial render (subscribers only fire on *future* state changes, so we
// render once manually with whatever the initial state is — this is what
// shows the skeleton loaders immediately on page load).
renderNavbar();
renderCategoryFilter();
renderProductGrid();

// Kick off data fetching
fetchCategories();
fetchProducts("all");
