/* ==========================================================================
   Almhem — product page behaviour (Krona Sävja)
   Loaded after main.js: reuses window.Almhem.cart / kr / buildSrcset.
   Guarded on its root element so it's a no-op if included elsewhere.
   ========================================================================== */

(function () {
  "use strict";

  var mainInfo = document.querySelector(".product-info");
  if (!mainInfo || !window.Almhem) return;

  var PRODUCT_NAME = "Krona Sävja"; // matches the cart key used on the landing page card
  var UNIT_PRICE = 34900;
  var MIN_QTY = 1;
  var MAX_QTY = 9;

  var kr = window.Almhem.kr;
  var buildSrcset = window.Almhem.buildSrcset;
  var qty = MIN_QTY;

  /* ---- Gallery ------------------------------------------------------- */
  var galleryMain = document.getElementById("galleryMain");
  var galleryMainWebp = document.getElementById("galleryMainWebp");
  var thumbs = document.querySelectorAll(".gallery__thumb");
  thumbs.forEach(function (thumb) {
    thumb.addEventListener("click", function () {
      var src = thumb.getAttribute("data-src");
      galleryMain.src = src;
      galleryMain.srcset = buildSrcset(src);
      galleryMainWebp.srcset = buildSrcset(src, "webp");
      thumbs.forEach(function (t) { t.setAttribute("aria-current", String(t === thumb)); });
    });
  });

  /* ---- Finish picker --------------------------------------------------
     Selecting a finish does not change the photographed gallery in this
     placeholder data set (no per-finish photography yet); it updates the
     label only, matching the reference prototype. */
  var finishLabel = document.getElementById("finishLabel");
  var finishOptions = document.querySelectorAll(".finish-option");
  finishOptions.forEach(function (opt) {
    opt.addEventListener("click", function () {
      finishOptions.forEach(function (o) { o.setAttribute("aria-pressed", String(o === opt)); });
      finishLabel.textContent = "Finish — " + opt.getAttribute("data-finish");
    });
  });

  /* ---- Quantity + add to cart ------------------------------------------ */
  var qtyCount = document.getElementById("qtyCount");
  var qtyMinus = document.getElementById("qtyMinus");
  var qtyPlus = document.getElementById("qtyPlus");
  var addBtn = document.getElementById("addToCartBtn");
  var statusEl = document.getElementById("productStatus");

  function renderQty() {
    qtyCount.textContent = String(qty);
    addBtn.textContent = "Lägg i varukorg — " + kr(UNIT_PRICE * qty);
    qtyMinus.disabled = qty <= MIN_QTY;
    qtyPlus.disabled = qty >= MAX_QTY;
  }

  function renderStatus() {
    var inCart = window.Almhem.cart.getQty(PRODUCT_NAME);
    statusEl.textContent = inCart
      ? inCart + " i varukorgen · leverans 3–4 veckor"
      : "Leverans 3–4 veckor · 100 dagars öppet köp";
  }

  qtyMinus.addEventListener("click", function () {
    qty = Math.max(MIN_QTY, qty - 1);
    renderQty();
  });
  qtyPlus.addEventListener("click", function () {
    qty = Math.min(MAX_QTY, qty + 1);
    renderQty();
  });
  addBtn.addEventListener("click", function () {
    window.Almhem.cart.add({ namn: PRODUCT_NAME, pris: UNIT_PRICE, bild: "images/lampa-krona.png", antal: qty });
  });

  window.addEventListener("almhem:cart-updated", renderStatus);

  renderQty();
  renderStatus();
})();
