"use client";

import { useApp } from "@/lib/AppContext";
import { ParticleField } from "./ParticleField";
import { PARTICLE_DENSITY_COUNTS } from "@/lib/settings";

export function AppBackground() {
  const { settings, theme, ready } = useApp();
  if (!ready) return null;

  return (
    <ParticleField
      colors={theme.particleColors}
      count={PARTICLE_DENSITY_COUNTS[settings.particleDensity]}
      randomize={settings.randomizeBackground}
      reduceEffects={settings.reduceEffects}
      themeKey={theme.id}
    />
  );
}
