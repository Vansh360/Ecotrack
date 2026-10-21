import assert from "node:assert/strict";
import test from "node:test";

import { lookupBarcode } from "./productLookup.js";

test("looks up a barcode using the Open Food Facts product endpoint", async () => {
  const originalFetch = globalThis.fetch;
  let requestUrl;
  globalThis.fetch = async (url) => {
    requestUrl = url;
    return {
      ok: true,
      json: async () => ({
        status: 1,
        product: { product_name: "Rice", quantity: "1 kg" },
      }),
    };
  };

  try {
    const result = await lookupBarcode("12345678");
    assert.equal(result.barcode, "12345678");
    assert.equal(result.product.product_name, "Rice");
    assert.match(requestUrl, /openfoodfacts\.org\/api\/v2\/product\/12345678\.json/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("rejects invalid barcode input before making a request", async () => {
  await assert.rejects(
    lookupBarcode("not-a-barcode"),
    /valid 8–14 digit product barcode/,
  );
});

test("reports products missing from the lookup catalogue", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({ status: 0 }),
  });

  try {
    await assert.rejects(
      lookupBarcode("12345678"),
      /No product was found for this barcode/,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
