import assert from "node:assert/strict";
import test from "node:test";

import {
  classifyFood,
  createReceiptItem,
  estimateItemEmissions,
  parseReceiptText,
} from "./receiptFootprint.js";

test("classifies grocery item names using supported EcoTrack food categories", () => {
  assert.equal(classifyFood("Organic basmati rice"), "rice");
  assert.equal(classifyFood("Fresh tomatoes"), "tomatoes");
  assert.equal(classifyFood("Toned UHT milk"), "milk");
  assert.equal(classifyFood("Parle-G biscuits"), "biscuits");
  assert.equal(classifyFood("Cadbury Dairy Milk"), "chocolate");
  assert.equal(classifyFood("Nutella hazelnut cocoa spread"), "sweetSpread");
  assert.equal(classifyFood("Coca-Cola Original Taste"), "softDrink");
  assert.equal(classifyFood("Pepsi Cola"), "softDrink");
  assert.equal(classifyFood("Maggi noodles"), "noodles");
  assert.equal(classifyFood("Tata Salt"), "salt");
  assert.equal(classifyFood("almond drink"), "");
});

test("parses receipt items, weights, and prices while ignoring totals and taxes", () => {
  const items = parseReceiptText(
    "2 x Tomatoes 500g ₹85\nChicken breast 1kg 220\nSubtotal ₹305\nGST 5%",
  );

  assert.equal(items.length, 2);
  assert.equal(items[0].name, "Tomatoes");
  assert.equal(items[0].grams, 500);
  assert.equal(items[0].price, 85);
  assert.equal(items[1].name, "Chicken breast");
  assert.equal(items[1].grams, 1000);
  assert.equal(items[1].price, 220);
});

test("does not assume a weight for items without a printed package weight", () => {
  const item = createReceiptItem("Bananas ₹80");
  assert.equal(item.grams, "");
  assert.equal(estimateItemEmissions(item), null);
});

test("converts packaged beverage volume to approximate grams", () => {
  const [item] = parseReceiptText("Coca-Cola 500ml ₹40");

  assert.equal(item.foodCategory, "softDrink");
  assert.equal(item.grams, 500);
  assert.equal(estimateItemEmissions(item).emissions, 0.21195);
});

test("parses product quantities written in liters", () => {
  const item = createReceiptItem("Nutella 1 L");

  assert.equal(item.foodCategory, "sweetSpread");
  assert.equal(item.grams, 1000);
});

test("estimates emissions from the existing factor registry and item weight", () => {
  const estimate = estimateItemEmissions({
    grams: 500,
    foodCategory: "rice",
  });

  assert.equal(estimate.category.activityType, "RICE");
  assert.equal(estimate.emissions, 2.225);
});

test("estimates emissions for every new receipt food group from sourced factors", () => {
  const expectedFactors = {
    milk: 1.27,
    biscuits: 4.0605,
    chocolate: 11.2983,
    sweetSpread: 9.11,
    softDrink: 0.4239,
    noodles: 1.5559,
    salt: 0.632,
  };

  for (const [foodCategory, factor] of Object.entries(expectedFactors)) {
    const estimate = estimateItemEmissions({ grams: 1000, foodCategory });
    assert.equal(estimate.category.id, foodCategory);
    assert.equal(estimate.factor, factor);
    assert.equal(estimate.emissions, factor);
  }
});
