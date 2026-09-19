"use client";

import { useMemo, useState } from "react";
import {
  QUANTITY_UNIT_LABELS,
  QuantityUnit,
  pricePerBaseUnit,
  unitsAreComparable,
} from "@/lib/conversions";

interface Product {
  id: string;
  name: string;
  price: string;
  quantity: string;
  unit: QuantityUnit;
}

let counter = 0;
function newProduct(): Product {
  counter += 1;
  return { id: `prod-${counter}`, name: "", price: "", quantity: "", unit: "item" };
}

const UNIT_OPTIONS = Object.keys(QUANTITY_UNIT_LABELS) as QuantityUnit[];

export function UnitPriceCalculator() {
  const [products, setProducts] = useState<Product[]>([newProduct(), newProduct()]);

  const update = (id: string, patch: Partial<Product>) =>
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const addProduct = () =>
    setProducts((prev) => (prev.length < 5 ? [...prev, newProduct()] : prev));
  const removeProduct = (id: string) =>
    setProducts((prev) => (prev.length > 1 ? prev.filter((p) => p.id !== id) : prev));

  const results = useMemo(() => {
    return products.map((p) => {
      const price = parseFloat(p.price) || 0;
      const qty = parseFloat(p.quantity) || 0;
      const perUnit = qty > 0 && price > 0 ? pricePerBaseUnit(price, qty, p.unit) : null;
      return { ...p, perUnit };
    });
  }, [products]);

  const baseUnit = results.find((r) => r.perUnit !== null)?.unit;
  const comparable = results.filter(
    (r) => r.perUnit !== null && baseUnit && unitsAreComparable(r.unit, baseUnit)
  );
  const incomparable = results.some(
    (r) => r.perUnit !== null && baseUnit && !unitsAreComparable(r.unit, baseUnit)
  );

  let bestId: string | null = null;
  if (comparable.length > 0) {
    const best = comparable.reduce((min, r) => (r.perUnit! < min.perUnit! ? r : min));
    bestId = best.id;
  }

  return (
    <div>
      <h2 className="screen-title">Unit Price Comparison</h2>

      {results.map((p, i) => (
        <div key={p.id} className="glass-panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="section-heading">Product {i + 1}</span>
            {products.length > 1 && (
              <button className="chip-btn" onClick={() => removeProduct(p.id)} aria-label={`Remove product ${i + 1}`}>
                ✕
              </button>
            )}
          </div>
          <input
            className="neon-input"
            placeholder="Name (optional)"
            value={p.name}
            onChange={(e) => update(p.id, { name: e.target.value })}
            style={{ marginBottom: 8 }}
          />
          <div className="grid-3">
            <input
              className="neon-input"
              type="number"
              inputMode="decimal"
              placeholder="Price $"
              value={p.price}
              onChange={(e) => update(p.id, { price: e.target.value })}
              aria-label={`Price for product ${i + 1}`}
            />
            <input
              className="neon-input"
              type="number"
              inputMode="decimal"
              placeholder="Qty"
              value={p.quantity}
              onChange={(e) => update(p.id, { quantity: e.target.value })}
              aria-label={`Quantity for product ${i + 1}`}
            />
            <select
              className="neon-select"
              value={p.unit}
              onChange={(e) => update(p.id, { unit: e.target.value as QuantityUnit })}
              aria-label={`Unit for product ${i + 1}`}
            >
              {UNIT_OPTIONS.map((u) => (
                <option key={u} value={u}>
                  {QUANTITY_UNIT_LABELS[u]}
                </option>
              ))}
            </select>
          </div>
          {p.perUnit !== null && (
            <div
              className="result-row"
              style={{
                marginTop: 10,
                borderBottom: "none",
                fontWeight: p.id === bestId ? 800 : 500,
              }}
            >
              <span>{p.id === bestId ? "🏆 BEST VALUE" : "Price per unit"}</span>
              <span
                className="result-value"
                style={{ color: p.id === bestId ? "rgb(87,255,140)" : undefined }}
              >
                ${p.perUnit.toFixed(4)}/{p.unit === "item" ? "item" : "base unit"}
              </span>
            </div>
          )}
        </div>
      ))}

      {products.length < 5 && (
        <button className="chip-btn" onClick={addProduct}>
          + Add Product
        </button>
      )}

      {incomparable && (
        <p style={{ fontSize: "12px", color: "rgba(255,200,120,0.9)", marginTop: 10 }}>
          ⚠ Some products use incompatible unit types (e.g. weight vs. volume vs. item count) and
          can&apos;t be fairly compared directly.
        </p>
      )}
    </div>
  );
}
