/**
 * store.js — a minimal global state container for vanilla JS.
 *
 * This is the plain-JS equivalent of React's Context API or a Redux/Zustand
 * store: a single source of truth, a way to update it, and a way for any
 * component to subscribe to changes — without passing data through props
 * down a component tree ("prop drilling").
 *
 * Any file can import { store } and call store.getState(), store.setState(),
 * or store.subscribe() without knowing about any other component.
 */

function createStore(initialState) {
  let state = initialState;
  const listeners = new Set();

  function getState() {
    return state;
  }

  function setState(patch) {
    state = { ...state, ...(typeof patch === "function" ? patch(state) : patch) };
    listeners.forEach((listener) => listener(state));
  }

  function subscribe(listener) {
    listeners.add(listener);
    // return an unsubscribe function, same convention as Redux
    return () => listeners.delete(listener);
  }

  return { getState, setState, subscribe };
}

const store = createStore({
  // Data-fetching state (Feature: Product Grid)
  products: [],
  productsLoading: true,
  productsError: null,

  categories: [],
  categoriesLoading: true,

  // Shared state (Feature: Cart) — read/written by ProductGrid AND Navbar AND CartPanel
  cart: [],

  // Shared state (Feature: Wishlist) — read/written by ProductGrid AND Navbar AND WishlistPanel
  wishlist: [],

  // UI state
  activeCategory: "all",
  activePanel: null, // 'cart' | 'wishlist' | null
});

window.store = store;
