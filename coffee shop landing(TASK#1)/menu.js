const MENU = [
  { name: "Drip Coffee", desc: "Rotating single-origin, brewed to order.", price: "450rs" },
  { name: "Flat White", desc: "Double ristretto, steamed whole milk.", price: "$450rs" },
  { name: "Pour Over", desc: "Slow-brewed, one cup at a time.", price: "500rs" },
  { name: "Butter Croissant", desc: "Baked fresh each morning.", price: "350rs" },
  { name: "Oat Milk Latte", desc: "House-made oat milk, double shot.", price: "500rs" },
];

function MenuItem(item) {
  return `
    <li class="menu-item">
      <div>
        <p class="menu-item__name">${item.name}</p>
        <p class="menu-item__desc">${item.desc}</p>
      </div>
      <span class="menu-item__price">${item.price}</span>
    </li>
  `;
}

function Menu() {
  const items = MENU.map(MenuItem).join("");

  return `
    <section class="section" id="menu">
      <div class="wrap">
        <span class="eyebrow">Menu</span>
        <h2>A short menu, done well.</h2>
        <ul class="menu-list" style="list-style:none; margin:0; padding:0;">${items}</ul>
      </div>
    </section>
  `;
}
