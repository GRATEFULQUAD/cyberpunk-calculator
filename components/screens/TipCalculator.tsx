"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/lib/AppContext";

const QUICK_TIPS = [10, 15, 18, 20, 22, 25];

export function TipCalculator() {
  const { theme } = useApp();
  const [bill, setBill] = useState("");
  const [tipPercent, setTipPercent] = useState(18);
  const [customTip, setCustomTip] = useState("");
  const [people, setPeople] = useState("1");

  const billNum = parseFloat(bill) || 0;
  const peopleNum = Math.max(1, parseInt(people, 10) || 1);
  const effectiveTip = customTip !== "" ? parseFloat(customTip) || 0 : tipPercent;

  const { tipAmount, total, tipPerPerson, totalPerPerson } = useMemo(() => {
    const tipAmount = billNum * (effectiveTip / 100);
    const total = billNum + tipAmount;
    return {
      tipAmount,
      total,
      tipPerPerson: tipAmount / peopleNum,
      totalPerPerson: total / peopleNum,
    };
  }, [billNum, effectiveTip, peopleNum]);

  return (
    <div>
      <h2 className="screen-title">Tip Calculator</h2>

      <div className="glass-panel">
        <label className="neon-label" htmlFor="bill">
          Bill Amount ($)
        </label>
        <input
          id="bill"
          className="neon-input"
          type="number"
          inputMode="decimal"
          placeholder="0.00"
          value={bill}
          onChange={(e) => setBill(e.target.value)}
        />
      </div>

      <div className="glass-panel">
        <label className="neon-label">Tip Percentage</label>
        <div className="chip-row">
          {QUICK_TIPS.map((p) => (
            <button
              key={p}
              className={`chip-btn ${customTip === "" && tipPercent === p ? "chip-btn-active" : ""}`}
              onClick={() => {
                setTipPercent(p);
                setCustomTip("");
              }}
            >
              {p}%
            </button>
          ))}
        </div>
        <label className="neon-label" htmlFor="customTip">
          Custom %
        </label>
        <input
          id="customTip"
          className="neon-input"
          type="number"
          inputMode="decimal"
          placeholder="Custom tip %"
          value={customTip}
          onChange={(e) => setCustomTip(e.target.value)}
        />
      </div>

      <div className="glass-panel">
        <label className="neon-label" htmlFor="people">
          Number of People
        </label>
        <input
          id="people"
          className="neon-input"
          type="number"
          inputMode="numeric"
          min={1}
          value={people}
          onChange={(e) => setPeople(e.target.value)}
        />
      </div>

      <div className="glass-panel">
        <div className="result-row">
          <span>Tip Amount</span>
          <span className="result-value">${tipAmount.toFixed(2)}</span>
        </div>
        <div className="result-row">
          <span>Total Bill</span>
          <span className="result-value">${total.toFixed(2)}</span>
        </div>
        <div className="result-row">
          <span>Tip / Person</span>
          <span className="result-value">${tipPerPerson.toFixed(2)}</span>
        </div>
        <div className="result-row">
          <span>Total / Person</span>
          <span className="result-value" style={{ color: `rgb(${theme.equalsColor})` }}>
            ${totalPerPerson.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
