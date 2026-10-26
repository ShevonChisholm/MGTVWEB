import { test } from "node:test";
import assert from "node:assert/strict";
import { productPresentation } from "../src/lib/commercePresentation.ts";
const option = (id, price = 450000, extra = {}) => ({
  id,
  label: "Medium · Black",
  price_minor: price,
  available: 10,
  ...extra,
});
const product = (extra = {}) => ({
  id: "p",
  name: "MGTV Tee",
  category: "Clothing",
  kind: "physical",
  options: [option("one")],
  ...extra,
});
const now = Date.parse("2026-10-26T12:00:00Z");
test("equal prices are shown as one amount, varied prices use From", () => {
  assert.equal(
    productPresentation(product({ options: [option("a"), option("b")] }), now)
      .variedPrice,
    false,
  );
  assert.equal(
    productPresentation(
      product({ options: [option("a"), option("b", 550000)] }),
      now,
    ).variedPrice,
    true,
  );
});
test("dated products ignore expired and inactive dates", () => {
  const info = productPresentation(
    product({
      kind: "experience",
      category: "Experiences",
      options: [
        option("expired", 100, { starts_at: "2026-01-01T00:00:00Z" }),
        option("new", 650000, { starts_at: "2027-01-01T15:00:00Z" }),
        option("inactive", 1, {
          active: false,
          starts_at: "2027-02-01T15:00:00Z",
        }),
      ],
    }),
    now,
  );
  assert.equal(info.price, 650000);
  assert.equal(info.action, "Choose a date");
  assert.match(info.detail, /2027/);
});
test("sold-out, expired and empty records have honest states", () => {
  assert.equal(
    productPresentation(
      product({ options: [option("a", 450000, { available: 0 })] }),
      now,
    ).availability,
    "Sold out",
  );
  assert.equal(productPresentation(product({ options: [] }), now).price, null);
  assert.equal(
    productPresentation(
      product({
        kind: "travel",
        options: [option("a", 1, { starts_at: "2026-01-01T00:00:00Z" })],
      }),
      now,
    ).availability,
    "No upcoming dates",
  );
});
test("digital downloads and event tickets have distinct actions", () => {
  assert.equal(
    productPresentation(product({ kind: "digital", category: "Digital" }), now)
      .action,
    "Explore artwork",
  );
  assert.equal(
    productPresentation(
      product({
        kind: "experience",
        category: "Event tickets",
        options: [option("a", 1, { starts_at: "2027-01-01T15:00:00Z" })],
      }),
      now,
    ).action,
    "View tickets",
  );
});

test("displayed starting price never advertises only a sold-out option", () => {
  const info = productPresentation(
    product({
      options: [
        option("cheap", 100, { available: 0 }),
        option("buyable", 650000),
      ],
    }),
    now,
  );
  assert.equal(info.price, 650000);
  assert.equal(info.variedPrice, false);
});
