"use client";

import { useState } from "react";

type Mode = "discount" | "tax" | "percentof" | "change" | "adjust";

const MODES: { id: Mode; label: string }[] = [
  { id: "discount", label: "Discount" },
  { id: "tax", label: "Tax" },
  { id: "percentof", label: "% Of" },
  { id: "change", label: "% Change" },
  { id: "adjust", label: "Increase/Decrease" },
];

export function DiscountCalculator() {
  const [mode, setMode] = useState<Mode>("discount");

  return (
    <div>
      <h2 className="screen-title">Discount · Tax · Percent</h2>
      <div className="glass-panel">
        <div className="chip-row">
          {MODES.map((m) => (
            <button
              key={m.id}
              className={`chip-btn ${mode === m.id ? "chip-btn-active" : ""}`}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {mode === "discount" && <DiscountMode />}
      {mode === "tax" && <TaxMode />}
      {mode === "percentof" && <PercentOfMode />}
      {mode === "change" && <PercentChangeMode />}
      {mode === "adjust" && <AdjustMode />}
    </div>
  );
}

function DiscountMode() {
  const [price, setPrice] = useState("");
  const [percent, setPercent] = useState("");
  const p = parseFloat(price) || 0;
  const pct = parseFloat(percent) || 0;
  const saved = p * (pct / 100);
  const final = p - saved;
  return (
    <div className="glass-panel">
      <label className="neon-label">Original Price ($)</label>
      <input className="neon-input" type="number" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} />
      <div style={{ height: 10 }} />
      <label className="neon-label">Discount %</label>
      <input className="neon-input" type="number" inputMode="decimal" value={percent} onChange={(e) => setPercent(e.target.value)} />
      <div style={{ height: 14 }} />
      <div className="result-row">
        <span>Amount Saved</span>
        <span className="result-value">${saved.toFixed(2)}</span>
      </div>
      <div className="result-row">
        <span>Final Price</span>
        <span className="result-value">${final.toFixed(2)}</span>
      </div>
    </div>
  );
}

function TaxMode() {
  const [price, setPrice] = useState("");
  const [percent, setPercent] = useState("");
  const p = parseFloat(price) || 0;
  const pct = parseFloat(percent) || 0;
  const taxAmount = p * (pct / 100);
  const total = p + taxAmount;
  return (
    <div className="glass-panel">
      <label className="neon-label">Price ($)</label>
      <input className="neon-input" type="number" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} />
      <div style={{ height: 10 }} />
      <label className="neon-label">Tax %</label>
      <input className="neon-input" type="number" inputMode="decimal" value={percent} onChange={(e) => setPercent(e.target.value)} />
      <div style={{ height: 14 }} />
      <div className="result-row">
        <span>Tax Amount</span>
        <span className="result-value">${taxAmount.toFixed(2)}</span>
      </div>
      <div className="result-row">
        <span>Total Price</span>
        <span className="result-value">${total.toFixed(2)}</span>
      </div>
    </div>
  );
}

function PercentOfMode() {
  const [percent, setPercent] = useState("");
  const [value, setValue] = useState("");
  const pct = parseFloat(percent) || 0;
  const v = parseFloat(value) || 0;
  const result = (pct / 100) * v;
  return (
    <div className="glass-panel">
      <label className="neon-label">Percent (%)</label>
      <input className="neon-input" type="number" inputMode="decimal" value={percent} onChange={(e) => setPercent(e.target.value)} />
      <div style={{ height: 10 }} />
      <label className="neon-label">Of Value</label>
      <input className="neon-input" type="number" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} />
      <div style={{ height: 14 }} />
      <div className="result-row">
        <span>
          {pct || 0}% of {v || 0}
        </span>
        <span className="result-value">{result.toFixed(2)}</span>
      </div>
    </div>
  );
}

function PercentChangeMode() {
  const [original, setOriginal] = useState("");
  const [newVal, setNewVal] = useState("");
  const o = parseFloat(original) || 0;
  const n = parseFloat(newVal) || 0;
  const change = o !== 0 ? ((n - o) / Math.abs(o)) * 100 : 0;
  return (
    <div className="glass-panel">
      <label className="neon-label">Original Number</label>
      <input className="neon-input" type="number" inputMode="decimal" value={original} onChange={(e) => setOriginal(e.target.value)} />
      <div style={{ height: 10 }} />
      <label className="neon-label">New Number</label>
      <input className="neon-input" type="number" inputMode="decimal" value={newVal} onChange={(e) => setNewVal(e.target.value)} />
      <div style={{ height: 14 }} />
      <div className="result-row">
        <span>{change >= 0 ? "Increase" : "Decrease"}</span>
        <span className="result-value" style={{ color: change >= 0 ? "rgb(87,255,140)" : "rgb(255,90,90)" }}>
          {Math.abs(change).toFixed(2)}%
        </span>
      </div>
    </div>
  );
}

function AdjustMode() {
  const [value, setValue] = useState("");
  const [percent, setPercent] = useState("");
  const v = parseFloat(value) || 0;
  const pct = parseFloat(percent) || 0;
  const increased = v * (1 + pct / 100);
  const decreased = v * (1 - pct / 100);
  return (
    <div className="glass-panel">
      <label className="neon-label">Number</label>
      <input className="neon-input" type="number" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} />
      <div style={{ height: 10 }} />
      <label className="neon-label">Percent (%)</label>
      <input className="neon-input" type="number" inputMode="decimal" value={percent} onChange={(e) => setPercent(e.target.value)} />
      <div style={{ height: 14 }} />
      <div className="result-row">
        <span>Increased by {pct || 0}%</span>
        <span className="result-value">{increased.toFixed(2)}</span>
      </div>
      <div className="result-row">
        <span>Decreased by {pct || 0}%</span>
        <span className="result-value">{decreased.toFixed(2)}</span>
      </div>
    </div>
  );
}
