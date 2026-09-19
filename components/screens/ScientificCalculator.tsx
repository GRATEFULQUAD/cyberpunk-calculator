"use client";

import { useState } from "react";
import { GlassButton } from "@/components/GlassButton";
import { evaluateExpression, safeFormat, AngleMode } from "@/lib/calc-engine";
import { useApp } from "@/lib/AppContext";

export function ScientificCalculator() {
  const { theme } = useApp();
  const [expression, setExpression] = useState("");
  const [display, setDisplay] = useState("0");
  const [error, setError] = useState(false);
  const [angleMode, setAngleMode] = useState<AngleMode>("deg");
  const [memory, setMemory] = useState(0);
  const [justEvaluated, setJustEvaluated] = useState(false);

  const append = (token: string) => {
    setError(false);
    setExpression((prev) => {
      const base = justEvaluated && !/^[+\-*/^%]/.test(token) ? "" : prev;
      const next = base + token;
      setDisplay(next || "0");
      return next;
    });
    setJustEvaluated(false);
  };

  const appendFunc = (fn: string) => append(`${fn}(`);

  const handleClear = () => {
    setExpression("");
    setDisplay("0");
    setError(false);
    setJustEvaluated(false);
  };

  const handleBackspace = () => {
    setError(false);
    setExpression((prev) => {
      const next = prev.slice(0, -1);
      setDisplay(next || "0");
      return next;
    });
  };

  const evaluate = (): number | null => {
    try {
      const result = evaluateExpression(expression, angleMode);
      return result;
    } catch {
      return null;
    }
  };

  const handleEquals = () => {
    const result = evaluate();
    if (result === null) {
      setDisplay("Error");
      setError(true);
      setJustEvaluated(true);
      setExpression("");
      return;
    }
    const formatted = safeFormat(result, 12);
    setDisplay(formatted);
    setExpression(formatted);
    setJustEvaluated(true);
  };

  const btn = (
    label: string,
    onClick: () => void,
    color = theme.secondary,
    key?: string
  ) => (
    <GlassButton key={key ?? label} color={color} aria-label={label} onClick={onClick} className="text-sm">
      {label}
    </GlassButton>
  );

  return (
    <div>
      <div className="display-panel" aria-live="polite">
        <div className="display-expression">
          {angleMode.toUpperCase()} {memory !== 0 ? "· M" : ""}
        </div>
        <div className="display-value">{error ? "Error" : display}</div>
      </div>

      <div className="chip-row">
        <button
          className={`chip-btn ${angleMode === "deg" ? "chip-btn-active" : ""}`}
          onClick={() => setAngleMode("deg")}
        >
          DEG
        </button>
        <button
          className={`chip-btn ${angleMode === "rad" ? "chip-btn-active" : ""}`}
          onClick={() => setAngleMode("rad")}
        >
          RAD
        </button>
        {btn("MC", () => setMemory(0), theme.secondary, "mc")}
        {btn(
          "MR",
          () => {
            append(safeFormat(memory));
          },
          theme.secondary,
          "mr"
        )}
        {btn(
          "M+",
          () => {
            const r = evaluate();
            if (r !== null) setMemory((m) => m + r);
          },
          theme.secondary,
          "m+"
        )}
        {btn(
          "M-",
          () => {
            const r = evaluate();
            if (r !== null) setMemory((m) => m - r);
          },
          theme.secondary,
          "m-"
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
        {btn("sin", () => appendFunc("sin"))}
        {btn("cos", () => appendFunc("cos"))}
        {btn("tan", () => appendFunc("tan"))}
        {btn("(", () => append("("))}
        {btn(")", () => append(")"))}

        {btn("asin", () => appendFunc("asin"))}
        {btn("acos", () => appendFunc("acos"))}
        {btn("atan", () => appendFunc("atan"))}
        {btn("x²", () => append("^2"))}
        {btn("x³", () => append("^3"))}

        {btn("log", () => appendFunc("log"))}
        {btn("ln", () => appendFunc("ln"))}
        {btn("√", () => appendFunc("sqrt"))}
        {btn("∛", () => appendFunc("cbrt"))}
        {btn("xʸ", () => append("^"))}

        {btn("π", () => append("pi"))}
        {btn("e", () => append("e"))}
        {btn("10ˣ", () => append("10^"))}
        {btn("eˣ", () => append("e^"))}
        {btn("n!", () => append("!"))}

        {btn("|x|", () => appendFunc("abs"))}
        {btn("C", handleClear, theme.operatorColor)}
        {btn("⌫", handleBackspace, theme.operatorColor)}
        {btn("%", () => append("%"), theme.operatorColor)}
        {btn("÷", () => append("/"), theme.operatorColor)}

        {btn("7", () => append("7"), theme.buttonColors[7 % theme.buttonColors.length])}
        {btn("8", () => append("8"), theme.buttonColors[8 % theme.buttonColors.length])}
        {btn("9", () => append("9"), theme.buttonColors[9 % theme.buttonColors.length])}
        {btn("×", () => append("*"), theme.operatorColor)}
        {btn("−", () => append("-"), theme.operatorColor)}

        {btn("4", () => append("4"), theme.buttonColors[4 % theme.buttonColors.length])}
        {btn("5", () => append("5"), theme.buttonColors[5 % theme.buttonColors.length])}
        {btn("6", () => append("6"), theme.buttonColors[6 % theme.buttonColors.length])}
        {btn("+", () => append("+"), theme.operatorColor)}
        {btn("=", handleEquals, theme.equalsColor)}

        {btn("1", () => append("1"), theme.buttonColors[1 % theme.buttonColors.length])}
        {btn("2", () => append("2"), theme.buttonColors[2 % theme.buttonColors.length])}
        {btn("3", () => append("3"), theme.buttonColors[3 % theme.buttonColors.length])}
        {btn("0", () => append("0"), theme.buttonColors[0 % theme.buttonColors.length])}
        {btn(".", () => append("."), theme.buttonColors[0 % theme.buttonColors.length])}
      </div>
    </div>
  );
}
