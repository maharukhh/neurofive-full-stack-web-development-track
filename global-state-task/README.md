# Global State, Data Fetching Patterns & UI Polish

A small product-catalog demo built to show a **global state pattern in vanilla JS**, a real data-fetching flow with **skeleton loaders**, and **empty states** — no framework, since Weeks 1–2 of this track were plain HTML/CSS/JS.

## Why a custom store instead of Context API / Redux?

Context API, Redux, Zustand, Pinia, and Vuex all solve the same problem: *a single source of truth that any component can read from or write to without passing data down through props*. Since this track uses plain JS rather than React/Vue, `public/store.js` implements the same pattern from scratch — a tiny pub/sub container:

```js
store.getState()        // read current state
store.setState(patch)   // update state (merges, like React's setState)
store.subscribe(fn)     // fn re-runs on every state change
```

Every component subscribes to the store once and re-renders itself whenever relevant state changes — nobody passes `cart` or `wishlist` down through function arguments.

## The 2 shared-state features

| Feature | Where it's read | Where it's written |
|---|---|---|
| **Cart** | `Navbar` (badge count), `CartPanel` (item list) | `ProductGrid` ("Add to Cart" button), `CartPanel` ("Remove") |
| **Wishlist** | `Navbar` (badge count), `WishlistPanel` (item list) | `ProductGrid` (heart toggle), `WishlistPanel` ("Remove") |

`Navbar`, `ProductGrid`, `CartPanel`, and `WishlistPanel` are sibling components with no parent-child relationship — they only communicate through `store.js`. Without shared state, cart/wishlist data would have to be lifted to a common ancestor and drilled down through every layer in between.

## Data fetching + loading states

`api.js` fetches from a mock Express backend (`/api/products`, `/api/categories`) with an artificial random delay (500ms–1.4s) so the loading state is actually visible:

- **Skeleton loaders**: shimmering placeholder cards for the product grid, and a skeleton pill for the category filter — never a blank white screen
- **Error state**: if a fetch fails, a retry button is shown instead of a silent failure
- **Empty state**: the "toys" category deliberately has zero products, so switching to it demonstrates a real "no data" UI (distinct from a loading or error state). Cart and Wishlist panels also show their own empty states when nothing has been added yet

## Project Structure

```
global-state-task/
├── package.json
├── server.js                    # mock API with artificial latency
└── public/
    ├── index.html
    ├── style.css
    ├── store.js                  # global state (pub/sub store)
    ├── api.js                     # fetch functions -> write to store
    ├── app.js                      # entry point, initial render
    └── components/
        ├── navbar.js                # reads cart/wishlist counts
        ├── categoryFilter.js         # writes activeCategory, triggers refetch
        ├── productGrid.js             # fetches + renders products, writes cart/wishlist
        ├── cartPanel.js                # reads/writes cart
        └── wishlistPanel.js             # reads/writes wishlist
```

## Getting Started

```bash
npm install
node server.js
```

Open `http://localhost:3001` in your browser.

## Try it out

- Add a product to the cart from the grid → watch the navbar badge update instantly (no page reload, no prop passing)
- Switch the category dropdown to **Toys** → see the empty state
- Reload the page → see the skeleton loaders before data appears
- Open the cart/wishlist panel while empty → see the empty state there too
