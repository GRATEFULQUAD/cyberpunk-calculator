"use client";

import { useEffect, useMemo, useState } from "react";
import {
  UNIT_CATEGORIES,
  UnitCategory,
  convertUnit,
} from "@/lib/conversions";
import { loadJSON, saveJSON } from "@/lib/settings";

const CATEGORY_ORDER: UnitCategory[] = [
  "length",
  "weight",
  "temperature",
  "volume",
  "speed",
  "area",
];

const CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CAD",
  "AUD",
  "CHF",
  "CNY",
  "INR",
  "MXN",
  "BRL",
  "SGD",
  "NZD",
  "SEK",
  "NOK",
  "ZAR",
  "HKD",
  "KRW",
];

interface RateCache {
  base: string;
  date: string;
  rates: Record<string, number>;
  fetchedAt: number;
}

const RATE_CACHE_KEY = "cyberpunk-calc-rate-cache-v1";

export function ConverterScreen() {
  const [category, setCategory] = useState<UnitCategory | "currency">("length");

  return (
    <div>
      <h2 className="screen-title">Converter</h2>
      <div className="glass-panel">
        <div className="chip-row">
          {CATEGORY_ORDER.map((c) => (
            <button
              key={c}
              className={`chip-btn ${category === c ? "chip-btn-active" : ""}`}
              onClick={() => setCategory(c)}
            >
              {UNIT_CATEGORIES[c].label}
            </button>
          ))}
          <button
            className={`chip-btn ${category === "currency" ? "chip-btn-active" : ""}`}
            onClick={() => setCategory("currency")}
          >
            Currency
          </button>
        </div>
      </div>

      {category === "currency" ? (
        <CurrencyConverter />
      ) : (
        <UnitConverter category={category} />
      )}
    </div>
  );
}

function UnitConverter({ category }: { category: UnitCategory }) {
  const units = UNIT_CATEGORIES[category].units;
  const [from, setFrom] = useState(units[0].key);
  const [to, setTo] = useState(units[1]?.key ?? units[0].key);
  const [amount, setAmount] = useState("1");

  useEffect(() => {
    setFrom(units[0].key);
    setTo(units[1]?.key ?? units[0].key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const amountNum = parseFloat(amount) || 0;
  const result = useMemo(() => convertUnit(category, from, to, amountNum), [category, from, to, amountNum]);

  return (
    <div className="glass-panel">
      <label className="neon-label">Amount</label>
      <input
        className="neon-input"
        type="number"
        inputMode="decimal"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <div style={{ height: 12 }} />

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <select className="neon-select" value={from} onChange={(e) => setFrom(e.target.value)}>
          {units.map((u) => (
            <option key={u.key} value={u.key}>
              {u.label}
            </option>
          ))}
        </select>
        <button
          className="swap-btn"
          aria-label="Swap units"
          onClick={() => {
            setFrom(to);
            setTo(from);
          }}
        >
          ⇄
        </button>
        <select className="neon-select" value={to} onChange={(e) => setTo(e.target.value)}>
          {units.map((u) => (
            <option key={u.key} value={u.key}>
              {u.label}
            </option>
          ))}
        </select>
      </div>

      <div className="result-row" style={{ marginTop: 14 }}>
        <span>Result</span>
        <span className="result-value">
          {Number.isFinite(result) ? result.toLocaleString(undefined, { maximumFractionDigits: 6 }) : "—"}
        </span>
      </div>
    </div>
  );
}

function CurrencyConverter() {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [amount, setAmount] = useState("1");
  const [cache, setCache] = useState<RateCache | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [isCached, setIsCached] = useState(false);

  useEffect(() => {
    const stored = loadJSON<RateCache | null>(RATE_CACHE_KEY, null);
    if (stored) setCache(stored);

    let cancelled = false;
    async function fetchRates() {
      setLoading(true);
      try {
        const res = await fetch(`/api/rates?base=${from}`);
        if (!res.ok) throw new Error("bad response");
        const data = await res.json();
        if (cancelled) return;
        const fresh: RateCache = {
          base: data.base,
          date: data.date,
          rates: data.rates,
          fetchedAt: Date.now(),
        };
        setCache(fresh);
        saveJSON(RATE_CACHE_KEY, fresh);
        setFetchError(false);
        setIsCached(false);
      } catch {
        if (cancelled) return;
        setFetchError(true);
        setIsCached(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchRates();
    return () => {
      cancelled = true;
    };
  }, [from]);

  const rate =
    cache && cache.rates[to] !== undefined
      ? cache.base === from
        ? cache.rates[to]
        : null
      : null;

  const amountNum = parseFloat(amount) || 0;
  const converted = rate !== null ? amountNum * rate : null;

  return (
    <div className="glass-panel">
      <label className="neon-label">Amount</label>
      <input
        className="neon-input"
        type="number"
        inputMode="decimal"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <div style={{ height: 12 }} />

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <select className="neon-select" value={from} onChange={(e) => setFrom(e.target.value)}>
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          className="swap-btn"
          aria-label="Swap currencies"
          onClick={() => {
            setFrom(to);
            setTo(from);
          }}
        >
          ⇄
        </button>
        <select className="neon-select" value={to} onChange={(e) => setTo(e.target.value)}>
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="result-row" style={{ marginTop: 14 }}>
        <span>Converted Amount</span>
        <span className="result-value">
          {converted !== null
            ? converted.toLocaleString(undefined, { maximumFractionDigits: 4 })
            : "—"}{" "}
          {to}
        </span>
      </div>
      {rate !== null && (
        <div className="result-row">
          <span>Exchange Rate</span>
          <span className="result-value">
            1 {from} = {rate.toFixed(4)} {to}
          </span>
        </div>
      )}

      <div style={{ marginTop: 10, fontSize: "12px", color: "rgba(255,255,255,0.55)" }}>
        {loading && "Fetching live rates…"}
        {!loading && !fetchError && cache && (
          <>Live rates as of {cache.date} · updated {new Date(cache.fetchedAt).toLocaleTimeString()}</>
        )}
        {!loading && fetchError && !cache && (
          <span style={{ color: "rgba(255,150,150,0.9)" }}>
            ⚠ Live rates unavailable right now, and no cached rates are saved on this device yet.
            Connect to the internet once to fetch rates.
          </span>
        )}
        {!loading && fetchError && cache && (
          <span style={{ color: "rgba(255,210,120,0.9)" }}>
            ⚠ Live rates unavailable — showing CACHED rates from {cache.date} (
            {new Date(cache.fetchedAt).toLocaleString()}).
          </span>
        )}
      </div>
    </div>
  );
}
