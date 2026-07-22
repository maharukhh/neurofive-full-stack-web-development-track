/**
 * CategoryFilter — an independent component. It writes `activeCategory`
 * to the store and triggers a refetch; it doesn't need to know anything
 * about ProductGrid, which simply reacts to the store changing.
 */

function renderCategoryFilter() {
  const el = document.getElementById("categoryFilter");
  const { categories, categoriesLoading, activeCategory } = store.getState();

  if (categoriesLoading) {
    el.innerHTML = `<div class="skeleton skeleton-pill"></div>`;
    return;
  }

  el.innerHTML = `
    <label for="categorySelect" class="filter-label">Category</label>
    <select id="categorySelect">
      ${categories
        .map(
          (c) =>
            `<option value="${c}" ${c === activeCategory ? "selected" : ""}>${
              c.charAt(0).toUpperCase() + c.slice(1)
            }</option>`
        )
        .join("")}
    </select>
  `;

  document.getElementById("categorySelect").addEventListener("change", (e) => {
    const category = e.target.value;
    store.setState({ activeCategory: category });
    fetchProducts(category);
  });
}

store.subscribe(renderCategoryFilter);
