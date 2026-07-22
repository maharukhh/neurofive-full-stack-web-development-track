/**
 * api.js — data-fetching functions. Each one follows the same pattern:
 * set a loading flag -> fetch -> write the result (or error) into the store.
 * Any component that subscribes to the store re-renders automatically;
 * nothing needs to be passed down as props.
 */

async function fetchProducts(category = "all") {
  store.setState({ productsLoading: true, productsError: null });

  try {
    const res = await fetch(`/api/products?category=${encodeURIComponent(category)}`);
    if (!res.ok) throw new Error("Request failed");
    const data = await res.json();
    store.setState({ products: data.products, productsLoading: false });
  } catch (err) {
    store.setState({
      productsError: "Couldn't load products. Please try again.",
      productsLoading: false,
      products: [],
    });
  }
}

async function fetchCategories() {
  store.setState({ categoriesLoading: true });

  try {
    const res = await fetch("/api/categories");
    const data = await res.json();
    store.setState({ categories: data.categories, categoriesLoading: false });
  } catch (err) {
    store.setState({ categoriesLoading: false, categories: ["all"] });
  }
}
