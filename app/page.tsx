"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/lib/AppContext";
import { BottomNav } from "@/components/BottomNav";
import { StandardCalculator } from "@/components/screens/StandardCalculator";
import { ScientificCalculator } from "@/components/screens/ScientificCalculator";
import { TipCalculator } from "@/components/screens/TipCalculator";
import { SplitCalculator } from "@/components/screens/SplitCalculator";
import { DiscountCalculator } from "@/components/screens/DiscountCalculator";
import { UnitPriceCalculator } from "@/components/screens/UnitPriceCalculator";
import { ConverterScreen } from "@/components/screens/ConverterScreen";
import { LoanCalculator } from "@/components/screens/LoanCalculator";
import { HealthCalculator } from "@/components/screens/HealthCalculator";
import { SettingsScreen } from "@/components/screens/SettingsScreen";

export const dynamic = "force-dynamic";

export default function Home() {
  const { settings, updateSettings, ready } = useApp();
  const [active, setActive] = useState("calculator");

  useEffect(() => {
    if (ready && settings.rememberLastScreen && settings.lastScreen) {
      setActive(settings.lastScreen);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  const handleChange = (id: string) => {
    setActive(id);
    if (settings.rememberLastScreen) updateSettings({ lastScreen: id });
  };

  if (!ready) return null;

  return (
    <>
      <div className="app-content">
        <Screen id="calculator" active={active}>
          <StandardCalculator />
        </Screen>
        <Screen id="scientific" active={active}>
          <ScientificCalculator />
        </Screen>
        <Screen id="tip" active={active}>
          <TipCalculator />
        </Screen>
        <Screen id="split" active={active}>
          <SplitCalculator />
        </Screen>
        <Screen id="discount" active={active}>
          <DiscountCalculator />
        </Screen>
        <Screen id="unitprice" active={active}>
          <UnitPriceCalculator />
        </Screen>
        <Screen id="converter" active={active}>
          <ConverterScreen />
        </Screen>
        <Screen id="loan" active={active}>
          <LoanCalculator />
        </Screen>
        <Screen id="health" active={active}>
          <HealthCalculator />
        </Screen>
        <Screen id="settings" active={active}>
          <SettingsScreen />
        </Screen>
      </div>
      <BottomNav active={active} onChange={handleChange} />
    </>
  );
}

function Screen({
  id,
  active,
  children,
}: {
  id: string;
  active: string;
  children: React.ReactNode;
}) {
  const isActive = id === active;
  return (
    <div
      role="tabpanel"
      aria-hidden={!isActive}
      style={{ display: isActive ? "block" : "none" }}
      className="screen"
    >
      {children}
    </div>
  );
}
