/* ==========================================================================
   Almhem — shared front-end behaviour
   Plain script (no bundler, no ES modules) so every page can be opened
   directly from disk. Organised as independent, self-guarding sections —
   each one checks for its own DOM hooks before doing anything, so this
   single file is safe to include on every route.
   ========================================================================== */

(function () {
  "use strict";

  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------------
     Image manifest — which resized widths actually exist on disk for each
     source image, so <img srcset> never points at a file that isn't there.
     Keep this in sync with images/ if you add or resize a photo.
     ------------------------------------------------------------------------ */
  var IMAGE_WIDTHS = {
    "hero-fonster": { widths: [480, 720, 960, 1280], full: 1672 },
    "sovrum-linne": { widths: [480, 720, 960, 1280], full: 1536 },
    "blomgren": { widths: [480, 720, 960, 1280], full: 1536 },
    "detaljer-collage": { widths: [480, 720, 960], full: 1223 },
    "verkstad-oljning": { widths: [480, 720], full: 831 },
    "matbord-runt": { widths: [480, 720, 960, 1280], full: 1536 },
    "matbord-langt": { widths: [480, 720, 960, 1280], full: 1536 },
    "soffa-boucle": { widths: [480, 720, 960, 1280], full: 1536 },
    "vardagsrum-soffa": { widths: [480, 720, 960, 1280], full: 1536 },
    "travertin-detalj": { widths: [480, 720, 960, 1280], full: 1536 },
    "lampa-krona": { widths: [480, 720, 960], full: 1144 },
    "belysning-matplats": { widths: [480, 720, 960, 1280], full: 1374 },
    "belysning-pendlar": { widths: [480, 720, 960], full: 1145 },
    "lampa-vagg": { widths: [480, 720, 960], full: 1145 },
    "lampa-bord": { widths: [480, 720, 960], full: 1144 },
    "plad": { widths: [480, 720, 960], full: 1145 }
  };

  function baseNameOf(path) {
    var file = path.split("/").pop().replace(/\.png$/, "");
    return file;
  }

  // ext: "png" (default, used inside the <img> as the universal fallback)
  // or "webp" (used in a <picture>'s <source> — every generated width has a
  // WebP twin, see images/, so this never points at a missing file).
  function buildSrcset(path, ext) {
    ext = ext || "png";
    var base = baseNameOf(path);
    var entry = IMAGE_WIDTHS[base];
    if (!entry) return "";
    var parts = entry.widths.map(function (w) {
      return "images/" + base + "-" + w + "w." + ext + " " + w + "w";
    });
    parts.push("images/" + base + "." + ext + " " + entry.full + "w");
    return parts.join(", ");
  }

  window.Almhem = window.Almhem || {};
  window.Almhem.buildSrcset = buildSrcset;

  /* ------------------------------------------------------------------------
     Product data (placeholder — see README §"Product data … fictional")
     ------------------------------------------------------------------------ */
  var PRODUCTS = [
    { namn: "Krona Sävja", kategori: "Belysning", beskrivning: "Kristallglas i tre våningar, antikmessing. Ø 62 cm.", pris: 34900, ordinarie: 0, tagg: "Signatur", taggSale: false, bilder: ["images/lampa-krona.png", "images/belysning-matplats.png"], kulorer: ["#B9924F", "#E6DCCB"], kulortext: "2 finish", href: "produkt-krona-savja.html" },
    { namn: "Soffa Linnea", kategori: "Soffor", beskrivning: "Tresits i stentvättat linne, stomme i massiv ask.", pris: 19900, ordinarie: 24900, tagg: "−20 %", taggSale: true, bilder: ["images/soffa-boucle.png", "images/vardagsrum-soffa.png", "images/detaljer-collage.png"], kulorer: ["#D9CDBB", "#A8613A", "#5E6B4F"], kulortext: "3 kulörer" },
    { namn: "Matbord Alm", kategori: "Bord", beskrivning: "Rund skiva i oljad alm, räfflad fot. 140 / 160 cm.", pris: 18400, ordinarie: 0, tagg: "Nyhet", taggSale: false, bilder: ["images/matbord-runt.png", "images/matbord-langt.png"], kulorer: ["#C8A882", "#8A6A45"], kulortext: "2 träslag" },
    { namn: "Bäddset Höstlöv", kategori: "Textil", beskrivning: "Tvättat linne, 150×210 cm. Örngott ingår.", pris: 1290, ordinarie: 1590, tagg: "−20 %", taggSale: true, bilder: ["images/sovrum-linne.png", "images/detaljer-collage.png", "images/travertin-detalj.png"], kulorer: ["#E6DCCB", "#C0A98D", "#7F8B6E"], kulortext: "3 kulörer" },
    { namn: "Plankbord Sävja", kategori: "Bord", beskrivning: "Massiv ask för sex till åtta. Oljad yta.", pris: 26700, ordinarie: 0, tagg: "Nyhet", taggSale: false, bilder: ["images/matbord-langt.png", "images/matbord-runt.png"], kulorer: ["#D5BFA0", "#94714B"], kulortext: "2 längder" },
    { namn: "Bordslampa Travertin", kategori: "Belysning", beskrivning: "Cylinder i travertin, skärm i tvättat linne. H 52 cm.", pris: 3900, ordinarie: 0, tagg: "Nyhet", taggSale: false, bilder: ["images/lampa-bord.png", "images/lampa-vagg.png"], kulorer: ["#D9C9AE", "#B9924F"], kulortext: "2 finish" },
    { namn: "Fåtölj Bouclé Ro", kategori: "Soffor", beskrivning: "Låg fåtölj i ullbouclé, stomme i oljad ask.", pris: 12400, ordinarie: 14900, tagg: "−20 %", taggSale: true, bilder: ["images/vardagsrum-soffa.png", "images/soffa-boucle.png", "images/detaljer-collage.png"], kulorer: ["#E3D7C4", "#A8613A", "#5E6B4F"], kulortext: "3 kulörer" },
    { namn: "Pläd Gotland", kategori: "Textil", beskrivning: "Växtfärgad gotlandsull, 130×190 cm.", pris: 2450, ordinarie: 0, tagg: "Nyhet", taggSale: false, bilder: ["images/plad.png", "images/sovrum-linne.png", "images/travertin-detalj.png"], kulorer: ["#C9B79B", "#7F8B6E", "#8A6A45"], kulortext: "3 kulörer" }
  ];

  /* ------------------------------------------------------------------------
     Pure cart math + price formatting live in cart-logic.js (loaded before
     this file) so they're unit-testable under Node — see tests/. Everything
     below is the DOM + localStorage glue around that pure logic.
     ------------------------------------------------------------------------ */
  var Logic = window.AlmhemCartLogic;
  var kr = Logic.formatPrice;
  window.Almhem.kr = kr;

  var CART_KEY = "almhem:cart";

  function loadCart() {
    try {
      var raw = window.localStorage.getItem(CART_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function saveCart(nextCart) {
    cart = nextCart;
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (err) {
      /* storage unavailable (private mode / quota) — cart still works for this page view */
    }
    renderCart();
  }

  var cart = loadCart();

  function addToCart(item) {
    saveCart(Logic.addItem(cart, item));
    openCart();
  }
  function setQty(namn, antal) {
    saveCart(Logic.setQty(cart, namn, antal));
  }
  function removeFromCart(namn) {
    saveCart(Logic.removeItem(cart, namn));
  }
  function getQty(namn) {
    var row = cart.find(function (r) { return r.namn === namn; });
    return row ? row.antal : 0;
  }

  window.Almhem.cart = {
    add: addToCart,
    setQty: setQty,
    remove: removeFromCart,
    count: function () { return Logic.cartCount(cart); },
    total: function () { return Logic.cartTotal(cart); },
    getQty: getQty
  };

  function renderCart() {
    var countEls = document.querySelectorAll("[data-cart-count]");
    countEls.forEach(function (el) { el.textContent = String(Logic.cartCount(cart)); });

    var body = document.getElementById("cartBody");
    if (body) {
      body.innerHTML = "";
      if (cart.length === 0) {
        var empty = document.createElement("p");
        empty.className = "cart-drawer__empty";
        empty.setAttribute("data-cart-empty", "");
        empty.textContent = "Varukorgen är tom. Lägg till något från kollektionen.";
        body.appendChild(empty);
      } else {
        cart.forEach(function (row) {
          body.appendChild(renderCartRow(row));
        });
      }
    }

    var sumEl = document.querySelector("[data-cart-sum]");
    if (sumEl) sumEl.textContent = kr(Logic.cartTotal(cart));

    var fill = document.querySelector("[data-shipping-fill]");
    var label = document.querySelector("[data-shipping-label]");
    if (fill && label) {
      var shipping = Logic.shippingStatus(cart);
      fill.style.width = shipping.pct + "%";
      if (shipping.state === "empty") {
        label.textContent = "Fri frakt över " + kr(Logic.FREE_SHIPPING_THRESHOLD);
      } else if (shipping.state === "reached") {
        label.textContent = "Fri frakt ingår";
      } else {
        label.textContent = kr(shipping.remaining) + " kvar till fri frakt";
      }
    }

    window.dispatchEvent(new CustomEvent("almhem:cart-updated"));
  }

  function renderCartRow(row) {
    var el = document.createElement("div");
    el.className = "cart-row";

    var img = document.createElement("img");
    img.className = "cart-row__thumb";
    img.src = row.bild;
    img.alt = "";
    img.loading = "lazy";
    el.appendChild(img);

    var mid = document.createElement("div");
    var name = document.createElement("p");
    name.className = "cart-row__name";
    name.textContent = row.namn;
    var unit = document.createElement("p");
    unit.className = "cart-row__unit";
    unit.textContent = kr(row.pris) + " / st";
    var stepper = document.createElement("div");
    stepper.className = "stepper";

    var minus = document.createElement("button");
    minus.type = "button";
    minus.textContent = "−";
    minus.setAttribute("aria-label", "Minska antal för " + row.namn);
    minus.addEventListener("click", function () { setQty(row.namn, row.antal - 1); });

    var count = document.createElement("span");
    count.className = "stepper__count";
    count.textContent = String(row.antal);
    count.setAttribute("aria-live", "polite");

    var plus = document.createElement("button");
    plus.type = "button";
    plus.textContent = "+";
    plus.setAttribute("aria-label", "Öka antal för " + row.namn);
    plus.addEventListener("click", function () { setQty(row.namn, row.antal + 1); });

    stepper.appendChild(minus);
    stepper.appendChild(count);
    stepper.appendChild(plus);
    mid.appendChild(name);
    mid.appendChild(unit);
    mid.appendChild(stepper);
    el.appendChild(mid);

    var right = document.createElement("div");
    right.className = "cart-row__right";
    var total = document.createElement("span");
    total.className = "cart-row__total";
    total.textContent = kr(row.pris * row.antal);
    var remove = document.createElement("button");
    remove.type = "button";
    remove.className = "cart-row__remove";
    remove.textContent = "Ta bort";
    remove.addEventListener("click", function () { removeFromCart(row.namn); });
    right.appendChild(total);
    right.appendChild(remove);
    el.appendChild(right);

    return el;
  }

  /* Keep the cart in sync across tabs/pages */
  window.addEventListener("storage", function (e) {
    if (e.key === CART_KEY) {
      cart = loadCart();
      renderCart();
    }
  });

  /* ------------------------------------------------------------------------
     Cart drawer open/close
     ------------------------------------------------------------------------ */
  var drawer = document.getElementById("cartDrawer");
  var overlay = document.getElementById("cartOverlay");
  var cartToggle = document.getElementById("cartToggle");
  var cartClose = document.getElementById("cartClose");
  var lastFocused = null;

  function openCart() {
    if (!drawer || !overlay) return;
    lastFocused = document.activeElement;
    drawer.classList.add("is-open");
    overlay.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    overlay.setAttribute("aria-hidden", "false");
    document.addEventListener("keydown", onCartKeydown);
    if (cartClose) cartClose.focus();
  }
  function closeCart() {
    if (!drawer || !overlay) return;
    drawer.classList.remove("is-open");
    overlay.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    overlay.setAttribute("aria-hidden", "true");
    document.removeEventListener("keydown", onCartKeydown);
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }
  function onCartKeydown(e) {
    if (e.key === "Escape") closeCart();
  }
  if (cartToggle) cartToggle.addEventListener("click", function () {
    var isOpen = drawer.classList.contains("is-open");
    if (isOpen) closeCart(); else openCart();
  });
  if (cartClose) cartClose.addEventListener("click", closeCart);
  if (overlay) overlay.addEventListener("click", closeCart);

  window.Almhem.openCart = openCart;
  window.Almhem.closeCart = closeCart;

  renderCart();

  /* ------------------------------------------------------------------------
     Category tiles — fill srcset from the image manifest (kept out of the
     hand-written HTML so the width list lives in one place)
     ------------------------------------------------------------------------ */
  document.querySelectorAll("img[data-role='tile-img']").forEach(function (img) {
    var src = img.getAttribute("src");
    img.srcset = buildSrcset(src);
    var source = img.previousElementSibling;
    if (source && source.tagName === "SOURCE") source.srcset = buildSrcset(src, "webp");
  });

  /* ------------------------------------------------------------------------
     Newsletter — submit handler with real success/error states.
     No signup backend exists yet, so the request is mocked (resolves after
     a short simulated delay) instead of calling a real endpoint — a genuine
     fetch() here would 404 in every demo/portfolio view of this page. Client-
     side email validation still produces a real error state on bad input.
     To go live: replace mockSubscribe() below with a fetch() to your
     newsletter provider (ESP) and keep everything else unchanged — the
     success/error UI already matches both outcomes.
     ------------------------------------------------------------------------ */
  function mockSubscribe(email) {
    return new Promise(function (resolve) {
      setTimeout(function () { resolve({ ok: true }); }, 500);
    });
    // Real integration, once an endpoint exists:
    // return fetch("/api/newsletter", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ email: email })
    // }).then(function (res) { return { ok: res.ok }; });
  }

  var newsletterForm = document.getElementById("newsletterForm");
  if (newsletterForm) {
    var statusEl = document.getElementById("newsletterStatus");
    var submitBtn = newsletterForm.querySelector(".newsletter__submit");
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = document.getElementById("newsletterEmail").value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        statusEl.textContent = "Ange en giltig e-postadress.";
        statusEl.setAttribute("data-state", "error");
        return;
      }
      submitBtn.disabled = true;
      statusEl.textContent = "Skickar …";
      statusEl.removeAttribute("data-state");
      mockSubscribe(email)
        .then(function (result) {
          if (!result.ok) throw new Error("Newsletter signup failed");
          statusEl.textContent = "Tack! Kolla din inkorg för en bekräftelse.";
          statusEl.setAttribute("data-state", "success");
          newsletterForm.reset();
        })
        .catch(function () {
          statusEl.textContent = "Något gick fel. Försök igen om en stund.";
          statusEl.setAttribute("data-state", "error");
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }

  /* ------------------------------------------------------------------------
     Scroll reveal
     - threshold: 0 + rootMargin so a fast scroll can't skip a tall card
     - passive scroll listener as a sweep fallback (fling-safe)
     - reduced motion: everything is shown immediately, no observer needed
     Defined before the product grid below, which calls initReveal() as
     soon as it renders its first batch of cards.
     ------------------------------------------------------------------------ */
  var pendingReveal = [];

  function markVisible(el) {
    el.classList.add("is-visible");
    var i = pendingReveal.indexOf(el);
    if (i !== -1) pendingReveal.splice(i, 1);
    if (pendingReveal.length === 0) {
      window.removeEventListener("scroll", sweep);
    }
  }

  function sweep() {
    var threshold = window.innerHeight * 0.92;
    pendingReveal.slice().forEach(function (el) {
      if (el.getBoundingClientRect().top < threshold) markVisible(el);
    });
  }

  var revealObserver = reducedMotion ? null : new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        markVisible(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: "0px 0px -14% 0px" });

  function initReveal(nodeList, isStagger) {
    var nodes = Array.prototype.slice.call(nodeList);
    nodes.forEach(function (el, index) {
      if (isStagger) {
        el.style.transitionDelay = Math.min(index * 130, 900) + "ms";
      }
      if (reducedMotion) {
        el.classList.add("is-visible");
        return;
      }
      pendingReveal.push(el);
      revealObserver.observe(el);
    });
    if (!reducedMotion && nodes.length) {
      window.addEventListener("scroll", sweep, { passive: true });
      sweep();
    }
  }

  document.querySelectorAll(".reveal-stagger[data-stagger]").forEach(function (container) {
    // Product grid initialises its own stagger after each render (see renderGrid below).
    if (container.id === "productList") return;
    initReveal(container.children, true);
  });
  document.querySelectorAll(".reveal:not([data-stagger])").forEach(function (el) {
    initReveal([el], false);
  });

  /* ------------------------------------------------------------------------
     Mobile menu
     ------------------------------------------------------------------------ */
  var hamburger = document.getElementById("hamburger");
  var mobileMenu = document.getElementById("mobileMenu");
  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", function () {
      var isOpen = mobileMenu.classList.toggle("is-open");
      hamburger.setAttribute("aria-expanded", String(isOpen));
      hamburger.setAttribute("aria-label", isOpen ? "Stäng meny" : "Öppna meny");
    });
    mobileMenu.querySelectorAll("[data-menu-link]").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("is-open");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.setAttribute("aria-label", "Öppna meny");
      });
    });
  }

  /* ------------------------------------------------------------------------
     Product grid — render, filter, swatches, quick-buy
     ------------------------------------------------------------------------ */
  var productList = document.getElementById("productList");
  var cardTemplate = document.getElementById("cardTemplate");

  if (productList && cardTemplate) {
    var selectedImage = {}; // productName -> gallery index, driven by swatch hover/click
    var currentFilter = "Allt";

    function visibleProducts() {
      return PRODUCTS
        .filter(function (p) { return currentFilter === "Allt" || p.kategori === currentFilter; })
        .slice(0, 8);
    }

    function renderCardNode(p) {
      var node = cardTemplate.content.firstElementChild.cloneNode(true);
      var idx = selectedImage[p.namn] || 0;

      var img = node.querySelector("[data-role='image']");
      var webpSource = node.querySelector("[data-role='image-webp']");
      var sizes = "(min-width: 1440px) 330px, (min-width: 640px) 30vw, 90vw";
      img.src = p.bilder[idx];
      img.srcset = buildSrcset(p.bilder[idx]);
      img.sizes = sizes;
      img.alt = p.namn + ", " + p.kategori.toLowerCase();
      webpSource.srcset = buildSrcset(p.bilder[idx], "webp");
      webpSource.sizes = sizes;

      var tag = node.querySelector("[data-role='tag']");
      tag.textContent = p.tagg;
      tag.className = "card__tag " + (p.taggSale ? "card__tag--sale" : "card__tag--info");

      var quickbuy = node.querySelector("[data-role='quickbuy']");
      quickbuy.setAttribute("aria-label", "Snabbköp: lägg " + p.namn + " i varukorgen");
      quickbuy.addEventListener("click", function () {
        addToCart({ namn: p.namn, pris: p.pris, bild: p.bilder[0], antal: 1 });
      });

      node.querySelector("[data-role='category']").textContent = p.kategori;

      var nameLink = node.querySelector("[data-role='name-link']");
      nameLink.textContent = p.namn + (p.namn === "Krona Sävja" ? ", 12 ljus" : "");
      if (p.href) {
        nameLink.href = p.href;
      } else {
        nameLink.removeAttribute("href");
        nameLink.setAttribute("role", "text");
        nameLink.style.cursor = "default";
      }

      node.querySelector("[data-role='desc']").textContent = p.beskrivning;

      var swatchWrap = node.querySelector("[data-role='swatches']");
      swatchWrap.setAttribute("role", "group");
      swatchWrap.setAttribute("aria-label", "Välj kulör för " + p.namn);
      p.kulorer.forEach(function (color, i) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "swatch";
        btn.style.background = color;
        btn.setAttribute("aria-pressed", String(i === idx));
        btn.setAttribute("aria-label", "Kulör " + (i + 1) + " av " + p.kulorer.length);
        function show() {
          selectedImage[p.namn] = i;
          img.src = p.bilder[i];
          img.srcset = buildSrcset(p.bilder[i]);
          webpSource.srcset = buildSrcset(p.bilder[i], "webp");
          swatchWrap.querySelectorAll(".swatch").forEach(function (s, si) {
            s.setAttribute("aria-pressed", String(si === i));
          });
        }
        btn.addEventListener("click", show);
        btn.addEventListener("mouseenter", show);
        swatchWrap.appendChild(btn);
      });
      var swatchLabel = document.createElement("span");
      swatchLabel.className = "swatches__label";
      swatchLabel.textContent = p.kulortext;
      swatchWrap.appendChild(swatchLabel);

      var priceRow = node.querySelector("[data-role='price-row']");
      var priceEl = document.createElement("span");
      priceEl.className = "price";
      priceEl.textContent = kr(p.pris);
      priceRow.appendChild(priceEl);
      if (p.ordinarie) {
        var wasEl = document.createElement("span");
        wasEl.className = "price--was";
        wasEl.textContent = kr(p.ordinarie);
        priceRow.appendChild(wasEl);
      }

      node.querySelector("[data-role='add']").addEventListener("click", function () {
        addToCart({ namn: p.namn, pris: p.pris, bild: p.bilder[0], antal: 1 });
      });

      return node;
    }

    function renderGrid() {
      productList.innerHTML = "";
      visibleProducts().forEach(function (p) {
        productList.appendChild(renderCardNode(p));
      });
      initReveal(productList.children, true);
    }

    var filterChips = document.querySelectorAll(".filter-chip");
    filterChips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        currentFilter = chip.getAttribute("data-filter");
        filterChips.forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
        renderGrid();
      });
    });

    renderGrid();
  }

  window.Almhem.initReveal = initReveal;
})();
