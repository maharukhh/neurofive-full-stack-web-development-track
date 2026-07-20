function Navbar() {
  return `
    <header class="navbar">
      <div class="wrap">
        <a href="#top" class="navbar__logo">Kettle &amp; Bean</a>
        <nav>
          <ul class="navbar__links">
            <li><a href="#menu">Menu</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#visit">Visit</a></li>
          </ul>
        </nav>
        <button class="navbar__toggle" id="navToggle" aria-expanded="false" aria-controls="navMobile">
          menu
        </button>
      </div>
      <nav class="navbar__mobile" id="navMobile">
        <a href="#menu">Menu</a>
        <a href="#about">About</a>
        <a href="#visit">Visit</a>
      </nav>
    </header>
  `;
}

// Attaches the mobile menu toggle behaviour. Called once after
// the navbar markup has been injected into the DOM.
function initNavbar() {
  const toggle = document.getElementById("navToggle");
  const mobile = document.getElementById("navMobile");
  if (!toggle || !mobile) return;

  toggle.addEventListener("click", () => {
    const isOpen = mobile.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.textContent = isOpen ? "close" : "menu";
  });

  mobile.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobile.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "menu";
    });
  });
}
