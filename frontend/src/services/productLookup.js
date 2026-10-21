export async function lookupBarcode(barcode, signal) {
  const normalizedBarcode = String(barcode || "").replace(/\D/g, "");
  if (!/^\d{8,14}$/.test(normalizedBarcode)) {
    throw new Error("Enter a valid 8–14 digit product barcode.");
  }

  const response = await fetch(
    `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(normalizedBarcode)}.json`,
    { signal },
  );
  if (!response.ok) {
    throw new Error(`Product lookup failed (${response.status}).`);
  }

  const data = await response.json();
  if (data.status !== 1 || !data.product) {
    throw new Error("No product was found for this barcode.");
  }

  return {
    barcode: normalizedBarcode,
    product: data.product,
  };
}
