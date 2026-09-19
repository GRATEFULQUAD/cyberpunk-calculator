"use client";

import { useApp } from "@/lib/AppContext";
import { THEMES } from "@/lib/themes";
import { ParticleDensity } from "@/lib/settings";

const DENSITIES: { id: ParticleDensity; label: string }[] = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium" },
  { id: "high", label: "High" },
  { id: "insane", label: "Insane (~2300)" },
];

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="result-row">
      <span>{label}</span>
      <button
        role="switch"
        aria-checked={value}
        aria-label={label}
        onClick={() => onChange(!value)}
        style={{
          width: 50,
          height: 28,
          borderRadius: 999,
          border: `1.5px solid rgba(${value ? "87,255,140" : "255,255,255"},0.7)`,
          background: "#030303",
          boxShadow: value ? "0 0 10px rgba(87,255,140,0.5)" : "none",
          position: "relative",
          transition: "all 0.15s ease",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: 2,
            left: value ? 24 : 2,
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: value ? "rgb(87,255,140)" : "rgba(255,255,255,0.6)",
            transition: "left 0.15s ease",
            boxShadow: value ? "0 0 8px rgb(87,255,140)" : "none",
          }}
        />
      </button>
    </div>
  );
}

export function SettingsScreen() {
  const { settings, updateSettings, resetSettings, theme } = useApp();

  return (
    <div>
      <h2 className="screen-title">Settings</h2>

      <div className="glass-panel">
        <span className="section-heading">Theme</span>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 10,
          }}
        >
          {THEMES.map((t) => {
            const active = t.id === settings.themeId;
            return (
              <button
                key={t.id}
                onClick={() => updateSettings({ themeId: t.id })}
                style={{
                  borderRadius: 14,
                  border: `1.5px solid rgba(${t.primary},${active ? 1 : 0.5})`,
                  background: "#030303",
                  padding: "12px 10px",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  boxShadow: active
                    ? `0 0 16px rgba(${t.primary},0.7), inset 0 0 10px rgba(${t.primary},0.15)`
                    : `0 0 6px rgba(${t.primary},0.2)`,
                  textAlign: "left",
                }}
              >
                {t.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="glass-panel">
        <span className="section-heading">Particle Density</span>
        <div className="chip-row">
          {DENSITIES.map((d) => (
            <button
              key={d.id}
              className={`chip-btn ${settings.particleDensity === d.id ? "chip-btn-active" : ""}`}
              onClick={() => updateSettings({ particleDensity: d.id })}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel">
        <span className="section-heading">Behavior</span>
        <ToggleRow
          label="Randomize background on open"
          value={settings.randomizeBackground}
          onChange={(v) => updateSettings({ randomizeBackground: v })}
        />
        <ToggleRow
          label="Reduce visual effects"
          value={settings.reduceEffects}
          onChange={(v) => updateSettings({ reduceEffects: v })}
        />
        <ToggleRow
          label="Remember last calculator screen"
          value={settings.rememberLastScreen}
          onChange={(v) => updateSettings({ rememberLastScreen: v })}
        />
        <ToggleRow
          label="Sound effects"
          value={settings.soundEffects}
          onChange={(v) => updateSettings({ soundEffects: v })}
        />
      </div>

      <div className="glass-panel">
        <span className="section-heading">Decimal Precision</span>
        <div className="chip-row">
          {[0, 1, 2, 3, 4].map((p) => (
            <button
              key={p}
              className={`chip-btn ${settings.decimalPrecision === p ? "chip-btn-active" : ""}`}
              onClick={() => updateSettings({ decimalPrecision: p })}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel">
        <button
          className="chip-btn"
          style={{ width: "100%", textAlign: "center", color: "rgb(255,90,90)" }}
          onClick={() => {
            if (confirm("Reset all settings to default? This cannot be undone.")) {
              resetSettings();
            }
          }}
        >
          Reset Settings to Default
        </button>
      </div>

      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textAlign: "center", marginTop: 4 }}>
        All settings are stored locally on this device only. No account, no server, no tracking.
      </p>
    </div>
  );
}
