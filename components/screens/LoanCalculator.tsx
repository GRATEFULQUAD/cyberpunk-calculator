"use client";

import { useMemo, useState } from "react";
import { calculateLoan, groupScheduleByYear } from "@/lib/loan";

export function LoanCalculator() {
  const [principal, setPrincipal] = useState("300000");
  const [rate, setRate] = useState("6.5");
  const [term, setTerm] = useState("30");
  const [termUnit, setTermUnit] = useState<"years" | "months">("years");
  const [expandedYear, setExpandedYear] = useState<number | null>(1);

  const principalNum = parseFloat(principal) || 0;
  const rateNum = parseFloat(rate) || 0;
  const termNum = parseFloat(term) || 0;
  const termMonths = termUnit === "years" ? termNum * 12 : termNum;

  const result = useMemo(
    () => calculateLoan(principalNum, rateNum, termMonths),
    [principalNum, rateNum, termMonths]
  );

  const yearGroups = useMemo(() => groupScheduleByYear(result.schedule), [result.schedule]);

  return (
    <div>
      <h2 className="screen-title">Loan &amp; Mortgage</h2>

      <div className="glass-panel">
        <label className="neon-label">Loan Amount ($)</label>
        <input
          className="neon-input"
          type="number"
          inputMode="decimal"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
        />
        <div style={{ height: 10 }} />
        <label className="neon-label">Annual Interest Rate (%)</label>
        <input
          className="neon-input"
          type="number"
          inputMode="decimal"
          step="0.01"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
        />
        <div style={{ height: 10 }} />
        <label className="neon-label">Loan Term</label>
        <div className="grid-2">
          <input
            className="neon-input"
            type="number"
            inputMode="numeric"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
          <select
            className="neon-select"
            value={termUnit}
            onChange={(e) => setTermUnit(e.target.value as "years" | "months")}
          >
            <option value="years">Years</option>
            <option value="months">Months</option>
          </select>
        </div>
      </div>

      <div className="glass-panel">
        <div className="result-row">
          <span>Monthly Payment</span>
          <span className="result-value">${result.monthlyPayment.toFixed(2)}</span>
        </div>
        <div className="result-row">
          <span>Total Principal</span>
          <span className="result-value">${result.totalPrincipal.toFixed(2)}</span>
        </div>
        <div className="result-row">
          <span>Total Interest</span>
          <span className="result-value">${result.totalInterest.toFixed(2)}</span>
        </div>
        <div className="result-row">
          <span>Total Payable</span>
          <span className="result-value">${result.totalPayable.toFixed(2)}</span>
        </div>
      </div>

      <div className="glass-panel">
        <span className="section-heading">Amortization Schedule (by year)</span>
        {yearGroups.map((group) => {
          const yearInterest = group.rows.reduce((s, r) => s + r.interest, 0);
          const yearPrincipal = group.rows.reduce((s, r) => s + r.principal, 0);
          const isOpen = expandedYear === group.year;
          const endBalance = group.rows[group.rows.length - 1].balance;
          return (
            <div key={group.year} style={{ marginBottom: 8 }}>
              <button
                className="chip-btn"
                style={{ width: "100%", textAlign: "left", display: "flex", justifyContent: "space-between" }}
                onClick={() => setExpandedYear(isOpen ? null : group.year)}
              >
                <span>Year {group.year}</span>
                <span>
                  Bal: ${endBalance.toFixed(0)} {isOpen ? "▲" : "▼"}
                </span>
              </button>
              {isOpen && (
                <div style={{ padding: "10px 4px" }}>
                  <div className="result-row">
                    <span>Principal Paid</span>
                    <span className="result-value">${yearPrincipal.toFixed(2)}</span>
                  </div>
                  <div className="result-row">
                    <span>Interest Paid</span>
                    <span className="result-value">${yearInterest.toFixed(2)}</span>
                  </div>
                  <div style={{ maxHeight: 220, overflowY: "auto", marginTop: 8 }}>
                    <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ color: "rgba(255,255,255,0.5)" }}>
                          <th style={{ textAlign: "left", padding: "4px" }}>#</th>
                          <th style={{ textAlign: "right", padding: "4px" }}>Payment</th>
                          <th style={{ textAlign: "right", padding: "4px" }}>Principal</th>
                          <th style={{ textAlign: "right", padding: "4px" }}>Interest</th>
                          <th style={{ textAlign: "right", padding: "4px" }}>Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.rows.map((row) => (
                          <tr key={row.period} style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                            <td style={{ padding: "4px" }}>{row.period}</td>
                            <td style={{ textAlign: "right", padding: "4px" }}>${row.payment.toFixed(2)}</td>
                            <td style={{ textAlign: "right", padding: "4px" }}>${row.principal.toFixed(2)}</td>
                            <td style={{ textAlign: "right", padding: "4px" }}>${row.interest.toFixed(2)}</td>
                            <td style={{ textAlign: "right", padding: "4px" }}>${row.balance.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
