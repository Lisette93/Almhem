/* ==========================================================================
   Almhem — pure cart logic (no DOM, no localStorage).
   Kept separate from main.js so it can run under Node for unit tests
   (see tests/cart-logic.test.js) without a browser or a bundler.
   Works as a plain <script> in the browser (attaches to window.AlmhemCartLogic)
   and as a CommonJS module under Node (module.exports).
   ========================================================================== */

(function (root) {
  "use strict";

  var FREE_SHIPPING_THRESHOLD = 2000;

  function formatPrice(amount) {
    return new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(amount) + " kr";
  }

  function cartCount(cart) {
    return cart.reduce(function (sum, row) { return sum + row.antal; }, 0);
  }

  function cartTotal(cart) {
    return cart.reduce(function (sum, row) { return sum + row.pris * row.antal; }, 0);
  }

  // Returns a NEW array — callers own the previous reference (easier to test / reason about).
  function addItem(cart, item) {
    var antal = item.antal || 1;
    var existing = cart.some(function (row) { return row.namn === item.namn; });
    if (existing) {
      return cart.map(function (row) {
        return row.namn === item.namn ? Object.assign({}, row, { antal: row.antal + antal }) : row;
      });
    }
    return cart.concat([{ namn: item.namn, pris: item.pris, bild: item.bild, antal: antal }]);
  }

  function setQty(cart, namn, antal) {
    if (antal <= 0) {
      return cart.filter(function (row) { return row.namn !== namn; });
    }
    return cart.map(function (row) {
      return row.namn === namn ? Object.assign({}, row, { antal: antal }) : row;
    });
  }

  function removeItem(cart, namn) {
    return cart.filter(function (row) { return row.namn !== namn; });
  }

  // Pure summary of the free-shipping progress bar: no formatting, no DOM.
  function shippingStatus(cart, threshold) {
    threshold = threshold || FREE_SHIPPING_THRESHOLD;
    var total = cartTotal(cart);
    var pct = Math.min(100, Math.round((total / threshold) * 100));
    var state = cart.length === 0 ? "empty" : total >= threshold ? "reached" : "below";
    return { total: total, pct: pct, state: state, remaining: Math.max(0, threshold - total) };
  }

  var api = {
    FREE_SHIPPING_THRESHOLD: FREE_SHIPPING_THRESHOLD,
    formatPrice: formatPrice,
    cartCount: cartCount,
    cartTotal: cartTotal,
    addItem: addItem,
    setQty: setQty,
    removeItem: removeItem,
    shippingStatus: shippingStatus
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.AlmhemCartLogic = api;
  }
})(typeof window !== "undefined" ? window : this);
