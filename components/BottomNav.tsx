"use client";

import { useApp } from "@/lib/AppContext";

export interface TabDef {
  id: string;
  label: string;
}

export const TABS: TabDef[] = [
  { id: "calculator", label: "Calculator" },
  { id: "scientific", label: "Scientific" },
  { id: "tip", label: "Tip" },
  { id: "split", label: "Split" },
  { id: "discount", label: "Discount" },
  { id: "unitprice", label: "Unit Price" },
  { id: "converter", label: "Converter" },
  { id: "loan", label: "Loan" },
  { id: "health", label: "Health" },
  { id: "settings", label: "Settings" },
];

interface BottomNavProps {
  active: string;
  onChange: (id: string) => void;
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  const { theme } = useApp();

  return (
    <nav
      className="bottom-nav-wrap"
      role="tablist"
      aria-label="Calculator tools"
    >
      <div className="bottom-nav-scroll">
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-label={tab.label}
              onClick={() => onChange(tab.id)}
              className={`nav-pill ${isActive ? "nav-pill-active" : ""}`}
              style={
                {
                  "--pill-color": isActive ? theme.primary : theme.secondary,
                } as React.CSSProperties
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
