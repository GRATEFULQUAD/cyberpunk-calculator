"use client";

import { useCallback, useEffect, useState } from "react";
import { GlassButton } from "@/components/GlassButton";
import { evaluateExpression, safeFormat } from "@/lib/calc-engine";
import { useApp } from "@/lib/AppContext";

export function StandardCalculator() {
  const { theme } = useApp();
  const [expression, setExpression] = useState("");
  const [display, setDisplay] = useState("0");
  const [prevExpression, setPrevExpression] = useState("");
  const [error, setError] = useState(false);
  const [justEvaluated, setJustEvaluated] = useState(false);

  const colorForDigit = (d: string) => {
    const idx = parseInt(d, 10);
    return theme.buttonColors[idx % theme.buttonColors.length];
  };

  const appendToken = useCallback(
    (token: string) => {
      setError(false);
      setExpression((prev) => {
        let base = prev;
        if (justEvaluated) {
          const isOperator = /^[+\-*/^%]/.test(token);
          base = isOperator ? prev : "";
        }
        const next = base + token;
        setDisplay(next === "" ? "0" : next);
        return next;
      });
      setJustEvaluated(false);
      setPrevExpression("");
    },
    [justEvaluated]
  );

  const handleDecimal = () => {
    const segment = expression.split(/[+\-*/^%()]/).pop() ?? "";
    if (segment.includes(".")) return;
    appendToken(segment === "" ? "0." : ".");
  };

  const handleClear = () => {
    setExpression("");
    setDisplay("0");
    setPrevExpression("");
    setError(false);
    setJustEvaluated(false);
  };

  const handleBackspace = () => {
    setError(false);
    setExpression((prev) => {
      const next = prev.slice(0, -1);
      setDisplay(next === "" ? "0" : next);
      return next;
    });
  };

  const handleToggleSign = () => {
    setExpression((prev) => {
      if (!prev) return prev;
      const match = prev.match(/(-?\d+\.?\d*)$/);
      if (!match) return prev;
      const numStr = match[0];
      const start = prev.length - numStr.length;
      const negated = numStr.startsWith("-") ? numStr.slice(1) : `-${numStr}`;
      const next = prev.slice(0, start) + negated;
      setDisplay(next);
      return next;
    });
  };

  const handleEquals = useCallback(() => {
    if (!expression) return;
    try {
      const result = evaluateExpression(expression, "deg");
      setPrevExpression(expression + " =");
      const formatted = safeFormat(result, 12);
      setDisplay(formatted);
      setExpression(formatted);
      setJustEvaluated(true);
      setError(false);
    } catch {
      setDisplay("Error");
      setError(true);
      setJustEvaluated(true);
      setExpression("");
    }
  }, [expression]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9.]$/.test(e.key)) {
        e.key === "." ? handleDecimal() : appendToken(e.key);
      } else if (["+", "-", "*", "/", "%", "(", ")"].includes(e.key)) {
        appendToken(e.key);
      } else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        handleEquals();
      } else if (e.key === "Backspace") {
        handleBackspace();
      } else if (e.key === "Escape") {
        handleClear();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appendToken, handleEquals]);

  const numRow = (nums: string[]) =>
    nums.map((d) => (
      <GlassButton key={d} color={colorForDigit(d)} aria-label={`Digit ${d}`} onClick={() => appendToken(d)}>
        {d}
      </GlassButton>
    ));

  return (
    <div>
      <div className="display-panel" aria-live="polite">
        <div className="display-expression">{prevExpression || expression || " "}</div>
        <div className="display-value">{error ? "Error" : display}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
        <GlassButton color={theme.operatorColor} aria-label="Clear" onClick={handleClear}>
          C
        </GlassButton>
        <GlassButton color={theme.operatorColor} aria-label="Toggle sign" onClick={handleToggleSign}>
          +/-
        </GlassButton>
        <GlassButton color={theme.operatorColor} aria-label="Percent" onClick={() => appendToken("%")}>
          %
        </GlassButton>
        <GlassButton color={theme.operatorColor} aria-label="Divide" onClick={() => appendToken("/")}>
          ÷
        </GlassButton>

        {numRow(["7", "8", "9"])}
        <GlassButton color={theme.operatorColor} aria-label="Multiply" onClick={() => appendToken("*")}>
          ×
        </GlassButton>

        {numRow(["4", "5", "6"])}
        <GlassButton color={theme.operatorColor} aria-label="Subtract" onClick={() => appendToken("-")}>
          −
        </GlassButton>

        {numRow(["1", "2", "3"])}
        <GlassButton color={theme.operatorColor} aria-label="Add" onClick={() => appendToken("+")}>
          +
        </GlassButton>

        <GlassButton color={theme.operatorColor} aria-label="Backspace" onClick={handleBackspace}>
          ⌫
        </GlassButton>
        {numRow(["0"])}
        <GlassButton color={colorForDigit("0")} aria-label="Decimal point" onClick={handleDecimal}>
          .
        </GlassButton>
        <GlassButton color={theme.equalsColor} aria-label="Equals" onClick={handleEquals}>
          =
        </GlassButton>
      </div>
    </div>
  );
}
