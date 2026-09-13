const test = require("node:test");
const assert = require("node:assert/strict");
const Logic = require("../cart-logic.js");

test("formatPrice — sv-SE grouping with ' kr' suffix", () => {
  assert.equal(Logic.formatPrice(1290), "1 290 kr");
  assert.equal(Logic.formatPrice(19900), "19 900 kr");
  assert.equal(Logic.formatPrice(0), "0 kr");
});

test("cartCount / cartTotal sum across rows", () => {
  const cart = [
    { namn: "Soffa Linnea", pris: 19900, antal: 1 },
    { namn: "Pläd Gotland", pris: 2450, antal: 2 }
  ];
  assert.equal(Logic.cartCount(cart), 3);
  assert.equal(Logic.cartTotal(cart), 19900 + 2450 * 2);
});

test("cartCount / cartTotal on an empty cart", () => {
  assert.equal(Logic.cartCount([]), 0);
  assert.equal(Logic.cartTotal([]), 0);
});

test("addItem creates a new row for a new product", () => {
  const cart = [];
  const next = Logic.addItem(cart, { namn: "Matbord Alm", pris: 18400, bild: "images/matbord-runt.png", antal: 1 });
  assert.equal(next.length, 1);
  assert.deepEqual(next[0], { namn: "Matbord Alm", pris: 18400, bild: "images/matbord-runt.png", antal: 1 });
  assert.deepEqual(cart, [], "addItem must not mutate the input array");
});

test("addItem merges by name and increments quantity", () => {
  const cart = [{ namn: "Krona Sävja", pris: 34900, bild: "images/lampa-krona.png", antal: 1 }];
  const next = Logic.addItem(cart, { namn: "Krona Sävja", pris: 34900, bild: "images/lampa-krona.png", antal: 2 });
  assert.equal(next.length, 1);
  assert.equal(next[0].antal, 3);
  assert.equal(cart[0].antal, 1, "addItem must not mutate the existing row");
});

test("addItem defaults antal to 1 when omitted", () => {
  const next = Logic.addItem([], { namn: "Pläd Gotland", pris: 2450, bild: "x.png" });
  assert.equal(next[0].antal, 1);
});

test("setQty updates the matching row's quantity", () => {
  const cart = [{ namn: "Soffa Linnea", pris: 19900, antal: 1 }];
  const next = Logic.setQty(cart, "Soffa Linnea", 4);
  assert.equal(next[0].antal, 4);
});

test("setQty removes the row once quantity reaches zero", () => {
  const cart = [{ namn: "Soffa Linnea", pris: 19900, antal: 1 }];
  const next = Logic.setQty(cart, "Soffa Linnea", 0);
  assert.equal(next.length, 0);
});

test("setQty removes the row for a negative quantity too", () => {
  const cart = [{ namn: "Soffa Linnea", pris: 19900, antal: 1 }];
  const next = Logic.setQty(cart, "Soffa Linnea", -1);
  assert.equal(next.length, 0);
});

test("removeItem drops only the matching row", () => {
  const cart = [
    { namn: "Soffa Linnea", pris: 19900, antal: 1 },
    { namn: "Pläd Gotland", pris: 2450, antal: 1 }
  ];
  const next = Logic.removeItem(cart, "Soffa Linnea");
  assert.equal(next.length, 1);
  assert.equal(next[0].namn, "Pläd Gotland");
});

test("shippingStatus — empty cart", () => {
  const status = Logic.shippingStatus([]);
  assert.equal(status.state, "empty");
  assert.equal(status.pct, 0);
  assert.equal(status.remaining, Logic.FREE_SHIPPING_THRESHOLD);
});

test("shippingStatus — below the free-shipping threshold", () => {
  const cart = [{ namn: "Pläd Gotland", pris: 1000, antal: 1 }];
  const status = Logic.shippingStatus(cart);
  assert.equal(status.state, "below");
  assert.equal(status.pct, 50);
  assert.equal(status.remaining, 1000);
});

test("shippingStatus — at and above the threshold reports 'reached' and clamps pct at 100", () => {
  const atThreshold = Logic.shippingStatus([{ namn: "x", pris: 2000, antal: 1 }]);
  assert.equal(atThreshold.state, "reached");
  assert.equal(atThreshold.pct, 100);
  assert.equal(atThreshold.remaining, 0);

  const wellAbove = Logic.shippingStatus([{ namn: "x", pris: 34900, antal: 1 }]);
  assert.equal(wellAbove.state, "reached");
  assert.equal(wellAbove.pct, 100);
});
