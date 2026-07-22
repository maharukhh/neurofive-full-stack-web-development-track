const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, "public")));

// ---------- Mock product database ----------
const PRODUCTS = [
  { id: 1, name: "Wireless Mouse", category: "electronics", price: 1899, emoji: "🖱️" },
  { id: 2, name: "Mechanical Keyboard", category: "electronics", price: 6499, emoji: "⌨️" },
  { id: 3, name: "USB-C Hub", category: "electronics", price: 2299, emoji: "🔌" },
  { id: 4, name: "Denim Jacket", category: "clothing", price: 3499, emoji: "🧥" },
  { id: 5, name: "Running Shoes", category: "clothing", price: 4999, emoji: "👟" },
  { id: 6, name: "Graphic Tee", category: "clothing", price: 1299, emoji: "👕" },
  { id: 7, name: "Clean Code", category: "books", price: 1599, emoji: "📘" },
  { id: 8, name: "Atomic Habits", category: "books", price: 1099, emoji: "📗" },
  { id: 9, name: "Deep Work", category: "books", price: 1249, emoji: "📙" },
];

const CATEGORIES = ["all", "electronics", "clothing", "books", "toys"];
// Note: "toys" deliberately has zero products — used to demonstrate the empty state.

function randomDelay(min = 500, max = 1400) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// GET /api/products?category=electronics
app.get("/api/products", (req, res) => {
  const { category } = req.query;

  setTimeout(() => {
    let results = PRODUCTS;
    if (category && category !== "all") {
      results = PRODUCTS.filter((p) => p.category === category);
    }
    res.json({ success: true, products: results });
  }, randomDelay());
});

app.get("/api/categories", (req, res) => {
  setTimeout(() => {
    res.json({ success: true, categories: CATEGORIES });
  }, randomDelay(300, 600));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
