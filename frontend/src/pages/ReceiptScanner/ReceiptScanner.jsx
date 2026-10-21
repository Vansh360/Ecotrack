import { useEffect, useRef, useState } from "react";
import {
  Barcode,
  Camera,
  Leaf,
  Plus,
  ScanLine,
  Trash2,
  Upload,
} from "lucide-react";

import { useActivities } from "../../context/ActivityContext";
import { lookupBarcode } from "../../services/productLookup";
import {
  createReceiptItem,
  estimateItemEmissions,
  parseReceiptText,
  RECEIPT_FOOD_CATEGORIES,
} from "../../utils/receiptFootprint";
import "./ReceiptScanner.css";

const RECEIPT_EXAMPLE = "Chicken breast 500g ₹180\nBasmati rice 1kg ₹120\nTomatoes 500g ₹45\nTOTAL ₹345";

export default function ReceiptScanner() {
  const { addActivity } = useActivities();
  const [receiptText, setReceiptText] = useState("");
  const [items, setItems] = useState([]);
  const [barcode, setBarcode] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const frameRef = useRef(null);
  const scanningRef = useRef(false);
  const detectorRef = useRef(null);
  const zxingControlsRef = useRef(null);
  const lookupControllerRef = useRef(null);

  function stopCamera() {
    scanningRef.current = false;
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    zxingControlsRef.current?.stop();
    zxingControlsRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  }

  useEffect(() => () => {
    scanningRef.current = false;
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }
    zxingControlsRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    lookupControllerRef.current?.abort();
  }, []);

  function updateItem(id, changes) {
    setItems((current) => current.map((item) => (
      item.id === id ? { ...item, ...changes, saved: false } : item
    )));
  }

  function addReceiptItems() {
    const parsed = parseReceiptText(receiptText);
    if (!parsed.length) {
      setError("No item lines found. Paste one product per line.");
      return;
    }

    setError("");
    setNotice(`${parsed.length} receipt item${parsed.length === 1 ? "" : "s"} added for review.`);
    setItems((current) => [...current, ...parsed]);
  }

  async function addBarcodeProduct(value = barcode) {
    setError("");
    setNotice("");
    setIsLookingUp(true);
    lookupControllerRef.current?.abort();
    const controller = new AbortController();
    lookupControllerRef.current = controller;

    try {
      const { barcode: normalizedBarcode, product } = await lookupBarcode(value, controller.signal);
      const name = product.product_name
        || product.product_name_en
        || `Product ${normalizedBarcode}`;
      const quantity = product.quantity || "";
      const matchedItem = createReceiptItem(`${name} ${quantity}`, {
        source: "barcode",
      });

      setItems((current) => [...current, matchedItem]);
      setBarcode("");
      setNotice(
        matchedItem.foodCategory
          ? `${name} added. Check its category and enter the amount purchased.`
          : `${name} added, but its footprint category needs review.`,
      );
    } catch (lookupError) {
      if (lookupError.name !== "AbortError") {
        setError(lookupError.message || "Could not look up this barcode.");
      }
    } finally {
      if (lookupControllerRef.current === controller) {
        lookupControllerRef.current = null;
        setIsLookingUp(false);
      }
    }
  }

  async function startCamera() {
    setError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera access is unavailable. Use barcode entry instead.");
      return;
    }

    scanningRef.current = true;
    setIsScanning(true);

    try {
      if (!("BarcodeDetector" in window)) {
        const { BrowserMultiFormatReader } = await import("@zxing/browser");
        const reader = new BrowserMultiFormatReader();
        const controls = await reader.decodeFromConstraints(
          { audio: false, video: { facingMode: { ideal: "environment" } } },
          videoRef.current,
          (result) => {
            const detectedBarcode = result?.getText();
            if (detectedBarcode && scanningRef.current) {
              stopCamera();
              setBarcode(detectedBarcode);
              void addBarcodeProduct(detectedBarcode);
            }
          },
        );

        if (scanningRef.current) {
          zxingControlsRef.current = controls;
        } else {
          controls.stop();
        }
        return;
      }

      const detector = new window.BarcodeDetector({
        formats: ["ean_13", "ean_8", "upc_a", "upc_e"],
      });
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: "environment" } },
      });
      streamRef.current = stream;
      if (!scanningRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      detectorRef.current = detector;

      const detectFrame = async () => {
        if (!scanningRef.current || !videoRef.current) {
          return;
        }
        try {
          const detections = await detectorRef.current.detect(videoRef.current);
          const detectedBarcode = detections[0]?.rawValue;
          if (detectedBarcode) {
            stopCamera();
            setBarcode(detectedBarcode);
            void addBarcodeProduct(detectedBarcode);
            return;
          }
        } catch {
          stopCamera();
          setError("Could not read a barcode from the camera. Enter it manually.");
          return;
        }
        frameRef.current = requestAnimationFrame(detectFrame);
      };

      frameRef.current = requestAnimationFrame(detectFrame);
    } catch (cameraError) {
      stopCamera();
      setError(cameraError.message || "Could not start the camera. Check browser permissions.");
    }
  }

  const itemEstimates = items.map((item) => ({
    ...item,
    estimate: estimateItemEmissions(item),
  }));
  const totalEmissions = itemEstimates.reduce(
    (total, item) => total + (item.estimate?.emissions || 0),
    0,
  );
  const emissionsByCategory = itemEstimates.reduce((totals, item) => {
    if (item.estimate) {
      const key = item.estimate.category.id;
      totals[key] = (totals[key] || 0) + item.estimate.emissions;
    }
    return totals;
  }, {});
  const estimatedCarKm = totalEmissions / 0.174;
  const savedItemsCount = itemEstimates.filter((item) => item.saved).length;

  async function saveReceipt() {
    const toSave = itemEstimates.filter((item) => item.estimate && !item.saved);
    if (!toSave.length) {
      setError("Add a supported item with a known weight before saving.");
      return;
    }

    setSaving(true);
    setError("");
    setNotice("");
    let newlySavedCount = 0;
    try {
      for (const item of toSave) {
        await addActivity({
          category: "Food",
          activityType: item.estimate.category.activityType,
          quantity: Number(item.grams) / 1000,
          unit: "kg",
          details: `Receipt scan: ${item.name}; footprint estimate only.`,
        });
        newlySavedCount += 1;
        setItems((current) => current.map((savedItem) => (
          savedItem.id === item.id ? { ...savedItem, saved: true } : savedItem
        )));
      }
      setNotice(`${newlySavedCount} item${newlySavedCount === 1 ? "" : "s"} saved to Food activity history.`);
    } catch (saveError) {
      setError(
        newlySavedCount
          ? `${newlySavedCount} item(s) saved before an error: ${saveError.response?.data?.message || saveError.message}`
          : saveError.response?.data?.message || saveError.message || "Could not save receipt items.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="tracking-page receipt-page">
      <header className="tracking-header">
        <div className="tracking-icon"><ScanLine size={25} /></div>
        <div>
          <span>SCAN & ESTIMATE</span>
          <h1>Receipt & Barcode Scanner</h1>
          <p>Turn grocery items into an indicative food footprint estimate.</p>
        </div>
      </header>

      <section className="receipt-disclaimer">
        <Leaf size={18} />
        <p>
          Estimates use EcoTrack’s existing food emission factors and the item weight you provide.
          Chocolate spreads and soft drinks use provisional category averages rather than
          product-specific data. Liquid volume is converted to an approximate equal weight
          (1 ml ≈ 1 g). This version does not perform receipt-photo OCR; unclassified or non-food
          products are excluded from totals until reviewed.
        </p>
      </section>

      <section className="receipt-input-grid">
        <article className="receipt-panel">
          <div className="receipt-panel-heading">
            <Upload size={19} />
            <h2>Paste receipt text</h2>
          </div>
          <p>Paste the receipt lines here. Prices may be included, but are not used to calculate emissions.</p>
          <textarea
            aria-label="Receipt text"
            value={receiptText}
            onChange={(event) => setReceiptText(event.target.value)}
            placeholder={RECEIPT_EXAMPLE}
            rows={7}
          />
          <div className="receipt-actions">
            <button type="button" className="calculate-button" onClick={addReceiptItems}>
              <Plus size={16} /> Review receipt items
            </button>
            <button type="button" className="receipt-secondary" onClick={() => setReceiptText(RECEIPT_EXAMPLE)}>
              Load example
            </button>
          </div>
        </article>

        <article className="receipt-panel">
          <div className="receipt-panel-heading">
            <Barcode size={19} />
            <h2>Look up a barcode</h2>
          </div>
          <p>Search Open Food Facts for packaged food. Product results may be incomplete.</p>
          <form
            className="barcode-form"
            onSubmit={(event) => {
              event.preventDefault();
              addBarcodeProduct();
            }}
          >
            <input
              aria-label="Product barcode"
              inputMode="numeric"
              autoComplete="off"
              value={barcode}
              onChange={(event) => setBarcode(event.target.value)}
              placeholder="Enter 8–14 digit barcode"
            />
            <button type="submit" className="calculate-button" disabled={isLookingUp || !barcode.trim()}>
              {isLookingUp ? "Looking up..." : "Look up"}
            </button>
          </form>
          <button
            type="button"
            className="receipt-camera-button"
            onClick={isScanning ? stopCamera : startCamera}
          >
            <Camera size={16} /> {isScanning ? "Stop camera" : "Scan with camera"}
          </button>
          <video
            className="receipt-camera-preview"
            ref={videoRef}
            hidden={!isScanning}
            aria-label="Barcode camera preview"
            muted
            playsInline
          />
          <small className="receipt-source-note">
            Barcode lookup sends the code to Open Food Facts. Camera scanning requires browser support and permission.
          </small>
        </article>
      </section>

      {(error || notice) && (
        <p className={error ? "receipt-message receipt-error" : "receipt-message"} role={error ? "alert" : "status"}>
          {error || notice}
        </p>
      )}

      <section className="receipt-results" aria-labelledby="receipt-results-title">
        <div className="receipt-results-heading">
          <div>
            <span>YOUR FOOTPRINT RECEIPT</span>
            <h2 id="receipt-results-title">Review items</h2>
          </div>
          {items.length > 0 && (
            <button
              type="button"
              className="receipt-clear-button"
              onClick={() => {
                setItems([]);
                setNotice("");
              }}
            >
              Clear items
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="receipt-empty">Paste receipt lines or look up a barcode to start.</div>
        ) : (
          <>
            <div className="receipt-item-list">
              {itemEstimates.map((item) => (
                <article className="receipt-item" key={item.id}>
                  <div className="receipt-item-main">
                    <label>
                      <span>Product</span>
                      <input
                        value={item.name}
                        disabled={item.saved}
                        onChange={(event) => updateItem(item.id, {
                          name: event.target.value,
                          foodCategory: "",
                        })}
                      />
                    </label>
                    <label>
                      <span>Food group</span>
                      <select
                        value={item.foodCategory}
                        disabled={item.saved}
                        onChange={(event) => updateItem(item.id, { foodCategory: event.target.value })}
                      >
                        <option value="">Unclassified — excluded</option>
                        {RECEIPT_FOOD_CATEGORIES.map((category) => (
                          <option key={category.id} value={category.id}>{category.label}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span>Amount (g / ml)</span>
                      <input
                        type="number"
                        min="1"
                        step="any"
                        value={item.grams}
                        disabled={item.saved}
                        placeholder="Enter weight"
                        onChange={(event) => updateItem(item.id, { grams: event.target.value })}
                      />
                    </label>
                  </div>
                  <div className="receipt-item-summary">
                    {item.estimate ? (
                      <>
                        <span>{item.estimate.category.label}</span>
                        <strong>{item.estimate.emissions.toFixed(2)} kg CO₂e</strong>
                        {item.saved && <small>Saved to activity history</small>}
                      </>
                    ) : (
                      <span className="receipt-unestimated">
                        {item.foodCategory ? "Enter a valid weight" : "Review category"}
                      </span>
                    )}
                    <button
                      type="button"
                      aria-label={`Remove ${item.name}`}
                      className="receipt-remove-button"
                      disabled={item.saved}
                      onClick={() => setItems((current) => current.filter((candidate) => candidate.id !== item.id))}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="footprint-total">
              <div>
                <span>Estimated receipt footprint</span>
                <strong>{totalEmissions.toFixed(2)} kg CO₂e</strong>
                <small>Recognized food items with a reviewed weight only</small>
              </div>
              <div className="footprint-equivalent">
                <span>About</span>
                <strong>{estimatedCarKm.toFixed(1)} km</strong>
                <small>at 0.174 kg CO₂e per car km</small>
              </div>
            </div>

            {Object.keys(emissionsByCategory).length > 0 && (
              <div className="receipt-breakdown">
                <h3>Category breakdown</h3>
                {Object.entries(emissionsByCategory).map(([categoryId, emissions]) => {
                  const category = RECEIPT_FOOD_CATEGORIES.find((candidate) => candidate.id === categoryId);
                  return (
                    <div className="receipt-breakdown-row" key={categoryId}>
                      <span>{category.label}</span>
                      <strong>{emissions.toFixed(2)} kg CO₂e</strong>
                    </div>
                  );
                })}
              </div>
            )}

            <button
              type="button"
              className="calculate-button receipt-save-button"
              onClick={saveReceipt}
              disabled={saving || itemEstimates.every((item) => !item.estimate || item.saved)}
            >
              {saving ? "Saving items..." : `Save recognized items (${savedItemsCount} saved)`}
            </button>
          </>
        )}
      </section>
    </main>
  );
}
