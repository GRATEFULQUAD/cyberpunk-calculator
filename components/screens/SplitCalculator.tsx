"use client";

import { useMemo, useState } from "react";

type SplitMode = "equal" | "percent" | "amount";

interface Person {
  id: string;
  name: string;
  value: string; // percent or dollar amount depending on mode
}

let idCounter = 0;
function newPerson(name = ""): Person {
  idCounter += 1;
  return { id: `p${idCounter}-${Date.now()}`, name, value: "" };
}

export function SplitCalculator() {
  const [total, setTotal] = useState("");
  const [mode, setMode] = useState<SplitMode>("equal");
  const [people, setPeople] = useState<Person[]>([newPerson("Person 1"), newPerson("Person 2")]);

  const totalNum = parseFloat(total) || 0;

  const shares = useMemo(() => {
    if (mode === "equal") {
      const share = people.length > 0 ? totalNum / people.length : 0;
      return people.map((p) => ({ ...p, amount: share, percent: 100 / (people.length || 1) }));
    }
    if (mode === "percent") {
      return people.map((p) => {
        const pct = parseFloat(p.value) || 0;
        return { ...p, amount: (totalNum * pct) / 100, percent: pct };
      });
    }
    return people.map((p) => {
      const amt = parseFloat(p.value) || 0;
      return { ...p, amount: amt, percent: totalNum > 0 ? (amt / totalNum) * 100 : 0 };
    });
  }, [people, mode, totalNum]);

  const assignedTotal = shares.reduce((sum, s) => sum + s.amount, 0);
  const remaining = totalNum - assignedTotal;
  const isBalanced = Math.abs(remaining) < 0.005;

  const addPerson = () => setPeople((prev) => [...prev, newPerson(`Person ${prev.length + 1}`)]);
  const removePerson = (id: string) =>
    setPeople((prev) => (prev.length > 1 ? prev.filter((p) => p.id !== id) : prev));
  const updateName = (id: string, name: string) =>
    setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  const updateValue = (id: string, value: string) =>
    setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, value } : p)));

  return (
    <div>
      <h2 className="screen-title">Split Expense</h2>

      <div className="glass-panel">
        <label className="neon-label" htmlFor="split-total">
          Total Amount ($)
        </label>
        <input
          id="split-total"
          className="neon-input"
          type="number"
          inputMode="decimal"
          placeholder="0.00"
          value={total}
          onChange={(e) => setTotal(e.target.value)}
        />
      </div>

      <div className="glass-panel">
        <label className="neon-label">Split Method</label>
        <div className="chip-row">
          <button className={`chip-btn ${mode === "equal" ? "chip-btn-active" : ""}`} onClick={() => setMode("equal")}>
            Equal
          </button>
          <button className={`chip-btn ${mode === "percent" ? "chip-btn-active" : ""}`} onClick={() => setMode("percent")}>
            Percentage
          </button>
          <button className={`chip-btn ${mode === "amount" ? "chip-btn-active" : ""}`} onClick={() => setMode("amount")}>
            Dollar Amount
          </button>
        </div>
      </div>

      <div className="glass-panel">
        <label className="neon-label">People</label>
        {people.map((p, i) => {
          const share = shares.find((s) => s.id === p.id);
          return (
            <div
              key={p.id}
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
                marginBottom: "10px",
                flexWrap: "wrap",
              }}
            >
              <input
                className="neon-input"
                style={{ flex: "1 1 100px" }}
                placeholder={`Person ${i + 1}`}
                value={p.name}
                onChange={(e) => updateName(p.id, e.target.value)}
                aria-label={`Name for person ${i + 1}`}
              />
              {mode !== "equal" && (
                <input
                  className="neon-input"
                  style={{ flex: "0 1 90px" }}
                  type="number"
                  inputMode="decimal"
                  placeholder={mode === "percent" ? "%" : "$"}
                  value={p.value}
                  onChange={(e) => updateValue(p.id, e.target.value)}
                  aria-label={`${mode === "percent" ? "Percent" : "Amount"} for ${p.name || `person ${i + 1}`}`}
                />
              )}
              <span className="result-value" style={{ minWidth: "70px", textAlign: "right" }}>
                ${share ? share.amount.toFixed(2) : "0.00"}
              </span>
              <button
                className="chip-btn"
                onClick={() => removePerson(p.id)}
                aria-label={`Remove ${p.name || `person ${i + 1}`}`}
                disabled={people.length <= 1}
              >
                ✕
              </button>
            </div>
          );
        })}
        <button className="chip-btn" onClick={addPerson}>
          + Add Person
        </button>
      </div>

      <div className="glass-panel">
        <div className="result-row">
          <span>Assigned Total</span>
          <span className="result-value">${assignedTotal.toFixed(2)}</span>
        </div>
        <div className="result-row">
          <span>{remaining >= 0 ? "Remaining Unassigned" : "Over-assigned"}</span>
          <span
            className="result-value"
            style={{ color: isBalanced ? undefined : "rgb(255,90,90)" }}
          >
            ${Math.abs(remaining).toFixed(2)}
          </span>
        </div>
        {!isBalanced && mode !== "equal" && (
          <p style={{ fontSize: "12px", color: "rgba(255,150,150,0.9)", marginTop: "8px" }}>
            ⚠ Assigned amounts don&apos;t add up to the total. Adjust values above so nothing is
            silently miscalculated.
          </p>
        )}
      </div>
    </div>
  );
}
