"use client";

import { useMemo, useState } from "react";
import {
  ACTIVITY_LABELS,
  ACTIVITY_MULTIPLIERS,
  ActivityLevel,
  Sex,
  calculateBMI,
  estimateDailyCalories,
  feetInchesToCm,
  kgToLb,
  lbToKg,
} from "@/lib/health";

type Units = "imperial" | "metric";

export function HealthCalculator() {
  const [units, setUnits] = useState<Units>("imperial");
  const [heightCm, setHeightCm] = useState("175");
  const [heightFeet, setHeightFeet] = useState("5");
  const [heightInches, setHeightInches] = useState("9");
  const [weightKg, setWeightKg] = useState("70");
  const [weightLb, setWeightLb] = useState("154");
  const [age, setAge] = useState("30");
  const [sex, setSex] = useState<Sex>("male");
  const [activity, setActivity] = useState<ActivityLevel>("moderate");

  const effectiveHeightCm =
    units === "metric" ? parseFloat(heightCm) || 0 : feetInchesToCm(parseFloat(heightFeet) || 0, parseFloat(heightInches) || 0);
  const effectiveWeightKg =
    units === "metric" ? parseFloat(weightKg) || 0 : lbToKg(parseFloat(weightLb) || 0);
  const ageNum = parseFloat(age) || 0;

  const bmiResult = useMemo(
    () => calculateBMI(effectiveHeightCm, effectiveWeightKg),
    [effectiveHeightCm, effectiveWeightKg]
  );

  const calories = useMemo(
    () => estimateDailyCalories(sex, effectiveWeightKg, effectiveHeightCm, ageNum, activity),
    [sex, effectiveWeightKg, effectiveHeightCm, ageNum, activity]
  );

  const gaugePercent = Math.min(100, Math.max(0, ((bmiResult.bmi - 10) / (40 - 10)) * 100));

  const categoryColor: Record<string, string> = {
    Underweight: "rgb(0,200,255)",
    Healthy: "rgb(87,255,140)",
    Overweight: "rgb(255,200,60)",
    Obese: "rgb(255,90,90)",
  };

  const healthyMinDisplay = units === "metric" ? bmiResult.healthyMinKg.toFixed(1) + " kg" : kgToLb(bmiResult.healthyMinKg).toFixed(1) + " lb";
  const healthyMaxDisplay = units === "metric" ? bmiResult.healthyMaxKg.toFixed(1) + " kg" : kgToLb(bmiResult.healthyMaxKg).toFixed(1) + " lb";

  return (
    <div>
      <h2 className="screen-title">BMI &amp; Health</h2>

      <div className="glass-panel">
        <div className="chip-row">
          <button className={`chip-btn ${units === "imperial" ? "chip-btn-active" : ""}`} onClick={() => setUnits("imperial")}>
            Imperial
          </button>
          <button className={`chip-btn ${units === "metric" ? "chip-btn-active" : ""}`} onClick={() => setUnits("metric")}>
            Metric
          </button>
        </div>

        <label className="neon-label">Height</label>
        {units === "imperial" ? (
          <div className="grid-2">
            <input className="neon-input" type="number" placeholder="feet" value={heightFeet} onChange={(e) => setHeightFeet(e.target.value)} />
            <input className="neon-input" type="number" placeholder="inches" value={heightInches} onChange={(e) => setHeightInches(e.target.value)} />
          </div>
        ) : (
          <input className="neon-input" type="number" placeholder="cm" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
        )}

        <div style={{ height: 10 }} />
        <label className="neon-label">Weight</label>
        {units === "imperial" ? (
          <input className="neon-input" type="number" placeholder="lb" value={weightLb} onChange={(e) => setWeightLb(e.target.value)} />
        ) : (
          <input className="neon-input" type="number" placeholder="kg" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
        )}

        <div style={{ height: 10 }} />
        <div className="grid-2">
          <div>
            <label className="neon-label">Age</label>
            <input className="neon-input" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
          </div>
          <div>
            <label className="neon-label">Sex</label>
            <select className="neon-select" value={sex} onChange={(e) => setSex(e.target.value as Sex)}>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        <div style={{ height: 10 }} />
        <label className="neon-label">Activity Level</label>
        <select className="neon-select" value={activity} onChange={(e) => setActivity(e.target.value as ActivityLevel)}>
          {(Object.keys(ACTIVITY_MULTIPLIERS) as ActivityLevel[]).map((a) => (
            <option key={a} value={a}>
              {ACTIVITY_LABELS[a]}
            </option>
          ))}
        </select>
      </div>

      <div className="glass-panel">
        <span className="section-heading">BMI</span>
        <div
          style={{
            height: 14,
            borderRadius: 999,
            background:
              "linear-gradient(90deg, rgb(0,200,255) 0%, rgb(87,255,140) 33%, rgb(255,200,60) 66%, rgb(255,90,90) 100%)",
            position: "relative",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: `${gaugePercent}%`,
              top: -4,
              transform: "translateX(-50%)",
              width: 4,
              height: 22,
              background: "#fff",
              borderRadius: 2,
              boxShadow: "0 0 10px #fff",
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
          <span>Under</span>
          <span>Healthy</span>
          <span>Over</span>
          <span>Obese</span>
        </div>

        <div className="result-row" style={{ marginTop: 12 }}>
          <span>BMI</span>
          <span className="result-value">{bmiResult.bmi.toFixed(1)}</span>
        </div>
        <div className="result-row">
          <span>Category</span>
          <span className="result-value" style={{ color: categoryColor[bmiResult.category] }}>
            {bmiResult.category}
          </span>
        </div>
        <div className="result-row">
          <span>Healthy Weight Range</span>
          <span className="result-value">
            {healthyMinDisplay} – {healthyMaxDisplay}
          </span>
        </div>
      </div>

      <div className="glass-panel">
        <span className="section-heading">Estimated Daily Calories</span>
        <div className="result-row">
          <span>Maintenance Calories (estimate)</span>
          <span className="result-value">{Math.round(calories)} kcal</span>
        </div>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 8 }}>
          This is an estimate based on the Mifflin-St Jeor formula and your activity level. It is
          informational only and not medical advice — consult a healthcare professional for
          personalized guidance.
        </p>
      </div>
    </div>
  );
}
